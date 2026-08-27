const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.itModule.createMany({
    data: [
      {
        title: "Koneksi PDO MySQL",
        category: "PHP",
        description: "Cara aman koneksi ke database MySQL menggunakan PDO untuk mencegah SQL Injection.",
        code_snippet: "<?php\n$host = '127.0.0.1';\n$db   = 'himasti_db';\n$user = 'root';\n$pass = '';\n$charset = 'utf8mb4';\n\n$dsn = \"mysql:host=$host;dbname=$db;charset=$charset\";\n$options = [\n    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,\n    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,\n    PDO::ATTR_EMULATE_PREPARES   => false,\n];\ntry {\n     $pdo = new PDO($dsn, $user, $pass, $options);\n} catch (\\PDOException $e) {\n     throw new \\PDOException($e->getMessage(), (int)$e->getCode());\n}\n?>"
      },
      {
        title: "Fetch API GET Request",
        category: "JavaScript",
        description: "Mengambil data JSON dari REST API secara asynchronous.",
        code_snippet: "async function fetchUsers() {\n  try {\n    const response = await fetch('https://jsonplaceholder.typicode.com/users');\n    if (!response.ok) throw new Error('Network response was not ok');\n    \n    const data = await response.json();\n    console.log(data);\n  } catch (error) {\n    console.error('Fetch error:', error);\n  }\n}\n\nfetchUsers();"
      },
      {
        title: "Tailwind CSS Centering",
        category: "CSS",
        description: "Cara paling cepat menengahkan elemen secara vertikal dan horizontal dengan flexbox Tailwind.",
        code_snippet: "<div class=\"flex items-center justify-center min-h-screen bg-gray-100\">\n  <div class=\"bg-white p-8 rounded-xl shadow-lg\">\n    <h1 class=\"text-2xl font-bold text-gray-800\">Tengah Sempurna!</h1>\n  </div>\n</div>"
      },
      {
        title: "Pandas CSV to JSON",
        category: "Python",
        description: "Membaca file CSV dan mengubahnya menjadi format JSON menggunakan library Pandas.",
        code_snippet: "import pandas as pd\n\n# Membaca dataset CSV\ndf = pd.read_csv('data_mahasiswa.csv')\n\n# Membersihkan data kosong\ndf = df.dropna()\n\n# Konversi ke format JSON record\njson_data = df.to_json(orient='records', indent=4)\n\nwith open('output.json', 'w') as file:\n    file.write(json_data)\n\nprint(\"Konversi sukses!\")"
      }
    ]
  });
  console.log("Seeding snippet berhasil!");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
