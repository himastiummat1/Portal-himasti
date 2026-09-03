export interface TestCase {
  input: any[];
  expected: any;
  isHidden?: boolean;
}

export interface ExampleCase {
  input: string;
  output: string;
  explanation?: string;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: "Mudah" | "Sedang" | "Sulit";
  category: "String & Array" | "Logika Matematika" | "Struktur Data" | "Algoritma Pencarian";
  xp: number;
  description: string;
  constraints: string[];
  examples: ExampleCase[];
  functionName: string;
  starterCode: string;
  hint: string;
  testCases: TestCase[];
}

export const challengesData: Challenge[] = [
  {
    id: "palindrom-check",
    title: "Cek Kata Palindrom",
    difficulty: "Mudah",
    category: "String & Array",
    xp: 50,
    description: "Buatlah fungsi yang memeriksa apakah sebuah kata atau kalimat merupakan palindrom (terbaca sama dari depan maupun dari belakang, mengabaikan spasi dan huruf besar/kecil).",
    constraints: [
      "Panjang string antara 1 hingga 500 karakter.",
      "Abaikan tanda baca, spasi, dan perbedaan huruf besar/kecil.",
      "Kembalikan nilai boolean true jika palindrom, false jika bukan."
    ],
    examples: [
      {
        input: 'isPalindrome("katak")',
        output: "true",
        explanation: '"katak" dibaca dari belakang tetap "katak".'
      },
      {
        input: 'isPalindrome("Kasur ini rusak")',
        output: "true",
        explanation: 'Setelah dihilangkan spasi dan dijadikan huruf kecil, "kasurinirusak" adalah palindrom.'
      },
      {
        input: 'isPalindrome("himasti")',
        output: "false",
        explanation: '"himasti" dibaca terbalik menjadi "itsamih", bukan palindrom.'
      }
    ],
    functionName: "isPalindrome",
    starterCode: `function isPalindrome(str) {
  // Tulis solusimu di sini
  // Tip: Bersihkan spasi dan ubah ke huruf kecil terlebih dahulu
  
  return false;
}`,
    hint: "Gunakan regex /[\\W_]/g untuk membuang karakter non-alfanumerik, lalu bandingkan string tersebut dengan hasil pembalikannya (split, reverse, join).",
    testCases: [
      { input: ["katak"], expected: true },
      { input: ["Kasur ini rusak"], expected: true },
      { input: ["himasti"], expected: false },
      { input: ["A man, a plan, a canal: Panama"], expected: true, isHidden: true },
      { input: ["teknik informatika"], expected: false, isHidden: true }
    ]
  },
  {
    id: "prime-number",
    title: "Detektor Bilangan Prima",
    difficulty: "Mudah",
    category: "Logika Matematika",
    xp: 50,
    description: "Bilangan prima adalah bilangan bulat positif lebih besar dari 1 yang hanya memiliki dua pembagi, yaitu 1 dan dirinya sendiri. Buatlah fungsi yang menentukan apakah angka masukan n adalah bilangan prima.",
    constraints: [
      "Nilai n berupa bilangan bulat dari -100 hingga 100.000.",
      "Angka kurang dari atau sama dengan 1 BUKAN bilangan prima."
    ],
    examples: [
      { input: "isPrime(7)", output: "true", explanation: "7 hanya bisa dibagi 1 dan 7." },
      { input: "isPrime(10)", output: "false", explanation: "10 bisa dibagi 1, 2, 5, dan 10." },
      { input: "isPrime(1)", output: "false", explanation: "1 bukan bilangan prima berdasarkan definisi matematika." }
    ],
    functionName: "isPrime",
    starterCode: `function isPrime(n) {
  // Tulis solusimu di sini
  
  return false;
}`,
    hint: "Kamu tidak perlu memeriksa sampai n. Cukup periksa pembagi dari 2 hingga akar kuadrat dari n (Math.sqrt(n)).",
    testCases: [
      { input: [7], expected: true },
      { input: [10], expected: false },
      { input: [1], expected: false },
      { input: [2], expected: true, isHidden: true },
      { input: [97], expected: true, isHidden: true },
      { input: [100], expected: false, isHidden: true }
    ]
  },
  {
    id: "two-sum",
    title: "Penjumlahan Dua Angka (Two Sum)",
    difficulty: "Sedang",
    category: "String & Array",
    xp: 100,
    description: "Diberikan array berisi angka-angka dan sebuah angka target. Temukan indeks dari dua angka di dalam array tersebut yang jika dijumlahkan menghasilkan nilai target. Kembalikan array berisi kedua indeks tersebut [i, j]. Asumsikan selalu ada tepat satu solusi.",
    constraints: [
      "Panjang array angka antara 2 hingga 10.000.",
      "Elemen array dapat bernilai negatif maupun positif.",
      "Elemen yang sama tidak boleh digunakan dua kali."
    ],
    examples: [
      {
        input: "twoSum([2, 7, 11, 15], 9)",
        output: "[0, 1]",
        explanation: "Karena nums[0] + nums[1] == 2 + 7 == 9, maka indeks [0, 1] dikembalikan."
      },
      {
        input: "twoSum([3, 2, 4], 6)",
        output: "[1, 2]",
        explanation: "nums[1] + nums[2] == 2 + 4 == 6."
      }
    ],
    functionName: "twoSum",
    starterCode: `function twoSum(nums, target) {
  // Tulis solusimu di sini
  // Coba gunakan objek / Map untuk solusi O(n) yang efisien!
  
  return [];
}`,
    hint: "Simpan selisih (target - angkaSaatIni) ke dalam objek Map sebagai kunci, dan indeksnya sebagai nilai.",
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] },
      { input: [[-1, -2, -3, -4, -5], -8], expected: [2, 4], isHidden: true }
    ]
  },
  {
    id: "valid-parentheses",
    title: "Validasi Tanda Kurung (Stack)",
    difficulty: "Sedang",
    category: "Struktur Data",
    xp: 100,
    description: "Diberikan string yang hanya berisi karakter kurung '(', ')', '{', '}', '[', dan ']'. Tentukan apakah string tersebut valid! String dianggap valid jika kurung buka ditutup oleh tipe kurung yang sama dan dalam urutan yang tepat.",
    constraints: [
      "Panjang string antara 1 hingga 10.000 karakter.",
      "String hanya berisi karakter kurung: '()[]{}'."
    ],
    examples: [
      { input: 'isValidParentheses("()")', output: "true" },
      { input: 'isValidParentheses("()[]{}")', output: "true" },
      { input: 'isValidParentheses("(]")', output: "false" },
      { input: 'isValidParentheses("([)]")', output: "false" }
    ],
    functionName: "isValidParentheses",
    starterCode: `function isValidParentheses(s) {
  // Tulis solusimu di sini
  // Gunakan struktur data Array sebagai Stack (push & pop)
  
  return false;
}`,
    hint: "Setiap kali bertemu kurung buka, masukkan ke tumpukan (push). Setiap bertemu kurung tutup, keluarkan elemen terakhir dari tumpukan (pop) dan cek apakah cocok pasangannya.",
    testCases: [
      { input: ["()"], expected: true },
      { input: ["()[]{}"], expected: true },
      { input: ["(]"], expected: false },
      { input: ["([)]"], expected: false },
      { input: ["{[]}"], expected: true, isHidden: true },
      { input: [""], expected: true, isHidden: true },
      { input: ["[()"], expected: false, isHidden: true }
    ]
  },
  {
    id: "hitung-kas",
    title: "Kalkulasi Saldo Kas Himpunan",
    difficulty: "Mudah",
    category: "String & Array",
    xp: 50,
    description: "Bendahara HIMASTI mencatat mutasi keuangan dalam array transaksi. Setiap elemen memiliki format objek: { tipe: 'masuk' | 'keluar', nominal: number }. Buatlah fungsi yang menghitung saldo akhir kas.",
    constraints: [
      "Nominal selalu angka positif lebih dari 0.",
      "Tipe hanya bisa 'masuk' (menambah saldo) atau 'keluar' (mengurangi saldo).",
      "Saldo awal adalah 0."
    ],
    examples: [
      {
        input: "hitungSaldo([{ tipe: 'masuk', nominal: 50000 }, { tipe: 'keluar', nominal: 20000 }])",
        output: "30000",
        explanation: "50.000 - 20.000 = 30.000."
      }
    ],
    functionName: "hitungSaldo",
    starterCode: `function hitungSaldo(transaksi) {
  // Tulis solusimu di sini
  // Kamu bisa menggunakan perulangan for atau method .reduce()
  
  return 0;
}`,
    hint: "Gunakan method transaksi.reduce((total, t) => t.tipe === 'masuk' ? total + t.nominal : total - t.nominal, 0).",
    testCases: [
      {
        input: [[{ tipe: "masuk", nominal: 50000 }, { tipe: "keluar", nominal: 20000 }]],
        expected: 30000
      },
      {
        input: [[{ tipe: "masuk", nominal: 100000 }, { tipe: "masuk", nominal: 50000 }, { tipe: "keluar", nominal: 25000 }]],
        expected: 125000
      },
      {
        input: [[]],
        expected: 0,
        isHidden: true
      }
    ]
  },
  {
    id: "binary-search",
    title: "Pencarian Biner (Binary Search)",
    difficulty: "Sedang",
    category: "Algoritma Pencarian",
    xp: 100,
    description: "Diberikan array bilangan bulat yang SUDAH TERURUT NAIK dan sebuah angka target. Tulis fungsi pencarian biner untuk menemukan target. Jika target ada dalam array, kembalikan indeksnya; jika tidak ada, kembalikan -1. Algoritma harus beroperasi dalam kompleksitas O(log n).",
    constraints: [
      "Array dijamin terurut naik tanpa elemen duplikat.",
      "Panjang array antara 1 hingga 20.000.",
      "DILARANG menggunakan method bawaan .indexOf()!"
    ],
    examples: [
      { input: "binarySearch([-1, 0, 3, 5, 9, 12], 9)", output: "4", explanation: "Angka 9 berada di indeks ke-4." },
      { input: "binarySearch([-1, 0, 3, 5, 9, 12], 2)", output: "-1", explanation: "Angka 2 tidak ada dalam array." }
    ],
    functionName: "binarySearch",
    starterCode: `function binarySearch(nums, target) {
  // Tulis algoritma pencarian biner O(log n)
  let left = 0;
  let right = nums.length - 1;

  // Lanjutkan loop pencarian...
  
  return -1;
}`,
    hint: "Hitung nilai tengah mid = Math.floor((left + right) / 2). Jika nums[mid] === target, kembalikan mid. Jika lebih kecil, geser left = mid + 1. Jika lebih besar, geser right = mid - 1.",
    testCases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { input: [[5], 5], expected: 0 },
      { input: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 8], expected: 7, isHidden: true }
    ]
  }
];
