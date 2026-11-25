# SPEC.md — Spesifikasi Perancangan Aplikasi "YukNgoding"

**Versi Dokumen:** 1.0 (MVP)

**Peran Penyusun:** System Analyst & Software Engineer

**Jenis Aplikasi:** Aplikasi Web Edukasi Pemrograman Berbasis Gamifikasi (Client-Side Only)

**Tech Stack Target:** Vite + Vanilla JavaScript (ES Modules), HTML5 Canvas, SVG, CSS/Tailwind, `localStorage`

## 1. Tujuan (Objectives)

**YukNgoding** adalah aplikasi edukasi berbasis web dengan pendekatan gamifikasi yang dirancang untuk membantu pelajar **SMP dan SMA** memahami konsep dasar bahasa pemrograman (**Python, JavaScript, dan SQL**) secara interaktif, visual, dan menyenangkan.

Tujuan utama pengembangan versi MVP:

1. Menurunkan hambatan awal (*learning curve*) belajar pemrograman melalui materi mikro (*micro-learning*) yang dilengkapi ilustrasi lokal.

2. Meningkatkan motivasi belajar melalui elemen gamifikasi: Poin, *Experience Points* (XP), Level, *Achievement Badges*, *Daily Challenge*, dan *Leaderboard* lokal.

3. Menyediakan simulasi/*mini-game* interaktif berbasis HTML5 Canvas dan SVG agar pelajar tidak hanya membaca teori, tetapi juga mempraktikkan logika algoritma, percabangan, dan *query* data secara langsung di *browser*.

4. Mendukung penggunaan di lingkungan sekolah atau rumah pada **satu perangkat bersama** (tanpa backend, tanpa registrasi akun, dan tanpa pengumpulan data pribadi).

## 2. Pengguna (Target Users & Personas)

Aplikasi dirancang untuk beroperasi secara lokal pada satu perangkat (*single-device, multi-profile*) dengan dua kelompok pengguna utama:

| Peran | Profil Singkat | Kebutuhan Utama | 
| ----- | ----- | ----- | 
| **Pelajar SMP (12–15 tahun)** | Pemula total dalam pemrograman; menyukai tampilan visual, permainan, dan tantangan singkat. | Materi berbahasa sederhana, contoh kode yang mudah dicerna, kuis interaktif dengan umpan balik instan, dan *mini-game* visual. | 
| **Pelajar SMA (15–18 tahun)** | Mulai mendalami informatika/TIK; membutuhkan pemahaman logika yang lebih terstruktur (algoritma, DOM, *database*). | Struktur kurikulum berjenjang (Pemula–Tantangan), latihan soal dengan pembahasan konsep, serta simulasi logika dan SQL. | 
| **Guru Pendamping** | Memfasilitasi pembelajaran di kelas/lab komputer atau mendampingi siswa belajar pada satu perangkat. | Fitur ganti profil demo cepat, dashboard ringkasan pencapaian belajar siswa, serta tombol reset progres untuk sesi kelas berikutnya. | 

## 3. Daftar Fitur MVP

### 3.1 Fitur Inti Gamifikasi & Pembelajaran

 1. **Dashboard Pembelajaran Gamifikasi**

    * Menampilkan sapaan profil aktif, Level & gelar saat ini, *XP Progress Bar*, total Poin, jumlah materi selesai, jumlah *badge*, serta akses cepat ke *Daily Challenge* dan *Simulasi Game*.

 2. **Tiga Kategori Bahasa Pemrograman**

    * **Python** (Logika & Algoritma), **JavaScript** (Interaktivitas Web), dan **SQL** (Manajemen & Analisis Data).

    * Dilengkapi *Progress Bar* terpisah untuk masing-masing kategori.

 3. **Minimal 12 Materi Pembelajaran Singkat (Ilustrasi SVG Lokal)**

    * Disusun berjenjang (4 materi per bahasa, total 12 materi inti; dapat dikembangkan hingga 15 materi) lengkap dengan blok kode contoh dan ilustrasi visual SVG lokal.

 4. **Kuis Interaktif Pilihan Ganda (Minimal 24 Soal)**

    * Minimal 2 soal per materi (total 24 soal) dengan mekanisme umpan balik langsung.

    * **Penjelasan Jawaban Benar & Salah:** Setiap jawaban menampilkan alasan ilmiah/konseptual agar siswa memahami *mengapa* jawaban tersebut benar atau salah.

    * **Proteksi Anti-Farming:** Poin dan XP dari soal yang sama hanya diberikan **satu kali**. Pengulangan kuis tetap diperbolehkan sebagai *Mode Latihan* (+0 Poin/XP tambahan).

 5. **Sistem Poin, XP, Level, dan Achievement Badges**

    * **Poin:** Skor utama yang digunakan untuk peringkat *Leaderboard*.

    * **XP & Level:** Akumulasi XP menaikkan level pemain secara otomatis (Level 1 hingga Level 6).

    * **Achievement Badges:** Minimal 6 lencana pencapaian yang terbuka otomatis saat syarat terpenuhi (misal: *Langkah Pertama*, *Penjelajah Python*, *Arsitek JavaScript*, *Detektif SQL*, *Pejuang Harian*, *Master Simulasi*).

 6. **Daily Challenge Berbasis Tanggal Lokal**

    * Menggunakan tanggal sistem perangkat (`YYYY-MM-DD`) untuk memilih 1 soal tantangan harian secara deterministik dari bank soal khusus.

    * Hanya dapat diklaim 1 kali per hari per profil.

 7. **Leaderboard Lokal (Profil Pemain Demo)**

    * Menggabungkan skor profil pemain aktif dengan 5 profil demo non-pribadi (bot lokal) yang diurutkan berdasarkan `totalPoin` tertinggi.

 8. **3 Skenario Simulasi Game Pemrograman Interaktif** (menggunakan HTML5 Canvas & SVG — dirinci pada Bagian 3.3).

 9. **Dashboard Ringkasan Pencapaian Pembelajaran**

    * Rekapitulasi progres per kategori, daftar materi yang telah lulus beserta skor dan tanggal penyelesaian, koleksi *badge* (terbuka & terkunci), dan status simulasi.

10. **Manajemen Profil Lokal & Reset Progres**

    * Dukungan pergantian 3 slot profil lokal (misal: `Siswa_SMP_1`, `Siswa_SMA_1`, `Guru_Demo`) serta ubah nama alias non-pribadi.

    * Fitur **Reset Progres Pembelajaran** dengan modal konfirmasi ganda untuk menghapus data profil aktif di `localStorage`.

11. **Persistensi Data via `localStorage`**

    * Seluruh progres otomatis tersimpan dan dimuat ulang tanpa koneksi internet.

### 3.2 Kurikulum Materi Pembelajaran (12 Modul Inti)

| ID | Kategori | Judul Materi | Tingkat | Ringkasan Konsep & Contoh Kode | 
| ----- | ----- | ----- | ----- | ----- | 
| `py-1` | Python | Variabel & Tipe Data | Pemula | `str`, `int`, `float`, `bool`, dan fungsi `print()`. | 
| `py-2` | Python | Percabangan `if-elif-else` | Pemula | Operator perbandingan, logika kondisi, dan pentingnya indentasi. | 
| `py-3` | Python | Perulangan `for` & `while` | Menengah | Otomatisasi instruksi menggunakan `range()` dan kondisi henti `while`. | 
| `py-4` | Python | `List` & Fungsi Dasar (`def`) | Tantangan | Menyimpan koleksi data berindeks (`0..n`), `.append()`, dan fungsi dengan `return`. | 
| `js-1` | JavaScript | Variabel `let`/`const` & Console | Pemula | Perbedaan konstanta vs variabel dinamis, *template literals*, `console.log()`. | 
| `js-2` | JavaScript | Operator & Logika Kondisi | Pemula | Perbandingan ketat (`===`), operator logika (`&&`, \` | 
| `js-3` | JavaScript | `Array` & `Object` | Menengah | Struktur properti *key-value* dan pengolahan daftar dengan `.filter()` / `.push()`. | 
| `js-4` | JavaScript | Manipulasi DOM & Event | Tantangan | `document.querySelector()`, mengubah konten elemen, dan `addEventListener("click")`. | 
| `sql-1` | SQL | Membaca Data (`SELECT` & `FROM`) | Pemula | Mengambil kolom spesifik atau seluruh kolom (`*`) serta membatasi baris (`LIMIT`). | 
| `sql-2` | SQL | Menyaring Data (`WHERE`) | Pemula | Memfilter baris data dengan operator `=`, `>=`, `AND`, dan `OR`. | 
| `sql-3` | SQL | Mengurutkan Data (`ORDER BY`) | Menengah | Menyusun hasil secara naik (`ASC`) maupun turun (`DESC`) untuk pemeringkatan. | 
| `sql-4` | SQL | Agregasi `COUNT` & `GROUP BY` | Tantangan | Menghitung ringkasan jumlah baris data berdasarkan kelompok kategori tertentu. | 

*(Opsional untuk pengembangan iterasi lanjutan: Penambahan modul ke-5 "Boss Fight / Mini-Project" pada masing-masing bahasa).*

### 3.3 Skenario Game & Simulasi Interaktif Pemrograman

Sebagai pengganti simulasi sains umum, YukNgoding menghadirkan **3 skenario permainan interaktif** yang memvisualisasikan konsep inti dari ketiga bahasa pemrograman:

#### Skenario 1: Labirin Robot Algoritma (Python — HTML5 Canvas)

* **Konsep yang Dipelajari:** Urutan instruksi (*sequence*), arah koordinat, dan efisiensi perulangan (`for`).

* **Mekanik Permainan:**

  * Ditampilkan papan grid $5 \times 5$ pada **HTML5 Canvas** berisi Robot, Koin Emas, Dinding Rintangan, dan Bendera Finis.

  * Pemain menyusun antrean perintah visual ala Python: `maju()`, `belok_kiri()`, `belok_kanan()`, dan blok `ulang_2x(maju())` (tanpa eksekusi kode bebas yang berbahaya).

  * Saat tombol **Jalankan Kode** ditekan, robot bergerak langkah demi langkah sesuai antrean.

* **Kondisi Menang:** Robot berhasil mengumpulkan seluruh koin dan berhenti tepat di bendera finis tanpa menabrak dinding atau keluar papan.

* **Reward:** +50 Poin & +40 XP (1 kali klaim per skenario) + kontribusi menuju *badge* **Master Simulasi**.

#### Skenario 2: Simulator Gerbang Logika & Kastil Web (JavaScript — SVG Interaktif)

* **Konsep yang Dipelajari:** Evaluasi ekspresi boolean (`&&`, `||`, `>=`, `===`), percabangan `if/else`, dan pembaruan status antarmuka secara *real-time*.

* **Mekanik Permainan:**

  * Ditampilkan diagram alur (*flowchart*) **SVG interaktif** yang menyala secara dinamis (hijau jika `true`, merah/abu jika `false`).

  * Pemain mengatur nilai variabel input melalui *slider* dan *toggle*: `skor` (0–100), `punyaKunci` (`true`/`false`), dan `energi` (0–100).

  * Ekspresi kode JavaScript yang sedang dievaluasi ditampilkan secara langsung:
    `if ((skor >= 80 || punyaKunci === true) && energi >= 50)`

  * Pemain menyelesaikan 3 misi konfigurasi variabel (misal: *"Buka gerbang tanpa kunci dengan energi minimal"* atau *"Aktifkan jalur darurat menggunakan kunci"*).

* **Kondisi Menang:** Diagram SVG menunjukkan jalur `TRUE` sampai ke gerbang akhir dan seluruh misi logika terselesaikan.

* **Reward:** +50 Poin & +40 XP (1 kali klaim).

#### Skenario 3: Detektif Data Sekolah (SQL — Visual Query Builder & Tabel Interaktif)

* **Konsep yang Dipelajari:** Struktur perintah `SELECT`, `FROM`, `WHERE`, dan `ORDER BY` pada tabel relasional.

* **Mekanik Permainan:**

  * **Cerita Kasus:** *"File presentasi lomba robotik di Ruang Server sekolah disalin tanpa izin pada malam hari (setelah pukul 20:00). Gunakan SQL untuk menyaring tabel `log_akses` dan temukan pelakunya!"*

  * Pemain menyusun *query* SQL menggunakan kontrol pilihan terstruktur (pilih kolom `SELECT`, filter `WHERE lokasi`, filter `WHERE jam`, dan urutan `ORDER BY`).

  * Pratinjau sintaks SQL dan tabel hasil filter diperbarui secara instan (100% di sisi klien menggunakan array objek JavaScript non-pribadi).

  * Setelah menemukan bukti, pemain memilih nama pelaku pada panel "Tentukan Tersangka".

* **Kondisi Menang:** Pemain menyusun filter yang valid hingga menampilkan baris bukti yang tepat dan memilih tersangka yang benar.

* **Reward:** +50 Poin & +40 XP (1 kali klaim).

## 4. Data Model

Seluruh data dikelola dalam struktur JSON yang bersih dan disimpan pada `localStorage` dengan kunci utama `yukngoding_app_state_v1`.

### 4.1 Entitas Statis (Konten Aplikasi)

```
// 1. Materi
{
  "id": "py-1",
  "judul": "Variabel & Tipe Data",
  "kategori": "Python",
  "deskripsi": "Belajar menyimpan data teks, angka bulat, dan desimal di Python.",
  "konten": "<p>Penjelasan singkat dan contoh kode...</p>",
  "imageUrl": "svg-inline:py-var",
  "tingkatKesulitan": "Pemula"
}

// 2. Kuis
{
  "id": "q-py-1a",
  "materiId": "py-1",
  "pertanyaan": "Manakah tipe data yang tepat untuk nilai 3.14 di Python?",
  "pilihanJawaban": ["int", "str", "float", "bool"],
  "jawabanBenar": 2,
  "penjelasan": "Angka dengan koma desimal bertipe float di Python.",
  "poin": 25,
  "xp": 20
}

// 3. Achievement
{
  "id": "badge-python",
  "nama": "Penjelajah Python",
  "deskripsi": "Selesaikan seluruh 4 materi kategori Python.",
  "icon": "🐍",
  "syaratPencapaian": "Menyelesaikan py-1, py-2, py-3, dan py-4"
}

```

### 4.2 Entitas Dinamis (Disimpan di `localStorage`)

```
// 4. Pemain & 5. Progres (Tersimpan per slot profil)
{
  "activeProfileId": "slot-1",
  "profiles": {
    "slot-1": {
      "id": "slot-1",
      "namaAlias": "Siswa_SMP_1",
      "xp": 140,
      "level": 2,
      "totalPoin": 175,
      "badge": ["badge-first"],
      "materiSelesai": ["py-1", "py-2"],
      "progres": [
        {
          "pemainId": "slot-1",
          "materiId": "py-1",
          "skor": 100,
          "status": "Selesai",
          "tanggalPenyelesaian": "2026-11-25"
        }
      ],
      "claimedQuestions": ["q-py-1a", "q-py-1b"],
      "simulasiSelesai": ["sim-python"],
      "dailyCompletedDates": ["2026-11-25"]
    }
  }
}

```

### 4.3 Aturan Perhitungan Level

| Level | Minimal XP | Gelar Pemain | 
| ----- | ----- | ----- | 
| Level 1 | 0 XP | Pemula Koding | 
| Level 2 | 100 XP | Penjelajah Sintaks | 
| Level 3 | 250 XP | Pengendali Logika | 
| Level 4 | 450 XP | Arsitek Algoritma | 
| Level 5 | 700 XP | Jawara Kode | 
| Level 6 | 1000 XP | Grandmaster YukNgoding | 

## 5. Arsitektur Teknis & Tema UI/UX

### 5.1 Arsitektur Folder (Target Vite + Vanilla JS)

```
yukngoding/
├── index.html
├── package.json
├── src/
│   ├── main.js               # Entry point & inisialisasi router tab
│   ├── state/
│   │   └── store.js          # State management, localStorage, anti-farming, level/badge engine
│   ├── data/
│   │   ├── materi.js         # 12+ materi & ilustrasi SVG lokal
│   │   ├── kuis.js           # 24+ soal kuis & bank soal Daily Challenge
│   │   ├── badges.js         # Definisi achievement & evaluator syarat
│   │   └── demoProfiles.js   # Data bot leaderboard & log non-pribadi SQL
│   ├── views/
│   │   ├── dashboard.js      # Tampilan utama gamifikasi
│   │   ├── materiView.js     # Daftar, filter, detail materi, dan modul kuis
│   │   ├── dailyView.js      # Daily Challenge berbasis tanggal lokal
│   │   ├── leaderboardView.js# Papan peringkat lokal
│   │   └── summaryView.js    # Ringkasan pencapaian & fitur reset
│   ├── simulations/
│   │   ├── pythonMaze.js     # Simulasi 1 (HTML5 Canvas)
│   │   ├── jsLogicGate.js    # Simulasi 2 (SVG Interaktif)
│   │   └── sqlDetective.js   # Simulasi 3 (Visual Query Builder)
│   └── styles/
│       └── main.css          # Styling responsif & animasi ringan

```

### 5.2 Tema UI/UX (*Modern Educational Gaming*)

* **Palet Warna Utama:**

  * Biru Tua (`#1E3A8A`) & Biru Primer (`#2563EB`) — identitas edukasi & navigasi utama.

  * Ungu (`#7C3AED`) — aksen gamifikasi, XP, dan simulasi interaktif.

  * Hijau Zamrud (`#10B981`) — status selesai, jawaban benar, dan progres positif.

  * Latar Belakang Terang (`#F8FAFC`) dengan kartu putih bersih untuk kenyamanan baca pelajar.

* **Tipografi:** Font *sans-serif* modern (`Inter`) untuk teks umum dan *monospace* (`JetBrains Mono`) untuk potongan kode.

* **Desain Responsif:** Tata letak *grid* adaptif yang nyaman di layar desktop/proyektor kelas maupun *smartphone* (navigasi tab *scrollable* horizontal di layar kecil).

* **Umpan Balik Visual:** Animasi transisi kartu ringan, *toast notification* saat mendapatkan XP/Poin/Level/Badge baru, serta modal konfirmasi kustom.

## 6. Non-Functional Requirements (NFR) & Batasan

### 6.1 Kebutuhan Non-Fungsional

1. **Performa:** Waktu muat awal < 1,5 detik pada jaringan lokal; transisi antar tab dan pembaruan Canvas/SVG berjalan mulus (60 FPS untuk animasi ringan).

2. **Keandalan Offline:** Seluruh fitur inti (materi, ilustrasi SVG, kuis, simulasi, penyimpanan) berjalan 100% lokal tanpa ketergantungan API eksternal.

3. **Aksesibilitas & Usabilitas:** Kontras teks minimal WCAG AA, label tombol jelas, dapat dinavigasi dengan baik pada layar sentuh maupun *mouse/keyboard*.

4. **Ketahanan Data:** Jika data `localStorage` rusak (*corrupt JSON*), aplikasi melakukan *fallback* aman ke *default state* tanpa *crash*.

### 6.2 Batasan Keamanan, Privasi, & Integritas

* **Tanpa API Key:** Tidak ada penyimpanan atau pemanggilan kredensial/API key di dalam kode.

* **Tanpa Eksekusi Kode Berbahaya:** Dilarang menggunakan `eval()`, `new Function()`, atau injeksi HTML mentah dari input pengguna. Seluruh simulasi menggunakan *interpreter* perintah terbatas berbasis *whitelist* (blok perintah/pilihan terstruktur).

* **Privasi Pelajar:** Tidak mengumpulkan nama lengkap asli, email, nomor HP, NISN, atau kata sandi. Hanya menggunakan **nama alias non-pribadi** (validasi regex sederhana, maks. 18 karakter).

* **Data Contoh Non-Pribadi:** Seluruh profil demo *leaderboard* dan baris data pada simulasi SQL menggunakan nama fiktif generik.

* **Validitas Konsep:** Seluruh materi sintaks Python, JavaScript, SQL, serta simulasi logika harus akurat secara ilmu komputer.

* **Anti-Farming Poin:** Soal kuis yang sudah dijawab benar dicatat pada `claimedQuestions`, simulasi pada `simulasiSelesai`, dan tantangan harian pada `dailyCompletedDates` sehingga tidak dapat diklaim berulang kali.

## 7. Risiko & Mitigasi

| No | Risiko | Dampak | Strategi Mitigasi | 
| ----- | ----- | ----- | ----- | 
| 1 | **Eksploitasi Poin Berulang (*Farming*)** — Siswa mengulang kuis yang sama terus-menerus untuk menaikkan level/leaderboard. | Gamifikasi menjadi tidak adil dan tujuan belajar tidak tercapai. | Mencatat setiap `quizId`, `simId`, dan tanggal `dailyChallenge` yang telah diklaim; pengulangan masuk ke *Mode Latihan* (+0 poin). | 
| 2 | **Data `localStorage` Terhapus atau Rusak** — Siswa membersihkan *cache browser* atau terjadi kesalahan parsing JSON. | Progres belajar hilang atau aplikasi gagal dimuat. | Membungkus operasi `localStorage` dalam blok `try-catch` dengan *fallback* ke *default state* yang valid, serta memberi informasi jelas bahwa data tersimpan lokal di perangkat. | 
| 3 | **Kebingungan Penggunaan Satu Perangkat Bersama** — Siswa B menimpa progres Siswa A di lab komputer. | Progres belajar antar siswa tercampur. | Menyediakan pemilih slot profil (*Profile Switcher*) yang mencolok di *header* serta fitur *Reset Progres* yang mudah diakses oleh guru. | 
| 4 | **Tampilan Simulasi Terpotong di Smartphone** — Canvas atau tabel SQL terlalu lebar di layar kecil. | Simulasi sulit dimainkan di perangkat mobile. | Membuat pembungkus responsif (`overflow-x-auto` untuk tabel SQL, penskalaan adaptif untuk Canvas/SVG). | 

## 8. Out-of-Scope (Di Luar Cakupan MVP)

Fitur-fitur berikut secara eksplisit **tidak termasuk** dalam versi MVP ini:

1. Sistem backend, database server (*cloud*), autentikasi akun (login/register dengan email & kata sandi), serta sinkronisasi lintas perangkat.

2. *Online code compiler* bebas (seperti Pyodide/Docker sandbox) yang mengizinkan eksekusi skrip sembarang dari pengguna.

3. *Leaderboard* daring (*real-time global multiplayer*) antar sekolah.

4. Panel admin guru terpisah untuk ekspor nilai ke Excel/CSV atau manajemen kelas secara massal.

5. Integrasi kecerdasan buatan (*AI Tutor*) berbasis API eksternal.

## 9. Acceptance Criteria (Kriteria Penerimaan Manual)

Daftar periksa berikut digunakan untuk memverifikasi kelayakan aplikasi secara manual sebelum rilis MVP:

* \[ \] **AC-01 (Dashboard & Navigasi):** Dashboard menampilkan Level, XP Bar, Total Poin, Progres 3 Kategori (Python, JavaScript, SQL), dan dapat berpindah antar tab tanpa *reload* halaman maupun *error* di konsol browser.

* \[ \] **AC-02 (Materi & Ilustrasi Lokal):** Tersedia minimal 12 materi (4 Python, 4 JavaScript, 4 SQL), filter kategori bekerja, dan setiap materi menampilkan ilustrasi SVG lokal (tetap tampil saat mode *offline*).

* \[ \] **AC-03 (Fungsi Kuis & Pembahasan):** Tersedia minimal 20 soal kuis pilihan ganda; memilih jawaban langsung menampilkan status Benar/Salah beserta teks penjelasan konseptualnya.

* \[ \] **AC-04 (Perhitungan Poin, XP & Anti-Farming):** Menjawab benar soal baru menambah Poin dan XP sesuai bobot. Mengulang soal yang sama menampilkan keterangan *Mode Latihan* dan **tidak** menambah Poin/XP lagi.

* \[ \] **AC-05 (Kenaikan Level & Pemberian Badge):** Saat total XP melewati ambang batas (misal $\ge 100$ XP), Level otomatis naik ke Level 2 dengan notifikasi. Menyelesaikan syarat *badge* (misal 1 materi selesai atau 4/4 materi Python) otomatis membuka *badge* terkait.

* \[ \] **AC-06 (Daily Challenge Lokal):** Menampilkan tantangan sesuai tanggal lokal perangkat; setelah dijawab benar, status berubah menjadi "Selesai" dan tidak dapat diklaim ulang pada tanggal yang sama.

* \[ \] **AC-07 (Leaderboard Lokal):** Menampilkan peringkat gabungan profil aktif dan 5 profil demo terurut dari poin tertinggi ke terendah; posisi profil aktif bergerak naik saat poin bertambah.

* \[ \] **AC-08 (3 Simulasi Interaktif):**

  * *Labirin Robot Python:* Perintah menggerakkan robot di Canvas, mendeteksi dinding/koin/finis, dan memberi reward saat menang.

  * *Gerbang Logika JS:* Perubahan input langsung memperbarui status warna jalur SVG dan evaluasi boolean secara akurat.

  * *Detektif Data SQL:* Perubahan filter memperbarui pratinjau query dan baris tabel secara akurat, serta memvalidasi jawaban tersangka.

* \[ \] **AC-09 (Persistensi `localStorage`):** Setelah menyelesaikan materi/kuis/simulasi lalu melakukan *refresh* browser (`F5`), seluruh XP, Poin, Level, Badge, dan progres materi tetap tersimpan utuh.

* \[ \] **AC-10 (Ganti Profil & Reset Progres):** Berganti profil memisahkan progres antar slot; menekan tombol Reset Progres (setelah konfirmasi) mengembalikan seluruh skor, level, dan materi profil aktif ke nol.

## 10. Implementation Plan per Iterasi

Pengembangan dibagi menjadi **4 iterasi terstruktur** agar setiap tahapan dapat diuji secara bertahap:

### Iterasi 1: Fondasi Proyek, State Engine, & UI Kerangka (Estimasi: 2–3 Hari)

* Inisialisasi proyek **Vite + Vanilla JavaScript** dan struktur direktori modular.

* Implementasi `store.js` untuk manajemen *state*, persistensi `localStorage`, *profile switcher*, validasi alias non-pribadi, dan sistem perhitungan Level/XP.

* Pembangunan *layout* responsif (*Header*, navigasi tab, *Dashboard* gamifikasi, *toast notification*, dan modal konfirmasi).

* **Verifikasi:** Navigasi lancar, ganti profil bekerja, data tersimpan setelah *reload*.

### Iterasi 2: Modul Materi, Ilustrasi SVG, & Mesin Kuis Anti-Farming (Estimasi: 3–4 Hari)

* Pembuatan 12 materi pembelajaran (Python, JavaScript, SQL) beserta 12 ilustrasi SVG lokal.

* Pembuatan 24 soal kuis pilihan ganda lengkap dengan pembahasan benar/salah.

* Implementasi logika *anti-farming* (`claimedQuestions`), pembaruan *progress bar* kategori, serta evaluator otomatis untuk 6 *Achievement Badges*.

* **Verifikasi:** AC-02, AC-03, AC-04, dan AC-05 lulus uji manual.

### Iterasi 3: Tiga Skenario Simulasi Game Interaktif (Estimasi: 4–5 Hari)

* Pengembangan **Simulasi 1 (Labirin Robot Python)** menggunakan HTML5 Canvas & antrean perintah aman.

* Pengembangan **Simulasi 2 (Gerbang Logika JavaScript)** menggunakan SVG dinamis & evaluasi kondisi *real-time*.

* Pengembangan **Simulasi 3 (Detektif Data SQL)** menggunakan *Visual Query Builder* & dataset log non-pribadi.

* Integrasi pemberian reward satu kali klaim dan syarat *badge* **Master Simulasi**.

* **Verifikasi:** AC-08 lulus uji manual pada desktop dan layar mobile.

### Iterasi 4: Daily Challenge, Leaderboard, Ringkasan, Reset & QA Akhir (Estimasi: 2–3 Hari)

* Implementasi **Daily Challenge** berbasis tanggal lokal (`YYYY-MM-DD`) dengan bank soal harian.

* Implementasi **Leaderboard Lokal** (penggabungan profil aktif + 5 profil demo).

* Implementasi **Dashboard Ringkasan Pencapaian** dan fitur **Reset Progres**.

* Pengujian menyeluruh terhadap seluruh kriteria penerimaan (AC-01 s.d. AC-10), pemeriksaan *console error*, pengujian mode *offline*, dan penyempurnaan responsivitas.

* **Verifikasi:** Seluruh Acceptance Criteria terpenuhi dan siap digunakan.