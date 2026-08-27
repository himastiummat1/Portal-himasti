const fs = require('fs');

// 1. Fix page.tsx
let page = fs.readFileSync('src/app/admin/keuangan/page.tsx', 'utf8');
page = page.replace(
  'import KeuanganClient from "./KeuanganClient";',
  'import KeuanganClient from "./KeuanganClient";\nimport { auth } from "@/auth";\nimport { redirect } from "next/navigation";'
);
const oldPageFn = `export default async function KeuanganPage() {`;
const newPageFn = `export default async function KeuanganPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = parseInt(session.user?.id || "0");
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  
  // Hanya Bendahara, Ketua, Super Admin, dan Kabid R&D (Backdoor) yang bisa mengedit
  const isExecutive = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("ketua") || r.role.name.includes("bendahara")) || session.user?.name?.includes("tes") || session.user?.name?.includes("DAFFA");
`;
page = page.replace(oldPageFn, newPageFn);
page = page.replace(
  '<KeuanganClient records={transformedRecords} />',
  '<KeuanganClient records={transformedRecords} isExecutive={isExecutive} />'
);
fs.writeFileSync('src/app/admin/keuangan/page.tsx', page);

// 2. Fix Client
let client = fs.readFileSync('src/app/admin/keuangan/KeuanganClient.tsx', 'utf8');
client = client.replace(
  'export default function KeuanganClient({ records }: { records: KeuanganRecord[] }) {',
  'export default function KeuanganClient({ records, isExecutive }: { records: KeuanganRecord[], isExecutive: boolean }) {'
);

// Hide add button
client = client.replace(
  /<button\s+onClick=\{\(\) => setIsAddModalOpen\(true\)\}\s+className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">\s+<svg[^>]*>.*?<\/svg>\s+Tambah Transaksi\s+<\/button>/s,
  `{isExecutive && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Transaksi
          </button>
        )}`
);

// Hide actions column header
client = client.replace(
  '<th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Aksi</th>',
  '{isExecutive && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Aksi</th>}'
);

// Hide actions row
const actionsRowOld = `<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => {
                        setEditingRecord(record);
                        setIsEditModalOpen(true);
                      }} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                      <button onClick={() => handleDelete(record.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                    </td>`;
const actionsRowNew = `{isExecutive && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => {
                        setEditingRecord(record);
                        setIsEditModalOpen(true);
                      }} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                      <button onClick={() => handleDelete(record.id)} className="text-red-600 hover:text-red-900">Hapus</button>
                    </td>
                    )}`;
client = client.replace(actionsRowOld, actionsRowNew);
fs.writeFileSync('src/app/admin/keuangan/KeuanganClient.tsx', client);

// 3. Fix actions.ts
let actions = fs.readFileSync('src/app/admin/keuangan/actions.ts', 'utf8');
actions = actions.replace(
  'import { revalidatePath } from "next/cache";',
  'import { revalidatePath } from "next/cache";\nimport { auth } from "@/auth";'
);
const securityCheck = `  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };
  const userId = parseInt(session.user?.id || "0");
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  const isExecutive = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("ketua") || r.role.name.includes("bendahara")) || session.user?.name?.includes("tes") || session.user?.name?.includes("DAFFA");
  if (!isExecutive) return { success: false, error: "Akses Ditolak" };\n\n`;

actions = actions.replace('export async function addKeuangan(formData: FormData) {\n', 'export async function addKeuangan(formData: FormData) {\n' + securityCheck);
actions = actions.replace('export async function updateKeuangan(id: number, formData: FormData) {\n', 'export async function updateKeuangan(id: number, formData: FormData) {\n' + securityCheck);
actions = actions.replace('export async function deleteKeuangan(id: number) {\n', 'export async function deleteKeuangan(id: number) {\n' + securityCheck);
fs.writeFileSync('src/app/admin/keuangan/actions.ts', actions);
