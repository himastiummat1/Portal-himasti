<?php
use App\Models\ItModule;

$modules = [
    [
        'title' => 'CRUD PHP Native - Tampil Data (Select)',
        'category' => 'PHP',
        'description' => 'Contoh kode untuk mengambil dan menampilkan data dari database MySQL menggunakan ekstensi MySQLi (Object Oriented).',
        'code_snippet' => "<?php\n\$conn = new mysqli('localhost', 'root', '', 'database_name');\n\nif (\$conn->connect_error) {\n    die('Koneksi gagal: ' . \$conn->connect_error);\n}\n\n\$sql = 'SELECT id, nama, email FROM users';\n\$result = \$conn->query(\$sql);\n\nif (\$result->num_rows > 0) {\n    while(\$row = \$result->fetch_assoc()) {\n        echo 'ID: ' . \$row['id'] . ' - Nama: ' . \$row['nama'] . ' - Email: ' . \$row['email'] . '<br>';\n    }\n} else {\n    echo 'Tidak ada data';\n}\n\$conn->close();\n?>"
    ],
    [
        'title' => 'Perintah Dasar SQL (CRUD)',
        'category' => 'SQL',
        'description' => 'Kumpulan query SQL dasar untuk operasi Create, Read, Update, dan Delete.',
        'code_snippet' => "-- Membuat Tabel\nCREATE TABLE mahasiswa (\n    nim VARCHAR(10) PRIMARY KEY,\n    nama VARCHAR(100),\n    jurusan VARCHAR(50)\n);\n\n-- Menambah Data (Insert)\nINSERT INTO mahasiswa (nim, nama, jurusan) \nVALUES ('1234567890', 'Budi Santoso', 'Teknik Informatika');\n\n-- Membaca Data (Select)\nSELECT * FROM mahasiswa WHERE jurusan = 'Teknik Informatika';\n\n-- Mengubah Data (Update)\nUPDATE mahasiswa SET nama = 'Budi S.' WHERE nim = '1234567890';\n\n-- Menghapus Data (Delete)\nDELETE FROM mahasiswa WHERE nim = '1234567890';"
    ],
    [
        'title' => 'Struktur Dasar Class Java (OOP)',
        'category' => 'Java',
        'description' => 'Contoh pembuatan class Java sederhana dengan atribut, constructor, getter/setter, dan method.',
        'code_snippet' => "public class Mahasiswa {\n    private String nama;\n    private String nim;\n\n    // Constructor\n    public Mahasiswa(String nama, String nim) {\n        this.nama = nama;\n        this.nim = nim;\n    }\n\n    // Getter & Setter\n    public String getNama() {\n        return nama;\n    }\n\n    public void setNama(String nama) {\n        this.nama = nama;\n    }\n\n    // Method\n    public void belajar() {\n        System.out.println(this.nama + \" sedang belajar pemrograman.\");\n    }\n\n    public static void main(String[] args) {\n        Mahasiswa mhs1 = new Mahasiswa(\"Andi\", \"2023001\");\n        mhs1.belajar();\n    }\n}"
    ],
    [
        'title' => 'Struktur Awal Program C++',
        'category' => 'C++',
        'description' => 'Kerangka awal untuk memulai program C++ beserta contoh input dan output dasar.',
        'code_snippet' => "#include <iostream>\nusing namespace std;\n\nint main() {\n    string nama;\n    \n    cout << \"Masukkan nama Anda: \";\n    cin >> nama;\n    \n    cout << \"Halo, \" << nama << \"! Selamat datang di C++.\" << endl;\n    \n    return 0;\n}"
    ],
    [
        'title' => 'Manipulasi DOM Dasar',
        'category' => 'JavaScript',
        'description' => 'Cara mengambil elemen HTML dengan JavaScript dan mengubah teks serta warnanya saat diklik.',
        'code_snippet' => "// Mengambil elemen berdasarkan ID\nconst tombol = document.getElementById('myButton');\nconst teks = document.getElementById('myText');\n\n// Menambahkan event listener untuk interaksi klik\ntombol.addEventListener('click', function() {\n    teks.innerText = 'Teks telah diubah oleh JavaScript!';\n    teks.style.color = 'red';\n    teks.style.fontWeight = 'bold';\n});"
    ],
    [
        'title' => 'Layouting dengan Flexbox Tengah',
        'category' => 'CSS',
        'description' => 'Snippet ampuh untuk membuat suatu elemen berada tepat di tengah (vertikal dan horizontal) layar.',
        'code_snippet' => ".container {\n    display: flex;\n    justify-content: center; /* Meratakan secara horizontal */\n    align-items: center;     /* Meratakan secara vertikal */\n    height: 100vh;           /* Tinggi sepenuh layar */\n    background-color: #f3f4f6;\n}\n\n.box {\n    padding: 20px;\n    background-color: white;\n    border-radius: 8px;\n    box-shadow: 0 4px 6px rgba(0,0,0,0.1);\n}"
    ],
    [
        'title' => 'Komponen React State (useState)',
        'category' => 'React',
        'description' => 'Contoh pembuatan Functional Component di React menggunakan hooks useState untuk membuat Counter sederhana.',
        'code_snippet' => "import React, { useState } from 'react';\n\nfunction Counter() {\n    // Deklarasi variabel state bernama \"count\"\n    const [count, setCount] = useState(0);\n\n    return (\n        <div>\n            <p>Anda telah menekan tombol sebanyak {count} kali</p>\n            <button onClick={() => setCount(count + 1)}>\n                Klik Saya\n            </button>\n        </div>\n    );\n}\n\nexport default Counter;"
    ],
    [
        'title' => 'Array Map & Filter (JavaScript Modern)',
        'category' => 'JavaScript',
        'description' => 'Cara menggunakan fitur ES6 .map() dan .filter() pada Array JavaScript.',
        'code_snippet' => "const angka = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\n// Menggunakan filter untuk mengambil angka genap\nconst angkaGenap = angka.filter(num => num % 2 === 0);\nconsole.log('Angka Genap:', angkaGenap); // [2, 4, 6, 8, 10]\n\n// Menggunakan map untuk mengalikan semua elemen\nconst angkaDikaliDua = angka.map(num => num * 2);\nconsole.log('Dikali 2:', angkaDikaliDua); // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]"
    ],
    [
        'title' => 'Perulangan For dan While (Python)',
        'category' => 'Python',
        'description' => 'Struktur perulangan dasar menggunakan bahasa pemrograman Python.',
        'code_snippet' => "# Menggunakan For loop dengan range\nprint(\"For Loop:\")\nfor i in range(1, 6):\n    print(f\"Perulangan ke-{i}\")\n\nprint(\"\\nWhile Loop:\")\n# Menggunakan While loop\nangka = 1\nwhile angka <= 5:\n    print(f\"Angka: {angka}\")\n    angka += 1"
    ],
    [
        'title' => 'Perintah Dasar Git (Cheat Sheet)',
        'category' => 'Git',
        'description' => 'Kumpulan command dasar Git yang wajib dikuasai untuk version control.',
        'code_snippet' => "# Inisialisasi repository baru\ngit init\n\n# Mengecek status file (yang berubah/baru)\ngit status\n\n# Menambahkan file ke staging area\ngit add . \n\n# Menyimpan perubahan (commit)\ngit commit -m \"Menambahkan fitur X\"\n\n# Melihat riwayat commit\ngit log --oneline\n\n# Mendorong kode ke server remote (contoh: GitHub)\ngit push origin main\n\n# Menarik update terbaru dari server\ngit pull origin main"
    ]
];

foreach ($modules as $module) {
    ItModule::create($module);
}

echo "Berhasil menambah 10 modul baru.\n";
?>
