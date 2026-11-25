import { Materi } from '../types';

export const MATERI_LIST: Materi[] = [
  // ==================== PYTHON (4 Modul) ====================
  {
    id: 'py-1',
    judul: 'Variabel & Tipe Data',
    kategori: 'Python',
    deskripsi:
      'Belajar menyimpan data teks, angka bulat, desimal, dan logika di dalam variabel Python serta menampilkannya dengan print().',
    ringkasanParagraf: [
      'Variabel dapat dibayangkan seperti kotak berlabel di dalam memori komputer untuk menyimpan nilai. Di Python, kamu tidak perlu menuliskan tipe data secara manual karena Python otomatis mengenalinya dari nilai yang dimasukkan.',
      'Empat tipe data dasar yang paling sering dipakai adalah str (teks di dalam tanda kutip), int (bilangan bulat), float (bilangan desimal bertitik), dan bool (nilai kebenaran True atau False).',
    ],
    poinPenting: [
      'Nama variabel tidak boleh diawali angka atau mengandung spasi (gunakan garis bawah, misalnya nilai_ujian).',
      'Teks (str) wajib diapit tanda kutip tunggal atau ganda, sedangkan angka (int/float) ditulis tanpa kutip.',
      'Gunakan fungsi print() untuk menampilkan isi variabel ke layar dan type() untuk memeriksa tipe datanya.',
    ],
    contohKode: {
      judul: 'Menyimpan dan menampilkan profil belajar',
      bahasa: 'python',
      kode: `nama_alias = "BintangKode"   # str (teks)
level = 2                    # int (bilangan bulat)
nilai_rata = 92.5            # float (desimal)
lulus = True                 # bool (logika)

print("Halo,", nama_alias)
print("Nilai rata-rata:", nilai_rata)
print("Tipe data nilai:", type(nilai_rata))`,
      output: `Halo, BintangKode
Nilai rata-rata: 92.5
Tipe data nilai: <class 'float'>`,
    },
    imageUrl: 'svg-inline:py-1',
    tingkatKesulitan: 'Pemula',
    estimasiMenit: 4,
  },
  {
    id: 'py-2',
    judul: 'Percabangan if-elif-else',
    kategori: 'Python',
    deskripsi:
      'Membuat program mampu mengambil keputusan berbeda berdasarkan kondisi menggunakan if, elif, else, dan aturan indentasi Python.',
    ringkasanParagraf: [
      'Percabangan memungkinkan program memilih jalur eksekusi berdasarkan syarat tertentu. Jika syarat pada if bernilai True, blok kode di bawahnya dijalankan; jika False, Python mengecek elif atau langsung menjalankan blok else.',
      'Di Python, indentasi (spasi di awal baris, umumnya 4 spasi) bukan sekadar hiasan—indentasi menentukan baris mana saja yang termasuk ke dalam blok if, elif, atau else.',
    ],
    poinPenting: [
      'Operator perbandingan utama: == (sama dengan), != (tidak sama), >, >=, <, dan <=.',
      'Jangan tertukar antara = (mengisi variabel) dan == (membandingkan dua nilai).',
      'Selalu akhiri baris if, elif, dan else dengan tanda titik dua (:) lalu beri indentasi pada baris di bawahnya.',
    ],
    contohKode: {
      judul: 'Menentukan predikat nilai informatika',
      bahasa: 'python',
      kode: `nilai = 84

if nilai >= 90:
    predikat = "Sangat Baik"
elif nilai >= 75:
    predikat = "Baik"
else:
    predikat = "Perlu Latihan"

print("Predikat:", predikat)`,
      output: `Predikat: Baik`,
    },
    imageUrl: 'svg-inline:py-2',
    tingkatKesulitan: 'Pemula',
    estimasiMenit: 5,
  },
  {
    id: 'py-3',
    judul: 'Perulangan for & while',
    kategori: 'Python',
    deskripsi:
      'Mengotomatisasi langkah yang berulang dengan for + range() dan perulangan berbasis kondisi menggunakan while.',
    ringkasanParagraf: [
      'Daripada mengetik perintah yang sama berkali-kali, programmer menggunakan perulangan (loop). Perulangan for sangat cocok ketika kita sudah tahu berapa kali langkah harus diulang, misalnya dengan fungsi range().',
      'Sementara itu, perulangan while terus berjalan selama kondisinya masih bernilai True. Pastikan ada perubahan variabel di dalam while agar kondisi suatu saat menjadi False dan tidak menyebabkan infinite loop.',
    ],
    poinPenting: [
      'range(1, 5) menghasilkan urutan 1, 2, 3, 4 (batas akhir 5 tidak ikut disertakan).',
      'Gunakan for untuk jumlah iterasi pasti atau menelusuri elemen urutan; gunakan while saat berhenti bergantung pada kondisi dinamis.',
      'Pada while, pastikan variabel penghitung selalu diperbarui agar loop dapat berhenti.',
    ],
    contohKode: {
      judul: 'Menghitung mundur peluncuran roket mini',
      bahasa: 'python',
      kode: `for langkah in range(1, 4):
    print("Robot maju langkah ke-", langkah)

energi = 3
while energi > 0:
    print("Sisa energi:", energi)
    energi = energi - 1`,
      output: `Robot maju langkah ke- 1
Robot maju langkah ke- 2
Robot maju langkah ke- 3
Sisa energi: 3
Sisa energi: 2
Sisa energi: 1`,
    },
    imageUrl: 'svg-inline:py-3',
    tingkatKesulitan: 'Menengah',
    estimasiMenit: 6,
  },
  {
    id: 'py-4',
    judul: 'List & Fungsi Dasar (def)',
    kategori: 'Python',
    deskripsi:
      'Menyimpan banyak data berurutan di dalam list berindeks nol serta membungkus logika berulang menjadi fungsi dengan def dan return.',
    ringkasanParagraf: [
      'List adalah struktur data di Python yang mampu menyimpan sekumpulan nilai dalam satu variabel menggunakan tanda kurung siku []. Setiap elemen memiliki indeks yang selalu dimulai dari 0, bukan 1.',
      'Fungsi yang dibuat dengan kata kunci def membantu kita memecah program menjadi bagian-bagian kecil yang rapi dan dapat dipanggil kembali. Kata kunci return mengembalikan hasil perhitungan fungsi ke pemanggilnya.',
    ],
    poinPenting: [
      'Indeks elemen pertama pada list adalah 0 (daftar[0]), dan .append(nilai) menambahkan elemen baru di bagian akhir.',
      'Fungsi dapat menerima parameter sebagai masukan dan mengembalikan nilai dengan return.',
      'Memisahkan logika ke dalam fungsi membuat kode lebih mudah dibaca, diuji, dan digunakan ulang.',
    ],
    contohKode: {
      judul: 'Menambah skor kuis dan menghitung total',
      bahasa: 'python',
      kode: `skor_kuis = [80, 90]
skor_kuis.append(100)

def hitung_rata(daftar):
    return sum(daftar) / len(daftar)

print("Skor pertama:", skor_kuis[0])
print("Rata-rata:", hitung_rata(skor_kuis))`,
      output: `Skor pertama: 80
Rata-rata: 90.0`,
    },
    imageUrl: 'svg-inline:py-4',
    tingkatKesulitan: 'Tantangan',
    estimasiMenit: 7,
  },

  // ==================== JAVASCRIPT (4 Modul) ====================
  {
    id: 'js-1',
    judul: 'Variabel let/const & Console',
    kategori: 'JavaScript',
    deskripsi:
      'Memahami perbedaan const dan let di JavaScript modern, merangkai teks dengan template literals, serta debugging memakai console.log().',
    ringkasanParagraf: [
      'JavaScript adalah bahasa pemrograman utama yang membuat halaman web menjadi hidup dan interaktif. Untuk mendeklarasikan variabel modern, gunakan const jika nilainya tidak akan diubah ulang, dan let jika nilainya dapat berubah.',
      'Template literals menggunakan tanda backtick (`) dan sintaks ${variabel} untuk menyisipkan nilai variabel langsung ke dalam teks dengan jauh lebih rapi dibanding penggabungan tanda plus (+).',
    ],
    poinPenting: [
      'Prioritaskan const secara default; gunakan let hanya untuk nilai yang memang akan diperbarui (seperti skor atau nyawa pemain).',
      'Template literals (`Halo ${nama}`) memudahkan penulisan kalimat dinamis.',
      'console.log() menampilkan pesan ke Developer Console browser untuk memeriksa alur program.',
    ],
    contohKode: {
      judul: 'Memperbarui skor pemain di console',
      bahasa: 'javascript',
      kode: `const namaAplikasi = "YukNgoding";
let skor = 50;
skor = skor + 25;

console.log(\`Selamat datang di \${namaAplikasi}!\`);
console.log(\`Skor terbaru: \${skor} poin\`);`,
      output: `Selamat datang di YukNgoding!
Skor terbaru: 75 poin`,
    },
    imageUrl: 'svg-inline:js-1',
    tingkatKesulitan: 'Pemula',
    estimasiMenit: 4,
  },
  {
    id: 'js-2',
    judul: 'Operator & Logika Kondisi',
    kategori: 'JavaScript',
    deskripsi:
      'Menggunakan perbandingan ketat (===) dan operator logika (&&, ||, !) agar keputusan program JavaScript akurat tanpa bug tipe data.',
    ringkasanParagraf: [
      'Di JavaScript, perbandingan ketat (===) memeriksa nilai sekaligus tipe datanya, sehingga "5" === 5 menghasilkan false. Ini jauh lebih aman daripada == yang melakukan konversi tipe otomatis.',
      'Untuk menggabungkan beberapa syarat sekaligus, gunakan operator && (DAN — semua syarat harus benar), || (ATAU — cukup salah satu benar), dan ! (BUKAN — membalik nilai boolean).',
    ],
    poinPenting: [
      'Selalu gunakan === dan !== agar perbandingan angka dan teks tidak tertukar.',
      'Operator && bernilai true hanya jika sisi kiri dan sisi kanan keduanya true.',
      'Operator || bernilai true jika minimal satu sisi bernilai true.',
    ],
    contohKode: {
      judul: 'Validasi syarat membuka gerbang kastil',
      bahasa: 'javascript',
      kode: `const skor = 85;
const punyaKunci = false;
const energi = 60;

const gerbangTerbuka = (skor >= 80 || punyaKunci === true) && energi >= 50;
console.log("Gerbang terbuka:", gerbangTerbuka);`,
      output: `Gerbang terbuka: true`,
    },
    imageUrl: 'svg-inline:js-2',
    tingkatKesulitan: 'Pemula',
    estimasiMenit: 5,
  },
  {
    id: 'js-3',
    judul: 'Array & Object',
    kategori: 'JavaScript',
    deskripsi:
      'Mengelola data terstruktur berbentuk pasangan key-value (Object) dan mengolah koleksi daftar menggunakan .push() serta .filter().',
    ringkasanParagraf: [
      'Object di JavaScript menyimpan data terstruktur dalam pasangan kunci dan nilai (key: value) di dalam kurung kurawal {}. Contohnya, satu objek pengguna dapat menyimpan alias, level, dan totalPoin sekaligus.',
      'Array menyimpan daftar banyak item (termasuk daftar objek). Metode seperti .push() menambah item baru, sedangkan .filter() membuat array baru yang hanya berisi elemen sesuai syarat tertentu.',
    ],
    poinPenting: [
      'Akses properti objek memakai titik, misalnya profil.level atau profil.alias.',
      'Metode .filter() tidak merusak array asli, melainkan mengembalikan array baru hasil penyaringan.',
      'Kombinasi array of objects adalah struktur paling umum untuk data aplikasi web modern.',
    ],
    contohKode: {
      judul: 'Menyaring modul yang sudah selesai',
      bahasa: 'javascript',
      kode: `const modul = [
  { id: "js-1", selesai: true },
  { id: "js-2", selesai: false },
  { id: "js-3", selesai: true }
];

const lulus = modul.filter((item) => item.selesai === true);
console.log("Jumlah selesai:", lulus.length);`,
      output: `Jumlah selesai: 2`,
    },
    imageUrl: 'svg-inline:js-3',
    tingkatKesulitan: 'Menengah',
    estimasiMenit: 6,
  },
  {
    id: 'js-4',
    judul: 'Manipulasi DOM & Event',
    kategori: 'JavaScript',
    deskripsi:
      'Memilih elemen halaman web dengan document.querySelector(), memperbarui teks secara aman, dan merespons klik via addEventListener().',
    ringkasanParagraf: [
      'DOM (Document Object Model) adalah representasi struktur HTML di dalam memori browser. Dengan JavaScript, kita dapat memilih elemen menggunakan document.querySelector() lalu memperbarui teks atau tampilannya secara langsung tanpa memuat ulang halaman.',
      'Agar elemen bereaksi terhadap aksi pengguna seperti klik tombol atau ketikan keyboard, kita memasang pendengar kejadian (event listener) menggunakan addEventListener().',
    ],
    poinPenting: [
      'Gunakan textContent (bukan innerHTML) saat memasukkan teks dari pengguna agar aman dari injeksi skrip.',
      'addEventListener("click", fungsi) menjalankan fungsi setiap kali tombol diklik.',
      'Selector CSS seperti "#tombolMulai" (ID) atau ".kartu" (class) dipakai di dalam querySelector().',
    ],
    contohKode: {
      judul: 'Menghitung klik tombol secara real-time',
      bahasa: 'javascript',
      kode: `const tombol = document.querySelector("#btn-klik");
const label = document.querySelector("#jumlah-klik");
let total = 0;

tombol.addEventListener("click", () => {
  total += 1;
  label.textContent = \`Total klik: \${total}\`;
});`,
      output: `Total klik: 1 (berubah setiap tombol diklik)`,
    },
    imageUrl: 'svg-inline:js-4',
    tingkatKesulitan: 'Tantangan',
    estimasiMenit: 7,
  },

  // ==================== SQL (4 Modul) ====================
  {
    id: 'sql-1',
    judul: 'Membaca Data (SELECT & FROM)',
    kategori: 'SQL',
    deskripsi:
      'Mengambil kolom tertentu atau seluruh kolom (*) dari tabel basis data relasional serta membatasi jumlah baris dengan LIMIT.',
    ringkasanParagraf: [
      'SQL (Structured Query Language) adalah bahasa standar untuk membaca dan mengelola data di dalam tabel basis data. Setiap tabel tersusun atas baris (record) dan kolom (field).',
      'Perintah SELECT menentukan kolom apa yang ingin ditampilkan, FROM menentukan nama tabel sumbernya, dan LIMIT membatasi berapa banyak baris teratas yang diambil agar hasil tetap ringkas.',
    ],
    poinPenting: [
      'Gunakan SELECT nama_kolom1, nama_kolom2 untuk memilih kolom spesifik agar query lebih efisien.',
      'Tanda bintang (*) pada SELECT * berarti mengambil seluruh kolom yang ada pada tabel.',
      'Tambahkan LIMIT 5 di akhir query jika kamu hanya ingin melihat 5 baris pertama.',
    ],
    contohKode: {
      judul: 'Mengambil daftar 3 peserta pertama dari tabel komunitas',
      bahasa: 'sql',
      kode: `SELECT nama_alias, jalur, poin
FROM peserta_belajar
LIMIT 3;`,
      output: `nama_alias     | jalur  | poin
---------------+--------+-----
Bot_Alfa       | Python | 220
Tim_Orion      | JS     | 195
Akun_Vega      | SQL    | 310`,
    },
    imageUrl: 'svg-inline:sql-1',
    tingkatKesulitan: 'Pemula',
    estimasiMenit: 4,
  },
  {
    id: 'sql-2',
    judul: 'Menyaring Data (WHERE)',
    kategori: 'SQL',
    deskripsi:
      'Menemukan baris data yang memenuhi syarat spesifik menggunakan klausa WHERE beserta operator =, >=, AND, dan OR.',
    ringkasanParagraf: [
      'Pada tabel berisi ribuan catatan, kita jarang membutuhkan seluruh baris. Klausa WHERE menyaring tabel sehingga hanya baris yang memenuhi kondisi tertentu yang ditampilkan.',
      'Kamu dapat menggabungkan dua syarat atau lebih dengan AND (kedua syarat harus terpenuhi) maupun OR (cukup salah satu syarat terpenuhi).',
    ],
    poinPenting: [
      'Nilai teks di dalam WHERE ditulis dengan tanda kutip tunggal, misalnya lokasi = \'Ruang Server\'.',
      'Operator AND mempersempit hasil (lebih ketat), sedangkan OR memperluas hasil.',
      'Urutan penulisan standar: SELECT ... FROM ... WHERE ...',
    ],
    contohKode: {
      judul: 'Mencari akses malam di Ruang Server',
      bahasa: 'sql',
      kode: `SELECT nama_pengguna, lokasi, jam
FROM log_akses
WHERE lokasi = 'Ruang Server' AND jam > '20:00';`,
      output: `nama_pengguna | lokasi       | jam
--------------+--------------+------
Akun_Vega     | Ruang Server | 21:15`,
    },
    imageUrl: 'svg-inline:sql-2',
    tingkatKesulitan: 'Pemula',
    estimasiMenit: 5,
  },
  {
    id: 'sql-3',
    judul: 'Mengurutkan Data (ORDER BY)',
    kategori: 'SQL',
    deskripsi:
      'Menyusun baris hasil query dari terkecil ke terbesar (ASC) atau terbesar ke terkecil (DESC) untuk papan peringkat dan laporan.',
    ringkasanParagraf: [
      'Klausa ORDER BY mengurutkan baris hasil query berdasarkan satu atau lebih kolom. Secara bawaan, SQL mengurutkan secara menaik (ASC / Ascending: A–Z atau angka kecil ke besar).',
      'Untuk membuat papan peringkat dari skor tertinggi ke terendah atau melihat catatan waktu terbaru di paling atas, tambahkan kata kunci DESC (Descending).',
    ],
    poinPenting: [
      'ASC mengurutkan naik (kecil ke besar / A ke Z), sedangkan DESC mengurutkan turun (besar ke kecil / Z ke A).',
      'ORDER BY selalu diletakkan setelah klausa WHERE (jika ada) dan sebelum LIMIT.',
      'Kombinasi ORDER BY skor DESC LIMIT 3 sangat sering dipakai untuk menampilkan Top 3.',
    ],
    contohKode: {
      judul: 'Menampilkan 3 peraih poin tertinggi',
      bahasa: 'sql',
      kode: `SELECT nama_alias, total_poin
FROM papan_skor
ORDER BY total_poin DESC
LIMIT 3;`,
      output: `nama_alias      | total_poin
----------------+-----------
Kode_Bintang    | 420
Logika_Nusantara| 340
Rakit_Skrip     | 265`,
    },
    imageUrl: 'svg-inline:sql-3',
    tingkatKesulitan: 'Menengah',
    estimasiMenit: 5,
  },
  {
    id: 'sql-4',
    judul: 'Agregasi COUNT & GROUP BY',
    kategori: 'SQL',
    deskripsi:
      'Menghitung jumlah baris data per kelompok kategori menggunakan fungsi agregasi COUNT() dan klausa GROUP BY.',
    ringkasanParagraf: [
      'Fungsi agregasi meringkas banyak baris menjadi satu angka statistik, misalnya COUNT(*) untuk menghitung jumlah baris. Jika ingin mengetahui jumlah catatan di setiap kategori secara terpisah, pasangkan dengan GROUP BY.',
      'Contohnya, dengan GROUP BY lokasi pada tabel log sistem, kita bisa langsung mengetahui berapa total aktivitas yang terjadi di Ruang Server, Lab Komputer, maupun Perpustakaan.',
    ],
    poinPenting: [
      'COUNT(*) menghitung seluruh baris di setiap kelompok, dan kata kunci AS memberi nama alias kolom hasil.',
      'Setiap kolom non-agregasi yang ditulis di SELECT wajib dicantumkan juga di dalam GROUP BY.',
      'Fungsi agregasi lain yang populer: SUM() untuk total, AVG() untuk rata-rata, MIN(), dan MAX().',
    ],
    contohKode: {
      judul: 'Menghitung jumlah aktivitas per ruangan',
      bahasa: 'sql',
      kode: `SELECT lokasi, COUNT(*) AS jumlah_aktivitas
FROM log_akses
GROUP BY lokasi
ORDER BY jumlah_aktivitas DESC;`,
      output: `lokasi       | jumlah_aktivitas
-------------+-----------------
Lab Komputer | 4
Ruang Server | 3
Perpustakaan | 2`,
    },
    imageUrl: 'svg-inline:sql-4',
    tingkatKesulitan: 'Tantangan',
    estimasiMenit: 7,
  },
];
