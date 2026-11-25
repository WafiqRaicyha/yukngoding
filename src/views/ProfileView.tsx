import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogOut,
  RotateCcw,
  Save,
  Shield,
  Sparkles,
} from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { BadgeIcon } from '../components/BadgeIcon';
import { AVATAR_OPTIONS, UserAvatar } from '../components/UserAvatar';
import { ACHIEVEMENTS, getLevelInfo } from '../data/badges';
import { getByteEvolution, getByteNextTargetText } from '../data/byteMascot';
import { MATERI_LIST } from '../data/materi';
import { AccentTheme, AvatarId, KategoriBahasa, UserAccount } from '../types';

interface ProfileViewProps {
  user: UserAccount;
  onUpdateProfile: (params: {
    namaAlias: string;
    avatar: AvatarId;
    bio: string;
    temaAksen: AccentTheme;
  }) => { ok: boolean; error?: string };
  onChangePassword: (params: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  onOpenResetModal: () => void;
  onLogout: () => void;
  onOpenAdminPanel?: () => void;
}

const ACCENT_OPTIONS: {
  id: AccentTheme;
  label: string;
  topBarClass: string;
  swatchClass: string;
  progressClass: string;
}[] = [
  {
    id: 'blue',
    label: 'Biru',
    topBarClass: 'bg-[#2563EB]',
    swatchClass: 'bg-[#2563EB]',
    progressClass: 'bg-[#2563EB]',
  },
  {
    id: 'purple',
    label: 'Ungu',
    topBarClass: 'bg-[#7C3AED]',
    swatchClass: 'bg-[#7C3AED]',
    progressClass: 'bg-[#7C3AED]',
  },
  {
    id: 'green',
    label: 'Hijau',
    topBarClass: 'bg-[#10B981]',
    swatchClass: 'bg-[#10B981]',
    progressClass: 'bg-[#10B981]',
  },
];

const LANG_CATEGORIES: { kategori: KategoriBahasa; barClass: string }[] = [
  { kategori: 'Python', barClass: 'bg-[#2563EB]' },
  { kategori: 'JavaScript', barClass: 'bg-[#7C3AED]' },
  { kategori: 'SQL', barClass: 'bg-[#10B981]' },
];

export function ProfileView({
  user,
  onUpdateProfile,
  onChangePassword,
  onOpenResetModal,
  onLogout,
  onOpenAdminPanel,
}: ProfileViewProps) {
  const { gamifikasi, profile } = user;
  const levelInfo = getLevelInfo(gamifikasi.xp);
  const byteEvo = getByteEvolution(gamifikasi.level);
  const byteNextTarget = getByteNextTargetText(gamifikasi.level, gamifikasi.xp);
  const materiIds = Object.keys(gamifikasi.materiSelesai);

  const activeAccent =
    ACCENT_OPTIONS.find((a) => a.id === profile.temaAksen) ?? ACCENT_OPTIONS[0];

  // Edit profile form state
  const [aliasInput, setAliasInput] = useState(profile.namaAlias);
  const [avatarInput, setAvatarInput] = useState<AvatarId>(profile.avatar);
  const [bioInput, setBioInput] = useState(profile.bio);
  const [themeInput, setThemeInput] = useState<AccentTheme>(profile.temaAksen);
  const [profileFeedback, setProfileFeedback] = useState<{
    type: 'idle' | 'ok' | 'err';
    text: string;
  }>({ type: 'idle', text: '' });

  // Change password form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwFeedback, setPwFeedback] = useState<{
    type: 'idle' | 'ok' | 'err';
    text: string;
  }>({ type: 'idle', text: '' });
  const [pwSubmitting, setPwSubmitting] = useState(false);

  useEffect(() => {
    setAliasInput(profile.namaAlias);
    setAvatarInput(profile.avatar);
    setBioInput(profile.bio);
    setThemeInput(profile.temaAksen);
  }, [profile.avatar, profile.bio, profile.namaAlias, profile.temaAksen]);

  const handleProfileSave = (e: FormEvent) => {
    e.preventDefault();
    const res = onUpdateProfile({
      namaAlias: aliasInput,
      avatar: avatarInput,
      bio: bioInput,
      temaAksen: themeInput,
    });
    if (res.ok) {
      setProfileFeedback({ type: 'ok', text: 'Perubahan profil berhasil disimpan.' });
    } else {
      setProfileFeedback({
        type: 'err',
        text: res.error ?? 'Gagal menyimpan perubahan profil.',
      });
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPwFeedback({ type: 'idle', text: '' });
    setPwSubmitting(true);
    try {
      const res = await onChangePassword({ oldPassword, newPassword, confirmPassword });
      if (res.ok) {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPwFeedback({ type: 'ok', text: 'Password akun berhasil diperbarui.' });
      } else {
        setPwFeedback({ type: 'err', text: res.error ?? 'Gagal mengganti password.' });
      }
    } finally {
      setPwSubmitting(false);
    }
  };

  return (
    <section className="space-y-8">
      {/* Page Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Profil &amp; Pengaturan Akun
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Kelola identitas belajar, koleksi badge, riwayat materi, serta keamanan akun lokalmu.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {user.role === 'admin' && onOpenAdminPanel && (
            <button
              type="button"
              onClick={onOpenAdminPanel}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#6D28D9] bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
            >
              <Shield className="w-4 h-4" aria-hidden="true" />
              <span>Buka Panel Admin</span>
            </button>
          )}
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* 1. Identity & Mascot Card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className={`h-1.5 w-full ${activeAccent.topBarClass}`} aria-hidden="true" />
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <UserAvatar avatar={profile.avatar} level={gamifikasi.level} size="lg" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-extrabold text-slate-900 truncate">
                  {profile.namaAlias}
                </h2>
                <span
                  className={`text-xs font-bold uppercase tracking-wide ${
                    user.role === 'admin' ? 'text-[#7C3AED]' : 'text-[#2563EB]'
                  }`}
                >
                  · {user.role === 'admin' ? 'Admin' : 'Learner'}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-slate-500">
                @{user.username} · Bergabung {user.createdAt}
              </p>
              <p className="text-sm text-slate-700 leading-relaxed max-w-xl">
                {profile.bio || 'Belum ada bio singkat. Tambahkan bio belajarmu di bagian Edit Profil.'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-slate-500">Level &amp; Evolusi Byte</p>
                <p className="text-base font-extrabold text-slate-900 tabular-nums mt-0.5">
                  Level {levelInfo.current.level} · {levelInfo.current.gelar}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#7C3AED] inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{byteEvo.name}</span>
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-mono font-semibold text-slate-800 tabular-nums">
                  {gamifikasi.xp} XP
                </span>
                <span className="text-slate-500 tabular-nums">
                  {levelInfo.next
                    ? `${levelInfo.xpToNext} XP ke Level ${levelInfo.next.level}`
                    : 'Level Maksimum'}
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={levelInfo.progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progres XP level profil"
                className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden"
              >
                <div
                  className={`h-full ${activeAccent.progressClass} rounded-full transition-all duration-300`}
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-slate-600">{byteNextTarget}</p>
          </div>
        </div>
      </div>

      {/* 2. Personal Stats & Language Breakdown */}
      <div className="space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500">Total Poin</p>
            <p className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-1">
              {gamifikasi.totalPoin}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500">Total XP</p>
            <p className="text-2xl font-extrabold text-[#7C3AED] font-mono tabular-nums mt-1">
              {gamifikasi.xp}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500">Materi Selesai</p>
            <p className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums mt-1">
              {materiIds.length}/{MATERI_LIST.length}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500">Simulasi Selesai</p>
            <p className="text-2xl font-extrabold text-[#2563EB] font-mono tabular-nums mt-1">
              {gamifikasi.simulasiSelesai.length}/3
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 col-span-2 sm:col-span-1">
            <p className="text-xs font-medium text-slate-500">Badge Terbuka</p>
            <p className="text-2xl font-extrabold text-[#1E3A8A] font-mono tabular-nums mt-1">
              {gamifikasi.badge.length}/{ACHIEVEMENTS.length}
            </p>
          </div>
        </div>

        {/* 3-Language Progress Bars */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">Progres per Bahasa</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {LANG_CATEGORIES.map((lang) => {
              const mods = MATERI_LIST.filter((m) => m.kategori === lang.kategori);
              const done = mods.filter((m) => Boolean(gamifikasi.materiSelesai[m.id])).length;
              const pct = Math.round((done / mods.length) * 100);
              return (
                <div key={lang.kategori} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{lang.kategori}</span>
                    <span className="font-mono text-slate-600 tabular-nums">
                      {done}/{mods.length} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${lang.barClass} rounded-full transition-all duration-300`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievement Badges Gallery */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Etalase Achievement Badges</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Terbuka otomatis saat kamu menyelesaikan materi, simulasi, dan Daily Challenge.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-700 tabular-nums">
              {gamifikasi.badge.length} / {ACHIEVEMENTS.length} terbuka
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {ACHIEVEMENTS.map((badge) => {
              const unlocked = gamifikasi.badge.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                    unlocked
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-slate-50 border-slate-200 opacity-75'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      unlocked ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {unlocked ? (
                      <BadgeIcon iconKey={badge.iconKey} className="w-5 h-5" />
                    ) : (
                      <Lock className="w-4 h-4" aria-hidden="true" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{badge.nama}</h3>
                      {unlocked && (
                        <CheckCircle2
                          className="w-3.5 h-3.5 text-emerald-600 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {badge.deskripsi}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Syarat: {badge.syaratPencapaian}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Account Settings Grid (Edit Profile + Change Password + Danger Zone) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Edit Profile Form */}
        <form
          onSubmit={handleProfileSave}
          className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-5"
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900">Edit Profil</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ubah Nama Alias, pilih Avatar, tema aksen kartu, dan bio singkatmu.
            </p>
          </div>

          {profileFeedback.type !== 'idle' && (
            <div
              role={profileFeedback.type === 'err' ? 'alert' : 'status'}
              className={`p-3 rounded-xl border text-xs sm:text-sm ${
                profileFeedback.type === 'ok'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {profileFeedback.text}
            </div>
          )}

          <div>
            <label
              htmlFor="profile-alias"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Nama Alias (3–18 karakter)
            </label>
            <input
              id="profile-alias"
              type="text"
              maxLength={18}
              value={aliasInput}
              onChange={(e) => setAliasInput(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-2">
              Pilih Avatar Lokal
            </span>
            <div
              role="group"
              aria-label="Pilihan avatar profil"
              className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
            >
              {AVATAR_OPTIONS.map((opt) => {
                const selected = avatarInput === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setAvatarInput(opt.id)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                      selected
                        ? 'border-[#2563EB] bg-blue-50/70'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <UserAvatar avatar={opt.id} level={gamifikasi.level} size="sm" />
                    <span className="text-[11px] font-semibold text-slate-800 text-center leading-tight">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-2">
              Tema Aksen Kartu Profil
            </span>
            <div role="group" aria-label="Tema aksen kartu" className="grid grid-cols-3 gap-2.5">
              {ACCENT_OPTIONS.map((opt) => {
                const selected = themeInput === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setThemeInput(opt.id)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                      selected
                        ? 'border-slate-900 bg-slate-50 text-slate-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${opt.swatchClass}`} aria-hidden="true" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="profile-bio" className="text-xs font-semibold text-slate-700">
                Bio Singkat (non-pribadi)
              </label>
              <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                {bioInput.length}/80
              </span>
            </div>
            <textarea
              id="profile-bio"
              rows={2}
              maxLength={80}
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              placeholder="Contoh: Lagi seru belajar Python dan SQL dari nol!"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            <span>Simpan Profil</span>
          </button>
        </form>

        {/* Right Column: Security (Change Password) + Reset Progress */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handlePasswordSubmit}
            className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
            noValidate
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#7C3AED]" aria-hidden="true" />
                <h2 className="text-base font-bold text-slate-900">Keamanan Akun</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPw((prev) => !prev)}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
              >
                {showPw ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Sembunyikan</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Tampilkan</span>
                  </>
                )}
              </button>
            </div>

            {pwFeedback.type !== 'idle' && (
              <div
                role={pwFeedback.type === 'err' ? 'alert' : 'status'}
                className={`p-3 rounded-xl border text-xs ${
                  pwFeedback.type === 'ok'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {pwFeedback.text}
              </div>
            )}

            <div>
              <label htmlFor="pw-old" className="block text-xs font-semibold text-slate-700 mb-1">
                Password Lama
              </label>
              <input
                id="pw-old"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label htmlFor="pw-new" className="block text-xs font-semibold text-slate-700 mb-1">
                Password Baru (min. 4 karakter)
              </label>
              <input
                id="pw-new"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={4}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label
                htmlFor="pw-confirm"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Konfirmasi Password Baru
              </label>
              <input
                id="pw-confirm"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={4}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <button
              type="submit"
              disabled={pwSubmitting}
              className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172E6E] disabled:opacity-60 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              {pwSubmitting ? 'Menyimpan...' : 'Ganti Password / PIN'}
            </button>
          </form>

          {/* Danger Zone: Personal Progress Reset */}
          <div className="bg-white border border-red-200 rounded-2xl p-6 space-y-3">
            <h2 className="text-base font-bold text-red-700">Zona Reset Progres</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mengembalikan Poin, XP, Level, Badge, materi, dan evolusi Byte milik akun{' '}
              <strong>@{user.username}</strong> kembali ke Level 1 (Spark Byte). Akun dan password tetap tersimpan.
            </p>
            <button
              type="button"
              onClick={onOpenResetModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset Progres Pribadi</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Completed Modules History Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Riwayat Materi Selesai</h2>
          <span className="text-xs text-slate-500 tabular-nums">
            {materiIds.length} modul tercatat
          </span>
        </div>

        {materiIds.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-slate-500">
            Belum ada materi yang diselesaikan pada akun ini. Mulai belajar dari menu Materi untuk melihat riwayat belajarmu.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="px-6 py-3">Modul Materi</th>
                  <th className="px-6 py-3">Kategori</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Skor Terbaik</th>
                  <th className="px-6 py-3 text-right">Tanggal Selesai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.entries(gamifikasi.materiSelesai).map(([materiId, entry]) => {
                  const mod = MATERI_LIST.find((m) => m.id === materiId);
                  return (
                    <tr key={materiId} className="hover:bg-slate-50">
                      <td className="px-6 py-3.5 font-medium text-slate-900">
                        {mod ? mod.judul : materiId}
                      </td>
                      <td className="px-6 py-3.5 text-slate-600">{mod ? mod.kategori : '-'}</td>
                      <td className="px-6 py-3.5 text-emerald-700 font-semibold text-xs">
                        {entry.status}
                      </td>
                      <td className="px-6 py-3.5 text-right font-mono font-semibold text-slate-900 tabular-nums">
                        {entry.skor}%
                      </td>
                      <td className="px-6 py-3.5 text-right font-mono text-xs text-slate-500 tabular-nums">
                        {entry.tanggalPenyelesaian}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
