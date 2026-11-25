export type KategoriBahasa = 'Python' | 'JavaScript' | 'SQL';

export type TingkatKesulitan = 'Pemula' | 'Menengah' | 'Tantangan';

export type TabId =
  | 'dashboard'
  | 'materi'
  | 'simulasi'
  | 'daily'
  | 'leaderboard'
  | 'profile'
  | 'admin';

export type SimulasiId = 'sim-python' | 'sim-js' | 'sim-sql';

export type UserRole = 'admin' | 'user';

export type AccentTheme = 'blue' | 'purple' | 'green';

export type AvatarId =
  | 'byte-mascot'
  | 'avatar-wizard'
  | 'avatar-cyber'
  | 'avatar-rocket'
  | 'avatar-terminal'
  | 'avatar-circuit'
  | 'avatar-shield';

export interface Materi {
  id: string;
  judul: string;
  kategori: KategoriBahasa;
  deskripsi: string;
  ringkasanParagraf: string[];
  poinPenting: string[];
  contohKode: {
    judul: string;
    bahasa: string;
    kode: string;
    output: string;
  };
  imageUrl: string;
  tingkatKesulitan: TingkatKesulitan;
  estimasiMenit: number;
}

export interface Kuis {
  id: string;
  materiId: string;
  pertanyaan: string;
  potonganKode?: string;
  pilihanJawaban: string[];
  jawabanBenar: number;
  penjelasan: string;
  poin: number;
  xp: number;
}

export interface DailyChallengeItem {
  id: string;
  kategori: KategoriBahasa;
  tingkat: TingkatKesulitan;
  judul: string;
  pertanyaan: string;
  potonganKode?: string;
  pilihanJawaban: string[];
  jawabanBenar: number;
  penjelasan: string;
  poin: number;
  xp: number;
}

export interface Achievement {
  id: string;
  nama: string;
  deskripsi: string;
  iconKey: 'rocket' | 'terminal' | 'braces' | 'database' | 'calendar' | 'gamepad' | 'trophy';
  syaratPencapaian: string;
}

export interface MateriProgressEntry {
  skor: number;
  status: 'Selesai';
  tanggalPenyelesaian: string;
}

export interface UserProfileInfo {
  namaAlias: string;
  avatar: AvatarId;
  bio: string;
  temaAksen: AccentTheme;
}

export interface GamifikasiData {
  xp: number;
  level: number;
  totalPoin: number;
  badge: string[];
  materiSelesai: Record<string, MateriProgressEntry>;
  claimedQuestions: string[];
  simulasiSelesai: SimulasiId[];
  dailyCompletedDates: string[];
}

export interface UserAccount {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  profile: UserProfileInfo;
  gamifikasi: GamifikasiData;
  createdAt: string;
  lastActive: string;
}

export interface AuthSession {
  userId: string;
  role: UserRole;
  loginAt: string;
}

export interface GlobalAnnouncement {
  pesan: string;
  updatedBy: string;
  updatedAt: string;
}

export interface DemoLeaderboardEntry {
  id: string;
  namaAlias: string;
  username?: string;
  peranLabel: string;
  totalPoin: number;
  xp: number;
  level: number;
  badgeCount: number;
  materiCount: number;
  isCurrentUser?: boolean;
  isDemoBot?: boolean;
}

export interface SqlLogRow {
  id_log: number;
  nama_pengguna: string;
  peran: string;
  lokasi: 'Ruang Server' | 'Lab Komputer' | 'Perpustakaan' | 'Ruang Komunitas';
  jam: string;
  aktivitas: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'gamify' | 'info' | 'warning';
}

export interface LevelInfo {
  level: number;
  minXp: number;
  gelar: string;
}
