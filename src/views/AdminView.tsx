import {
  AlertTriangle,
  BookOpen,
  Eye,
  EyeOff,
  Megaphone,
  RotateCcw,
  Search,
  Shield,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { BadgeIcon } from '../components/BadgeIcon';
import { UserAvatar } from '../components/UserAvatar';
import { ACHIEVEMENTS, getLevelInfo } from '../data/badges';
import { MATERI_LIST } from '../data/materi';
import { GlobalAnnouncement, KategoriBahasa, UserAccount } from '../types';

interface AdminViewProps {
  currentUser: UserAccount;
  users: UserAccount[];
  announcement: GlobalAnnouncement;
  onCreateUser: (params: {
    namaAlias: string;
    username: string;
    password: string;
    createdByAdmin?: boolean;
  }) => Promise<{ ok: boolean; user?: UserAccount; error?: string }>;
  onResetUserProgress: (targetUserId: string) => void;
  onDeleteUser: (targetUserId: string) => { ok: boolean; error?: string };
  onUpdateAnnouncement: (pesan: string) => { ok: boolean; error?: string };
  onPreviewLearning: () => void;
}

type ConfirmActionState =
  | { type: 'reset'; user: UserAccount }
  | { type: 'delete'; user: UserAccount }
  | null;

const LANGS: KategoriBahasa[] = ['Python', 'JavaScript', 'SQL'];

export function AdminView({
  currentUser,
  users,
  announcement,
  onCreateUser,
  onResetUserProgress,
  onDeleteUser,
  onUpdateAnnouncement,
  onPreviewLearning,
}: AdminViewProps) {
  const learnerUsers = useMemo(
    () =>
      users
        .filter((u) => u.role === 'user')
        .sort((a, b) => b.gamifikasi.totalPoin - a.gamifikasi.totalPoin),
    [users],
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [detailUserId, setDetailUserId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmActionState>(null);

  // Add User Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newAlias, setNewAlias] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSubmitting, setAddSubmitting] = useState(false);

  // Global announcement form state
  const [announcementInput, setAnnouncementInput] = useState(announcement.pesan);
  const [annError, setAnnError] = useState('');

  useEffect(() => {
    setAnnouncementInput(announcement.pesan);
  }, [announcement.pesan]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setDetailUserId(null);
        setConfirmAction(null);
        setAddModalOpen(false);
      }
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const filteredLearners = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return learnerUsers;
    return learnerUsers.filter(
      (u) =>
        u.profile.namaAlias.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q),
    );
  }, [learnerUsers, searchQuery]);

  const detailUser = useMemo(
    () => users.find((u) => u.id === detailUserId) ?? null,
    [detailUserId, users],
  );

  // Summary metrics across registered learners on this device
  const totalLearners = learnerUsers.length;
  const avgCompletionPct = useMemo(() => {
    if (totalLearners === 0) return 0;
    const sum = learnerUsers.reduce(
      (acc, u) => acc + Object.keys(u.gamifikasi.materiSelesai).length,
      0,
    );
    return Math.round((sum / (totalLearners * MATERI_LIST.length)) * 100);
  }, [learnerUsers, totalLearners]);

  const totalQuizzesAnswered = useMemo(
    () => learnerUsers.reduce((acc, u) => acc + u.gamifikasi.claimedQuestions.length, 0),
    [learnerUsers],
  );

  const topLearner = learnerUsers[0] ?? null;

  const handleSaveAnnouncement = (e: FormEvent) => {
    e.preventDefault();
    setAnnError('');
    const res = onUpdateAnnouncement(announcementInput);
    if (!res.ok) {
      setAnnError(res.error ?? 'Gagal memperbarui pengumuman.');
    }
  };

  const handleCreateUserSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddSubmitting(true);
    try {
      const res = await onCreateUser({
        namaAlias: newAlias,
        username: newUsername,
        password: newPassword,
        createdByAdmin: true,
      });
      if (res.ok) {
        setNewAlias('');
        setNewUsername('');
        setNewPassword('');
        setAddModalOpen(false);
      } else {
        setAddError(res.error ?? 'Gagal menambahkan akun pembelajar.');
      }
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleConfirmModalSubmit = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'reset') {
      onResetUserProgress(confirmAction.user.id);
    } else if (confirmAction.type === 'delete') {
      onDeleteUser(confirmAction.user.id);
    }
    setConfirmAction(null);
  };

  return (
    <section className="space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#7C3AED]">
            <Shield className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Akses Khusus Admin · @{currentUser.username}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            Panel Admin YukNgoding
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
            Pantau progres seluruh akun pembelajar di perangkat ini, kelola akun user, dan publikasikan pengumuman belajar global.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onPreviewLearning}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <BookOpen className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
            <span>Mode Pratinjau Belajar</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAddError('');
              setAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
          >
            <UserPlus className="w-4 h-4" aria-hidden="true" />
            <span>Tambah User</span>
          </button>
        </div>
      </div>

      {/* 4 Device KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
          <p className="text-xs font-medium text-slate-500">Total Akun Pembelajar</p>
          <p className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">
            {totalLearners}
          </p>
          <p className="text-xs text-slate-500 mt-1">Terdaftar lokal di perangkat</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
          <p className="text-xs font-medium text-slate-500">Rata-rata Penyelesaian</p>
          <p className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums mt-1">
            {avgCompletionPct}%
          </p>
          <p className="text-xs text-slate-500 mt-1">Dari 12 modul kurikulum</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
          <p className="text-xs font-medium text-slate-500">Total Soal Kuis Tuntas</p>
          <p className="text-2xl font-extrabold text-[#2563EB] font-mono tabular-nums mt-1">
            {totalQuizzesAnswered}
          </p>
          <p className="text-xs text-slate-500 mt-1">Akumulasi seluruh user</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
          <p className="text-xs font-medium text-slate-500">Peringkat Teratas Lokal</p>
          <p className="text-lg font-extrabold text-[#7C3AED] truncate mt-1">
            {topLearner ? topLearner.profile.namaAlias : 'Belum ada'}
          </p>
          <p className="text-xs text-slate-500 font-mono tabular-nums mt-1">
            {topLearner
              ? `${topLearner.gamifikasi.totalPoin} Poin · Lv.${topLearner.gamifikasi.level}`
              : 'Tambahkan akun user'}
          </p>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Daftar Akun Pembelajar</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Akun Admin (@{currentUser.username}) terlindungi dan tidak ditampilkan dalam daftar penghapusan.
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari alias atau @username..."
              aria-label="Cari akun pembelajar"
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>
        </div>

        {filteredLearners.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            {totalLearners === 0
              ? 'Belum ada akun pembelajar terdaftar. Klik "Tambah User" untuk membuat akun pertama.'
              : 'Tidak ada akun pembelajar yang cocok dengan kata kunci pencarian.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="px-5 py-3.5">Pembelajar</th>
                  <th className="px-5 py-3.5">Level</th>
                  <th className="px-5 py-3.5 text-right">Total Poin</th>
                  <th className="px-5 py-3.5 text-right">Materi Selesai</th>
                  <th className="px-5 py-3.5 text-right">Terakhir Aktif</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLearners.map((u) => {
                  const doneCount = Object.keys(u.gamifikasi.materiSelesai).length;
                  const gelar = getLevelInfo(u.gamifikasi.xp).current.gelar;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <UserAvatar avatar={u.profile.avatar} level={u.gamifikasi.level} size="xs" />
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 truncate">
                              {u.profile.namaAlias}
                            </div>
                            <div className="text-xs font-mono text-slate-500">@{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-[#1E3A8A] tabular-nums">
                          Lv.{u.gamifikasi.level}
                        </span>{' '}
                        <span className="text-xs text-slate-600">· {gelar}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-[#2563EB] tabular-nums">
                        {u.gamifikasi.totalPoin}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-slate-700 tabular-nums">
                        {doneCount}/{MATERI_LIST.length}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-xs text-slate-500 tabular-nums">
                        {u.lastActive}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setDetailUserId(u.id)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-[#1E3A8A] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                          >
                            Detail
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmAction({ type: 'reset', user: u })}
                            title={`Reset progres ${u.profile.namaAlias}`}
                            className="p-1.5 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                            aria-label={`Reset progres ${u.profile.namaAlias}`}
                          >
                            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmAction({ type: 'delete', user: u })}
                            title={`Hapus akun ${u.profile.namaAlias}`}
                            className="p-1.5 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
                            aria-label={`Hapus akun ${u.profile.namaAlias}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Global Announcement Board */}
      <form
        onSubmit={handleSaveAnnouncement}
        className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-[#7C3AED] flex items-center justify-center">
              <Megaphone className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Papan Pengumuman Global</h2>
              <p className="text-xs text-slate-500">
                Pesan tampil sebagai banner info belajar di halaman Dashboard seluruh pembelajar.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-500 tabular-nums">
            {announcementInput.length}/220
          </span>
        </div>

        {annError && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800"
          >
            {annError}
          </div>
        )}

        <div>
          <label htmlFor="admin-announcement" className="sr-only">
            Isi pengumuman global
          </label>
          <textarea
            id="admin-announcement"
            rows={3}
            maxLength={220}
            value={announcementInput}
            onChange={(e) => setAnnouncementInput(e.target.value)}
            placeholder="Tulis pengumuman atau tips belajar untuk semua pembelajar..."
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Terakhir diperbarui oleh <strong>{announcement.updatedBy}</strong> ({announcement.updatedAt})
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setAnnouncementInput('');
                onUpdateAnnouncement('');
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Sembunyikan Banner
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
            >
              Publikasikan Pengumuman
            </button>
          </div>
        </div>
      </form>

      {/* Modal 1: User Detail */}
      {detailUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]"
          onClick={() => setDetailUserId(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-user-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <UserAvatar
                  avatar={detailUser.profile.avatar}
                  level={detailUser.gamifikasi.level}
                  size="md"
                />
                <div>
                  <h3 id="detail-user-title" className="text-lg font-bold text-slate-900">
                    {detailUser.profile.namaAlias}
                  </h3>
                  <p className="text-xs font-mono text-slate-500">
                    @{detailUser.username} · Aktif {detailUser.lastActive}
                  </p>
                  {detailUser.profile.bio && (
                    <p className="text-xs text-slate-600 mt-1">{detailUser.profile.bio}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailUserId(null)}
                aria-label="Tutup detail pengguna"
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                <p className="text-[11px] text-slate-500">Level</p>
                <p className="text-base font-extrabold text-[#1E3A8A] font-mono tabular-nums">
                  Lv.{detailUser.gamifikasi.level}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                <p className="text-[11px] text-slate-500">Total Poin</p>
                <p className="text-base font-extrabold text-[#2563EB] font-mono tabular-nums">
                  {detailUser.gamifikasi.totalPoin}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
                <p className="text-[11px] text-slate-500">Total XP</p>
                <p className="text-base font-extrabold text-[#7C3AED] font-mono tabular-nums">
                  {detailUser.gamifikasi.xp}
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-bold text-slate-900">Progres per Bahasa</p>
              {LANGS.map((lang) => {
                const mods = MATERI_LIST.filter((m) => m.kategori === lang);
                const done = mods.filter((m) =>
                  Boolean(detailUser.gamifikasi.materiSelesai[m.id]),
                ).length;
                const pct = Math.round((done / mods.length) * 100);
                return (
                  <div key={lang} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700 font-medium">{lang}</span>
                      <span className="font-mono text-slate-600 tabular-nums">
                        {done}/{mods.length} modul
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2563EB] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-900">
                Badge Terbuka ({detailUser.gamifikasi.badge.length}/{ACHIEVEMENTS.length})
              </p>
              {detailUser.gamifikasi.badge.length === 0 ? (
                <p className="text-xs text-slate-500">Belum ada badge yang terbuka.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {detailUser.gamifikasi.badge.map((bId) => {
                    const def = ACHIEVEMENTS.find((a) => a.id === bId);
                    if (!def) return null;
                    return (
                      <div
                        key={bId}
                        className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 font-medium"
                      >
                        <BadgeIcon iconKey={def.iconKey} className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span className="truncate">{def.nama}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Add User */}
      {addModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]"
          onClick={() => setAddModalOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-user-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 id="add-user-title" className="text-lg font-bold text-slate-900">
                Tambah Akun Pembelajar Baru
              </h3>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                aria-label="Tutup form tambah user"
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {addError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800"
              >
                {addError}
              </div>
            )}

            <form onSubmit={handleCreateUserSubmit} className="space-y-3.5" noValidate>
              <div>
                <label htmlFor="admin-new-alias" className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Alias
                </label>
                <input
                  id="admin-new-alias"
                  type="text"
                  maxLength={18}
                  required
                  value={newAlias}
                  onChange={(e) => setNewAlias(e.target.value)}
                  placeholder="contoh: Kode_Surya"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-new-username"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Username (huruf kecil, angka, _)
                </label>
                <input
                  id="admin-new-username"
                  type="text"
                  maxLength={18}
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value.toLowerCase())}
                  placeholder="contoh: user2"
                  className="w-full px-3.5 py-2 text-sm font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-new-password"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Password / PIN (min. 4 karakter)
                </label>
                <div className="relative">
                  <input
                    id="admin-new-password"
                    type={showNewPw ? 'text' : 'password'}
                    required
                    minLength={4}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 4 karakter"
                    className="w-full pl-3.5 pr-10 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw((prev) => !prev)}
                    aria-label={showNewPw ? 'Sembunyikan password' : 'Tampilkan password'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-800 rounded-lg"
                  >
                    {showNewPw ? (
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={addSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 rounded-xl"
                >
                  {addSubmitting ? 'Menyimpan...' : 'Simpan User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Confirm Reset or Delete User */}
      {confirmAction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]"
          onClick={() => setConfirmAction(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-confirm-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  confirmAction.type === 'delete'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-amber-50 text-amber-600'
                }`}
              >
                <AlertTriangle className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h3 id="admin-confirm-title" className="text-base font-bold text-slate-900">
                  {confirmAction.type === 'delete'
                    ? `Hapus Akun @${confirmAction.user.username}?`
                    : `Reset Progres @${confirmAction.user.username}?`}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {confirmAction.type === 'delete'
                    ? `Akun ${confirmAction.user.profile.namaAlias} beserta seluruh progres belajarnya akan dihapus permanen dari perangkat ini.`
                    : `Seluruh Poin, XP, Level, Badge, dan materi selesai milik ${confirmAction.user.profile.namaAlias} akan kembali ke 0 (Level 1). Akun tetap aktif.`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmModalSubmit}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-xl ${
                  confirmAction.type === 'delete'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {confirmAction.type === 'delete' ? 'Ya, Hapus Akun' : 'Ya, Reset Progres'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
