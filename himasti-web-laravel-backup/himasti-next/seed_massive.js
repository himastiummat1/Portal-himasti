const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const languages = [
  {
    name: "PHP",
    templates: [
      { title: "Query Builder (ORM) Dasar", desc: "Contoh implementasi query ke database menggunakan metode ORM sederhana.", code: "<?php\nclass QueryBuilder {\n  protected $table;\n  public function get() {\n    return \"SELECT * FROM {$this->table}\";\n  }\n}\n?>" },
      { title: "Autentikasi JWT Dasar", desc: "Membuat JSON Web Token untuk API keamanan di PHP.", code: "<?php\nfunction generateJWT($payload, $secret) {\n  $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);\n  $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));\n  return $base64UrlHeader;\n}\n?>" },
      { title: "Upload File Sederhana", desc: "Menerima dan memindahkan file yang diunggah oleh user.", code: "<?php\n$target_dir = 'uploads/';\n$target_file = $target_dir . basename($_FILES['fileToUpload']['name']);\nmove_uploaded_file($_FILES['fileToUpload']['tmp_name'], $target_file);\n?>" },
      { title: "CURL Request GET", desc: "Melakukan HTTP GET request menggunakan CURL di PHP.", code: "<?php\n$ch = curl_init();\ncurl_setopt($ch, CURLOPT_URL, 'https://api.github.com');\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);\n$output = curl_exec($ch);\ncurl_close($ch);\n?>" }
    ]
  },
  {
    name: "JavaScript",
    templates: [
      { title: "Debounce Function", desc: "Membatasi eksekusi fungsi yang dipanggil terlalu sering (seperti input search).", code: "function debounce(func, wait) {\n  let timeout;\n  return function executedFunction(...args) {\n    const later = () => { clearTimeout(timeout); func(...args); };\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n  };\n}" },
      { title: "Array Map & Filter", desc: "Menggabungkan fungsi map dan filter untuk memanipulasi array JSON.", code: "const data = [{id: 1, active: true}, {id: 2, active: false}];\nconst activeIds = data.filter(d => d.active).map(d => d.id);\nconsole.log(activeIds);" },
      { title: "LocalStorage Wrapper", desc: "Menyimpan dan mengambil data JSON ke dalam LocalStorage.", code: "const storage = {\n  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),\n  get: (key) => JSON.parse(localStorage.getItem(key))\n};" },
      { title: "Random Hex Color", desc: "Menghasilkan string warna Hex secara acak.", code: "const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);\nconsole.log(randomColor());" }
    ]
  },
  {
    name: "Python",
    templates: [
      { title: "Scraping dengan BeautifulSoup", desc: "Mengambil judul dari halaman web HTML sederhana.", code: "from bs4 import BeautifulSoup\nimport requests\nres = requests.get('https://example.com')\nsoup = BeautifulSoup(res.text, 'html.parser')\nprint(soup.title.string)" },
      { title: "List Comprehension Dasar", desc: "Memfilter bilangan genap dari list menggunakan satu baris kode.", code: "numbers = [1, 2, 3, 4, 5, 6]\neven = [x for x in numbers if x % 2 == 0]\nprint(even)" },
      { title: "Koneksi SQLite3", desc: "Membuka dan membuat tabel menggunakan SQLite bawaan Python.", code: "import sqlite3\nconn = sqlite3.connect('test.db')\nc = conn.cursor()\nc.execute('''CREATE TABLE users (id real, name text)''')\nconn.commit()" },
      { title: "REST API FastAPI Dasar", desc: "Membuat endpoint Hello World menggunakan FastAPI.", code: "from fastapi import FastAPI\napp = FastAPI()\n@app.get('/')\ndef read_root():\n    return {'Hello': 'World'}" }
    ]
  },
  {
    name: "SQL",
    templates: [
      { title: "LEFT JOIN 3 Tabel", desc: "Menggabungkan tiga tabel berelasi sekaligus.", code: "SELECT u.nama, p.jabatan, d.nama_divisi\nFROM users u\nLEFT JOIN roles p ON u.role_id = p.id\nLEFT JOIN divisi d ON u.divisi_id = d.id;" },
      { title: "GROUP BY dengan HAVING", desc: "Mencari divisi yang memiliki lebih dari 10 anggota.", code: "SELECT divisi_id, COUNT(*) as total\nFROM users\nGROUP BY divisi_id\nHAVING total > 10;" },
      { title: "Subquery di WHERE", desc: "Mencari pengguna yang gajinya di atas rata-rata.", code: "SELECT nama, gaji FROM pegawai\nWHERE gaji > (SELECT AVG(gaji) FROM pegawai);" },
      { title: "Stored Procedure Insert", desc: "Contoh fungsi procedure untuk memasukkan data otomatis.", code: "CREATE PROCEDURE AddUser(IN p_name VARCHAR(50))\nBEGIN\n  INSERT INTO users(name, created_at) VALUES (p_name, NOW());\nEND;" }
    ]
  }
];

async function main() {
  const dataToInsert = [];
  
  for (const lang of languages) {
    for (let i = 1; i <= 30; i++) {
      // Pick a random template from the language
      const template = lang.templates[Math.floor(Math.random() * lang.templates.length)];
      
      dataToInsert.push({
        title: `${template.title} #${i}`,
        category: lang.name,
        description: template.desc,
        code_snippet: template.code + `\n// Contoh Snippet ke-${i} untuk ${lang.name}`
      });
    }
  }

  await prisma.itModule.createMany({
    data: dataToInsert
  });
  console.log(`Berhasil menyuntikkan ${dataToInsert.length} data snippet ke database!`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
