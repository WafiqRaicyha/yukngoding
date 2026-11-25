import { Achievement, GamifikasiData, LevelInfo } from '../types';

export const LEVEL_TABLE: LevelInfo[] = [
  { level: 1, minXp: 0, gelar: 'Pemula Koding' },
  { level: 2, minXp: 100, gelar: 'Penjelajah Sintaks' },
  { level: 3, minXp: 250, gelar: 'Pengendali Logika' },
  { level: 4, minXp: 450, gelar: 'Arsitek Algoritma' },
  { level: 5, minXp: 700, gelar: 'Jawara Kode' },
  { level: 6, minXp: 1000, gelar: 'Grandmaster YukNgoding' },
];

export function getLevelInfo(xp: number): {
  current: LevelInfo;
  next: LevelInfo | null;
  progressPercent: number;
  xpToNext: number;
} {
  let current = LEVEL_TABLE[0];
  let next: LevelInfo | null = LEVEL_TABLE[1];

  for (let i = 0; i < LEVEL_TABLE.length; i++) {
    if (xp >= LEVEL_TABLE[i].minXp) {
      current = LEVEL_TABLE[i];
      next = LEVEL_TABLE[i + 1] ?? null;
    }
  }

  if (!next) {
    return {
      current,
      next: null,
      progressPercent: 100,
      xpToNext: 0,
    };
  }

  const span = next.minXp - current.minXp;
  const gained = xp - current.minXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((gained / span) * 100)));

  return {
    current,
    next,
    progressPercent,
    xpToNext: Math.max(0, next.minXp - xp),
  };
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'badge-first',
    nama: 'Langkah Pertama',
    deskripsi: 'Menyelesaikan materi pembelajaran pertama di YukNgoding.',
    iconKey: 'rocket',
    syaratPencapaian: 'Selesaikan minimal 1 materi dari kategori apa pun.',
  },
  {
    id: 'badge-python',
    nama: 'Penjelajah Python',
    deskripsi: 'Menguasai seluruh fondasi logika dan algoritma Python.',
    iconKey: 'terminal',
    syaratPencapaian: 'Selesaikan seluruh 4 materi kategori Python (py-1 s.d. py-4).',
  },
  {
    id: 'badge-js',
    nama: 'Arsitek JavaScript',
    deskripsi: 'Menguasai seluruh modul interaktivitas web JavaScript.',
    iconKey: 'braces',
    syaratPencapaian: 'Selesaikan seluruh 4 materi kategori JavaScript (js-1 s.d. js-4).',
  },
  {
    id: 'badge-sql',
    nama: 'Detektif SQL',
    deskripsi: 'Menguasai seluruh teknik query dan agregasi data SQL.',
    iconKey: 'database',
    syaratPencapaian: 'Selesaikan seluruh 4 materi kategori SQL (sql-1 s.d. sql-4).',
  },
  {
    id: 'badge-daily',
    nama: 'Pejuang Harian',
    deskripsi: 'Menuntaskan tantangan koding harian berbasis tanggal lokal.',
    iconKey: 'calendar',
    syaratPencapaian: 'Selesaikan minimal 1 Daily Challenge.',
  },
  {
    id: 'badge-sim',
    nama: 'Master Simulasi',
    deskripsi: 'Menaklukkan ketiga skenario simulasi game interaktif.',
    iconKey: 'gamepad',
    syaratPencapaian: 'Selesaikan Simulasi Python, JavaScript, dan SQL.',
  },
  {
    id: 'badge-all',
    nama: 'Bintang YukNgoding',
    deskripsi: 'Menuntaskan seluruh 12 modul inti di ketiga bahasa.',
    iconKey: 'trophy',
    syaratPencapaian: 'Selesaikan semua 12 materi (Python, JavaScript, dan SQL).',
  },
];

const PYTHON_IDS = ['py-1', 'py-2', 'py-3', 'py-4'];
const JS_IDS = ['js-1', 'js-2', 'js-3', 'js-4'];
const SQL_IDS = ['sql-1', 'sql-2', 'sql-3', 'sql-4'];

export function evaluateUnlockedBadges(gamifikasi: GamifikasiData): string[] {
  const unlocked = new Set(gamifikasi.badge);
  const done = new Set(Object.keys(gamifikasi.materiSelesai));
  const sims = new Set(gamifikasi.simulasiSelesai);

  if (done.size >= 1) unlocked.add('badge-first');
  if (PYTHON_IDS.every((id) => done.has(id))) unlocked.add('badge-python');
  if (JS_IDS.every((id) => done.has(id))) unlocked.add('badge-js');
  if (SQL_IDS.every((id) => done.has(id))) unlocked.add('badge-sql');
  if (gamifikasi.dailyCompletedDates.length >= 1) unlocked.add('badge-daily');
  if (sims.has('sim-python') && sims.has('sim-js') && sims.has('sim-sql')) {
    unlocked.add('badge-sim');
  }
  if ([...PYTHON_IDS, ...JS_IDS, ...SQL_IDS].every((id) => done.has(id))) {
    unlocked.add('badge-all');
  }

  return Array.from(unlocked);
}
