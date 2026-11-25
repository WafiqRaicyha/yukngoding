import { DailyChallengeItem, Kuis } from '../types';

export const KUIS_LIST: Kuis[] = [
  // ==================== PYTHON ====================
  {
    id: 'q-py-1a',
    materiId: 'py-1',
    pertanyaan: 'Manakah tipe data yang tepat untuk nilai 3.14 di Python?',
    pilihanJawaban: ['int', 'str', 'float', 'bool'],
    jawabanBenar: 2,
    penjelasan:
      'Angka yang memiliki titik desimal (seperti 3.14) bertipe float di Python, sedangkan int khusus untuk bilangan bulat.',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-py-1b',
    materiId: 'py-1',
    pertanyaan: 'Manakah penulisan nama variabel yang VALID di Python?',
    pilihanJawaban: ['2skor_user', 'skor user', 'skor_user', 'skor-user'],
    jawabanBenar: 2,
    penjelasan:
      'Nama variabel Python hanya boleh berisi huruf, angka, dan garis bawah (_), serta tidak boleh diawali angka atau mengandung spasi/tanda hubung.',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-py-2a',
    materiId: 'py-2',
    pertanyaan: 'Apa hasil output dari potongan kode Python berikut?',
    potonganKode: `nilai = 78
if nilai >= 85:
    print("A")
elif nilai >= 75:
    print("B")
else:
    print("C")`,
    pilihanJawaban: ['A', 'B', 'C', 'Tidak menampilkan apa pun'],
    jawabanBenar: 1,
    penjelasan:
      'Karena 78 < 85, syarat if bernilai False. Python lalu mengecek elif nilai >= 75 yang bernilai True sehingga mencetak "B".',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-py-2b',
    materiId: 'py-2',
    pertanyaan: 'Mengapa indentasi (spasi di awal baris) sangat penting pada percabangan Python?',
    pilihanJawaban: [
      'Hanya agar kode terlihat rapi tanpa pengaruh ke program',
      'Untuk menentukan baris kode mana yang termasuk dalam blok if/elif/else',
      'Untuk mempercepat kecepatan internet saat menjalankan kode',
      'Agar variabel berubah menjadi tipe teks',
    ],
    jawabanBenar: 1,
    penjelasan:
      'Python menggunakan indentasi sebagai penanda blok kode (pengganti kurung kurawal). Indentasi yang salah menyebabkan IndentationError.',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-py-3a',
    materiId: 'py-3',
    pertanyaan: 'Angka apa saja yang dihasilkan oleh range(1, 5) di Python?',
    pilihanJawaban: ['1, 2, 3, 4, 5', '0, 1, 2, 3, 4', '1, 2, 3, 4', '2, 3, 4, 5'],
    jawabanBenar: 2,
    penjelasan:
      'Fungsi range(start, stop) dimulai dari start (1) dan berhenti tepat sebelum stop (5), sehingga menghasilkan 1, 2, 3, 4.',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-py-3b',
    materiId: 'py-3',
    pertanyaan: 'Apa risiko jika variabel kondisi di dalam perulangan while tidak pernah berubah?',
    pilihanJawaban: [
      'Program otomatis berhenti setelah 10 kali',
      'Terjadi perulangan tanpa henti (infinite loop)',
      'Variabel otomatis terhapus dari memori',
      'Perulangan berubah menjadi if-else',
    ],
    jawabanBenar: 1,
    penjelasan:
      'Selama kondisi while selalu True dan tidak pernah diperbarui menuju False, perulangan akan berjalan terus-menerus tanpa berhenti.',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-py-4a',
    materiId: 'py-4',
    pertanyaan: 'Diberikan bahasa = ["Python", "JS", "SQL"]. Apa nilai dari bahasa[1]?',
    pilihanJawaban: ['"Python"', '"JS"', '"SQL"', 'Error indeks'],
    jawabanBenar: 1,
    penjelasan:
      'Indeks list di Python dimulai dari 0 ("Python" = indeks 0, "JS" = indeks 1, "SQL" = indeks 2).',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-py-4b',
    materiId: 'py-4',
    pertanyaan: 'Apa fungsi kata kunci return di dalam sebuah fungsi def Python?',
    pilihanJawaban: [
      'Mengulang fungsi dari baris paling atas',
      'Menghapus seluruh variabel lokal di layar',
      'Mengirimkan nilai hasil fungsi kembali ke bagian kode yang memanggilnya',
      'Mengubah list menjadi string',
    ],
    jawabanBenar: 2,
    penjelasan:
      'return mengembalikan hasil komputasi dari fungsi agar dapat disimpan ke variabel lain atau diolah lebih lanjut.',
    poin: 25,
    xp: 20,
  },

  // ==================== JAVASCRIPT ====================
  {
    id: 'q-js-1a',
    materiId: 'js-1',
    pertanyaan: 'Kapan sebaiknya menggunakan const dibandingkan let di JavaScript?',
    pilihanJawaban: [
      'Saat nilainya akan sering diubah ulang di dalam loop',
      'Saat variabel tidak perlu diberi nilai ulang (tetap)',
      'Hanya untuk menyimpan angka negatif',
      'Saat ingin menulis komentar satu baris',
    ],
    jawabanBenar: 1,
    penjelasan:
      'const mencegah penugasan ulang (reassignment) yang tidak disengaja, sehingga cocok untuk nilai tetap seperti konfigurasi atau nama aplikasi.',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-js-1b',
    materiId: 'js-1',
    pertanyaan: 'Manakah penulisan template literal yang benar untuk menyisipkan variabel nama?',
    pilihanJawaban: [
      '"Halo ${nama}"',
      "'Halo {nama}'",
      '`Halo ${nama}`',
      '`Halo $(nama)`',
    ],
    jawabanBenar: 2,
    penjelasan:
      'Template literals wajib menggunakan tanda backtick (`) dan ekspresi ${...} untuk menyisipkan variabel.',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-js-2a',
    materiId: 'js-2',
    pertanyaan: 'Apa hasil evaluasi ekspresi JavaScript: "10" === 10 ?',
    pilihanJawaban: ['true', 'false', '10', 'undefined'],
    jawabanBenar: 1,
    penjelasan:
      'Operator === memeriksa kesamaan nilai sekaligus tipe data. Karena "10" bertipe string dan 10 bertipe number, hasilnya false.',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-js-2b',
    materiId: 'js-2',
    pertanyaan: 'Apa hasil dari (true || false) && false di JavaScript?',
    pilihanJawaban: ['true', 'false', 'null', 'NaN'],
    jawabanBenar: 1,
    penjelasan:
      'Di dalam kurung, (true || false) bernilai true. Namun true && false menghasilkan false karena operator && menuntut kedua sisi bernilai true.',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-js-3a',
    materiId: 'js-3',
    pertanyaan: 'Diberikan const user = { alias: "Nova", level: 3 }; Bagaimana cara mengakses nilai level?',
    pilihanJawaban: ['user->level', 'user.level', 'user(level)', 'level.user'],
    jawabanBenar: 1,
    penjelasan:
      'Properti object di JavaScript diakses menggunakan notasi titik (user.level) atau kurung siku (user["level"]).',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-js-3b',
    materiId: 'js-3',
    pertanyaan: 'Apa yang dikembalikan oleh metode array .filter()?',
    pilihanJawaban: [
      'Satu angka jumlah semua elemen',
      'Array baru yang hanya berisi elemen yang lolos kondisi true',
      'Menghapus seluruh elemen array menjadi kosong',
      'Mengubah array menjadi objek tunggal',
    ],
    jawabanBenar: 1,
    penjelasan:
      '.filter() menyaring elemen berdasarkan fungsi kondisi dan mengembalikan array baru tanpa memodifikasi array aslinya.',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-js-4a',
    materiId: 'js-4',
    pertanyaan: 'Metode DOM mana yang dipakai untuk memasang reaksi saat tombol diklik?',
    pilihanJawaban: [
      'button.listenClick()',
      'button.addEventListener("click", fn)',
      'document.clickButton(fn)',
      'window.onPress("click")',
    ],
    jawabanBenar: 1,
    penjelasan:
      'addEventListener("click", fn) adalah API standar DOM untuk mendaftarkan fungsi callback ketika peristiwa klik terjadi.',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-js-4b',
    materiId: 'js-4',
    pertanyaan: 'Mengapa textContent lebih aman daripada innerHTML saat menampilkan teks input pengguna?',
    pilihanJawaban: [
      'textContent hanya bekerja di layar gelap',
      'textContent memperlakukan teks murni sebagai karakter, mencegah eksekusi tag HTML/skrip berbahaya',
      'innerHTML tidak bisa menampilkan huruf kapital',
      'textContent otomatis menerjemahkan bahasa',
    ],
    jawabanBenar: 1,
    penjelasan:
      'Menggunakan textContent menghindari parsing HTML mentah sehingga mencegah celah keamanan Cross-Site Scripting (XSS).',
    poin: 25,
    xp: 20,
  },

  // ==================== SQL ====================
  {
    id: 'q-sql-1a',
    materiId: 'sql-1',
    pertanyaan: 'Perintah SQL manakah yang menampilkan kolom nama dan poin dari tabel peserta?',
    pilihanJawaban: [
      'GET nama, poin FROM peserta;',
      'SELECT nama, poin FROM peserta;',
      'SHOW peserta (nama, poin);',
      'READ nama, poin IN peserta;',
    ],
    jawabanBenar: 1,
    penjelasan:
      'Sintaks dasar SQL untuk membaca kolom tertentu dari tabel adalah SELECT kolom1, kolom2 FROM nama_tabel;',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-sql-1b',
    materiId: 'sql-1',
    pertanyaan: 'Apa fungsi klausa LIMIT 5 pada akhir query SELECT?',
    pilihanJawaban: [
      'Menghapus 5 baris pertama dari tabel secara permanen',
      'Membatasi hasil tampilan maksimal 5 baris saja',
      'Hanya menampilkan kolom yang panjang namanya 5 huruf',
      'Mengurutkan tabel sebanyak 5 kali',
    ],
    jawabanBenar: 1,
    penjelasan:
      'LIMIT 5 membatasi jumlah baris yang dikembalikan oleh query menjadi maksimal 5 baris tanpa mengubah data asli tabel.',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-sql-2a',
    materiId: 'sql-2',
    pertanyaan: 'Klausa manakah yang benar untuk mencari log di Ruang Server setelah jam 20:00?',
    pilihanJawaban: [
      "WHERE lokasi = 'Ruang Server' OR jam > '20:00'",
      "WHERE lokasi = 'Ruang Server' AND jam > '20:00'",
      "SELECT lokasi = 'Ruang Server' AFTER '20:00'",
      "FILTER lokasi = 'Ruang Server' WITH jam > '20:00'",
    ],
    jawabanBenar: 1,
    penjelasan:
      'Operator AND memastikan kedua syarat terpenuhi bersamaan (harus di Ruang Server sekaligus setelah jam 20:00).',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-sql-2b',
    materiId: 'sql-2',
    pertanyaan: 'Apa perbedaan utama antara operator AND dan OR pada klausa WHERE?',
    pilihanJawaban: [
      'AND hanya untuk angka, OR hanya untuk teks',
      'AND mewajibkan semua kondisi benar, sedangkan OR cukup salah satu kondisi benar',
      'OR selalu menghasilkan lebih sedikit baris daripada AND',
      'Tidak ada perbedaan, keduanya sinonim',
    ],
    jawabanBenar: 1,
    penjelasan:
      'AND memperketat penyaringan (irisan), sedangkan OR menyertakan baris yang memenuhi salah satu kondisi (gabungan).',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-sql-3a',
    materiId: 'sql-3',
    pertanyaan: 'Bagaimana cara mengurutkan hasil query berdasarkan skor dari tertinggi ke terendah?',
    pilihanJawaban: [
      'ORDER BY skor ASC',
      'SORT BY skor HIGH',
      'ORDER BY skor DESC',
      'GROUP BY skor MAX',
    ],
    jawabanBenar: 2,
    penjelasan:
      'DESC (Descending) mengurutkan nilai dari terbesar ke terkecil, sangat ideal untuk papan peringkat skor.',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-sql-3b',
    materiId: 'sql-3',
    pertanyaan: 'Di manakah posisi penulisan ORDER BY yang tepat dalam sebuah query SQL?',
    pilihanJawaban: [
      'Sebelum SELECT',
      'Antara SELECT dan FROM',
      'Setelah WHERE dan sebelum LIMIT',
      'Di dalam nama tabel',
    ],
    jawabanBenar: 2,
    penjelasan:
      'Urutan klausa SQL yang benar adalah SELECT -> FROM -> WHERE -> GROUP BY -> ORDER BY -> LIMIT.',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-sql-4a',
    materiId: 'sql-4',
    pertanyaan: 'Fungsi agregasi mana yang digunakan untuk menghitung jumlah baris per kelompok?',
    pilihanJawaban: ['COUNT(*)', 'LENGTH(*)', 'LIST(*)', 'SPLIT(*)'],
    jawabanBenar: 0,
    penjelasan:
      'COUNT(*) menghitung banyaknya baris yang ada pada setiap kelompok hasil GROUP BY.',
    poin: 25,
    xp: 20,
  },
  {
    id: 'q-sql-4b',
    materiId: 'sql-4',
    pertanyaan: 'Untuk menghitung jumlah catatan log pada masing-masing lokasi, klausa apa yang wajib ditambahkan?',
    potonganKode: `SELECT lokasi, COUNT(*) AS total
FROM log_akses
________ lokasi;`,
    pilihanJawaban: ['ORDER BY', 'GROUP BY', 'WHERE BY', 'LIMIT BY'],
    jawabanBenar: 1,
    penjelasan:
      'GROUP BY lokasi mengelompokkan baris berdasarkan nilai kolom lokasi sebelum COUNT(*) menghitung jumlah baris tiap kelompok.',
    poin: 25,
    xp: 20,
  },
];

export const DAILY_CHALLENGE_BANK: DailyChallengeItem[] = [
  {
    id: 'dc-1',
    kategori: 'Python',
    tingkat: 'Pemula',
    judul: 'Tebak Output Perulangan',
    pertanyaan: 'Berapa nilai akhir variabel total setelah loop Python berikut selesai dijalankan?',
    potonganKode: `total = 0
for i in range(1, 5):
    total = total + i
print(total)`,
    pilihanJawaban: ['10', '15', '4', '5'],
    jawabanBenar: 0,
    penjelasan:
      'range(1, 5) menghasilkan 1, 2, 3, 4. Penjumlahannya adalah 1 + 2 + 3 + 4 = 10.',
    poin: 40,
    xp: 30,
  },
  {
    id: 'dc-2',
    kategori: 'JavaScript',
    tingkat: 'Pemula',
    judul: 'Jebakan Perbandingan Ketat',
    pertanyaan: 'Apa hasil output dari kode JavaScript di bawah ini?',
    potonganKode: `const angka = "7";
if (angka === 7) {
  console.log("Cocok");
} else {
  console.log("Beda tipe");
}`,
    pilihanJawaban: ['Cocok', 'Beda tipe', '7', 'Error'],
    jawabanBenar: 1,
    penjelasan:
      'Karena "7" adalah string sedangkan 7 adalah number, operator ketat === menghasilkan false sehingga blok else dijalankan.',
    poin: 40,
    xp: 30,
  },
  {
    id: 'dc-3',
    kategori: 'SQL',
    tingkat: 'Menengah',
    judul: 'Urutan Peringkat Terbaik',
    pertanyaan: 'Query manakah yang menampilkan 1 peserta dengan skor tertinggi dari tabel nilai_kuis?',
    pilihanJawaban: [
      'SELECT * FROM nilai_kuis ORDER BY skor ASC LIMIT 1;',
      'SELECT * FROM nilai_kuis ORDER BY skor DESC LIMIT 1;',
      'SELECT TOP skor FROM nilai_kuis WHERE LIMIT 1;',
      'SELECT * FROM nilai_kuis GROUP BY skor LIMIT 1;',
    ],
    jawabanBenar: 1,
    penjelasan:
      'ORDER BY skor DESC menempatkan skor paling tinggi di baris pertama, lalu LIMIT 1 mengambil tepat 1 baris teratas.',
    poin: 40,
    xp: 30,
  },
  {
    id: 'dc-4',
    kategori: 'Python',
    tingkat: 'Menengah',
    judul: 'Indeks Terakhir List',
    pertanyaan: 'Apa output dari perintah Python berikut?',
    potonganKode: `buah = ["apel", "mangga", "jeruk"]
buah.append("melon")
print(buah[3])`,
    pilihanJawaban: ['"jeruk"', '"melon"', '"apel"', 'IndexError'],
    jawabanBenar: 1,
    penjelasan:
      'Setelah .append("melon"), list memiliki 4 elemen dengan indeks 0, 1, 2, 3. Jadi buah[3] adalah "melon".',
    poin: 40,
    xp: 30,
  },
  {
    id: 'dc-5',
    kategori: 'JavaScript',
    tingkat: 'Menengah',
    judul: 'Filter Angka Genap',
    pertanyaan: 'Berapa panjang array hasil dari operasi .filter() berikut?',
    potonganKode: `const angka = [3, 6, 9, 12, 14];
const genap = angka.filter((n) => n % 2 === 0);
console.log(genap.length);`,
    pilihanJawaban: ['2', '3', '4', '5'],
    jawabanBenar: 1,
    penjelasan:
      'Bilangan yang habis dibagi 2 (n % 2 === 0) pada array tersebut adalah 6, 12, dan 14 — berjumlah 3 elemen.',
    poin: 40,
    xp: 30,
  },
  {
    id: 'dc-6',
    kategori: 'SQL',
    tingkat: 'Pemula',
    judul: 'Filter Ganda WHERE',
    pertanyaan: 'Jika tabel berisi 10 baris: 4 baris di Lab Komputer (2 pagi, 2 malam) dan 6 di Perpustakaan, berapa baris yang dikembalikan query ini?',
    potonganKode: `SELECT * FROM log_akses
WHERE lokasi = 'Lab Komputer' AND waktu = 'Malam';`,
    pilihanJawaban: ['2 baris', '4 baris', '6 baris', '10 baris'],
    jawabanBenar: 0,
    penjelasan:
      'Operator AND hanya mengambil baris yang memenuhi kedua syarat sekaligus (Lab Komputer dan Malam), yaitu 2 baris.',
    poin: 40,
    xp: 30,
  },
  {
    id: 'dc-7',
    kategori: 'Python',
    tingkat: 'Tantangan',
    judul: 'Fungsi Perkalian Ganda',
    pertanyaan: 'Apa hasil yang dicetak oleh kode fungsi Python ini?',
    potonganKode: `def kali_dua(x):
    return x * 2

hasil = kali_dua(3) + kali_dua(4)
print(hasil)`,
    pilihanJawaban: ['7', '12', '14', '24'],
    jawabanBenar: 2,
    penjelasan:
      'kali_dua(3) mengembalikan 6, kali_dua(4) mengembalikan 8, sehingga 6 + 8 = 14.',
    poin: 40,
    xp: 30,
  },
  {
    id: 'dc-8',
    kategori: 'JavaScript',
    tingkat: 'Tantangan',
    judul: 'Logika Gerbang Akses',
    pertanyaan: 'Manakah nilai yang membuat ekspresi (poin >= 100 || vip) && aktif bernilai true?',
    pilihanJawaban: [
      'poin = 120, vip = false, aktif = false',
      'poin = 50, vip = true, aktif = true',
      'poin = 50, vip = false, aktif = true',
      'poin = 150, vip = true, aktif = false',
    ],
    jawabanBenar: 1,
    penjelasan:
      'Pada poin = 50, vip = true, (false || true) bernilai true; lalu digabungkan && aktif (true) menghasilkan true.',
    poin: 40,
    xp: 30,
  },
  {
    id: 'dc-9',
    kategori: 'SQL',
    tingkat: 'Tantangan',
    judul: 'Ringkasan GROUP BY',
    pertanyaan: 'Apa tujuan menambahkan AS jumlah_peserta pada SELECT jalur, COUNT(*) AS jumlah_peserta?',
    pilihanJawaban: [
      'Menghapus kolom jalur dari hasil',
      'Memberikan nama alias yang jelas pada kolom hasil hitungan COUNT(*)',
      'Menyaring hanya peserta yang aktif',
      'Mengubah angka menjadi huruf',
    ],
    jawabanBenar: 1,
    penjelasan:
      'Kata kunci AS memberi nama alias pada kolom output agar hasil tabel lebih mudah dibaca.',
    poin: 40,
    xp: 30,
  },
  {
    id: 'dc-10',
    kategori: 'Python',
    tingkat: 'Pemula',
    judul: 'Boolean & Operator Logika',
    pertanyaan: 'Apa nilai dari ekspresi Python: (10 > 5) and (3 == 4) ?',
    pilihanJawaban: ['True', 'False', '10', 'Error'],
    jawabanBenar: 1,
    penjelasan:
      '10 > 5 bernilai True, namun 3 == 4 bernilai False. Karena menggunakan operator and, hasil akhirnya False.',
    poin: 40,
    xp: 30,
  },
];

export function getTodayLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDailyChallengeForDate(dateStr: string): DailyChallengeItem {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  const index = hash % DAILY_CHALLENGE_BANK.length;
  return DAILY_CHALLENGE_BANK[index];
}
