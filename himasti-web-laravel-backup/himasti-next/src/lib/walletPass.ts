import crypto from "crypto";
import zlib from "zlib";
import fs from "fs";
import path from "path";

// Standard CRC32 table for pure Node zip generation
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c >>> 0;
}

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

interface ZipEntry {
  name: string;
  data: Buffer;
}

export function createZipBuffer(entries: ZipEntry[]): Buffer {
  const localHeaders: Buffer[] = [];
  const centralHeaders: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, "utf8");
    const uncompressedData = entry.data;
    const crc = crc32(uncompressedData);
    const compressedData = zlib.deflateRawSync(uncompressedData);
    const isCompressed = compressedData.length < uncompressedData.length;
    const dataToWrite = isCompressed ? compressedData : uncompressedData;
    const method = isCompressed ? 8 : 0;

    // Local Header (30 bytes + name)
    const localHeader = Buffer.alloc(30 + nameBuf.length);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(method, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(dataToWrite.length, 18);
    localHeader.writeUInt32LE(uncompressedData.length, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);
    nameBuf.copy(localHeader, 30);

    localHeaders.push(localHeader, dataToWrite);

    // Central Header (46 bytes + name)
    const centralHeader = Buffer.alloc(46 + nameBuf.length);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(method, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(dataToWrite.length, 20);
    centralHeader.writeUInt32LE(uncompressedData.length, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    nameBuf.copy(centralHeader, 46);

    centralHeaders.push(centralHeader);

    offset += localHeader.length + dataToWrite.length;
  }

  const centralDirBuffer = Buffer.concat(centralHeaders);

  // EOCD (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralDirBuffer.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localHeaders, centralDirBuffer, eocd]);
}

export interface MemberPassData {
  name: string;
  nim: string;
  angkatan: string;
  role?: string;
  title?: string;
  email?: string;
}

export function generatePassJson(data: MemberPassData) {
  const qrPayload = JSON.stringify({
    type: "himasti_kta",
    nim: data.nim,
    name: data.name,
    org: "HIMASTI UMMAT",
    verified: true
  });

  return {
    formatVersion: 1,
    passTypeIdentifier: "pass.id.himasti.ummat.kta",
    serialNumber: `HIMASTI-${data.nim.replace(/[^a-zA-Z0-9]/g, "")}`,
    teamIdentifier: "HIMASTI01",
    organizationName: "HIMASTI UMMAT",
    description: "Kartu Tanda Anggota HIMASTI UMMAT",
    logoText: "HIMASTI",
    foregroundColor: "rgb(255, 255, 255)",
    backgroundColor: "rgb(15, 23, 42)", // Slate 900
    labelColor: "rgb(56, 189, 248)",   // Sky 400
    generic: {
      primaryFields: [
        {
          key: "member",
          label: "NAMA KADER",
          value: data.name
        }
      ],
      secondaryFields: [
        {
          key: "nim",
          label: "NIM MAHASISWA",
          value: data.nim
        },
        {
          key: "angkatan",
          label: "ANGKATAN",
          value: data.angkatan || "2024"
        }
      ],
      auxiliaryFields: [
        {
          key: "status",
          label: "STATUS",
          value: data.role || "Kader Aktif"
        },
        {
          key: "title",
          label: "GELAR",
          value: data.title || "Kader Muda"
        }
      ],
      backFields: [
        {
          key: "header",
          label: "IDENTITAS RESMI",
          value: "Kartu Tanda Anggota Resmi Himpunan Mahasiswa Sistem & Teknologi Informasi (HIMASTI) Fakultas Teknik Universitas Muhammadiyah Mataram."
        },
        {
          key: "rules",
          label: "KETENTUAN PENGGUNAAN",
          value: "1. Kartu ini sah untuk presensi kegiatan, hak suara dalam musyawarah himpunan, dan akses resource internal.\n2. Tidak dapat dipindahtangankan kepada pihak ketiga.\n3. Laporkan jika kartu hilang atau terjadi penyalahgunaan akun."
        },
        {
          key: "email",
          label: "EMAIL TERDAFTAR",
          value: data.email || "-"
        },
        {
          key: "portal",
          label: "PORTAL RESMI",
          value: "https://himasti.ummat.ac.id"
        }
      ]
    },
    barcodes: [
      {
        format: "PKBarcodeFormatQR",
        message: qrPayload,
        messageEncoding: "iso-8859-1",
        altText: `NIM: ${data.nim}`
      }
    ],
    barcode: {
      format: "PKBarcodeFormatQR",
      message: qrPayload,
      messageEncoding: "iso-8859-1",
      altText: `NIM: ${data.nim}`
    }
  };
}

export function buildPkpassBuffer(data: MemberPassData): Buffer {
  const passJsonObj = generatePassJson(data);
  const passJsonBuffer = Buffer.from(JSON.stringify(passJsonObj, null, 2), "utf8");

  // Read logo from public directory
  let logoBuffer: Buffer;
  const logoPath = path.join(process.cwd(), "public/images/logo-himasti.png");
  if (fs.existsSync(logoPath)) {
    logoBuffer = fs.readFileSync(logoPath);
  } else {
    // 1x1 transparent PNG fallback
    logoBuffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
  }

  // Create manifest
  const manifest: Record<string, string> = {
    "pass.json": crypto.createHash("sha1").update(passJsonBuffer).digest("hex"),
    "icon.png": crypto.createHash("sha1").update(logoBuffer).digest("hex"),
    "icon@2x.png": crypto.createHash("sha1").update(logoBuffer).digest("hex"),
    "logo.png": crypto.createHash("sha1").update(logoBuffer).digest("hex"),
    "logo@2x.png": crypto.createHash("sha1").update(logoBuffer).digest("hex")
  };
  const manifestBuffer = Buffer.from(JSON.stringify(manifest, null, 2), "utf8");

  const entries: ZipEntry[] = [
    { name: "pass.json", data: passJsonBuffer },
    { name: "manifest.json", data: manifestBuffer },
    { name: "icon.png", data: logoBuffer },
    { name: "icon@2x.png", data: logoBuffer },
    { name: "logo.png", data: logoBuffer },
    { name: "logo@2x.png", data: logoBuffer }
  ];

  return createZipBuffer(entries);
}
