import {
  ArrowRight,
  Award,
  BookOpen,
  Braces,
  CalendarCheck,
  CheckCircle2,
  Database,
  Gamepad2,
  Megaphone,
  Shield,
  Terminal,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ByteMascot } from '../components/ByteMascot';
import { ACHIEVEMENTS, getLevelInfo } from '../data/badges';
import { ByteMood, getByteEvolution, getByteNextTargetText } from '../data/byteMascot';
import { getDailyChallengeForDate, getTodayLocalDateString } from '../data/kuis';
import { MATERI_LIST } from '../data/materi';
import { GlobalAnnouncement, KategoriBahasa, TabId, UserAccount } from '../types';

interface DashboardViewProps {
  user: UserAccount;
  announcement: GlobalAnnouncement;
  onNavigate: (tab: TabId) => void;
  onOpenCategory: (kategori: KategoriBahasa) => void;
  onOpenMateri: (materiId: string) => void;
}

const CATEGORY_META: {
  kategori: KategoriBahasa;
  subjudul: string;
  accentBar: string;
  iconBg: string;
  ctaHover: string;
  icon: typeof Terminal;
}[] = [
  {
    kategori: 'Python',
    subjudul: 'Logika, percabangan, perulangan, dan fungsi',
    accentBar: 'bg-[#2563EB]',
    iconBg: 'bg-blue-50 text-[#2563EB] ring-1 ring-blue-200/70',
    ctaHover: 'hover:bg-blue-50 hover:text-[#1E3A8A]',
    icon: Terminal,
  },
  {
    kategori: 'JavaScript',
    subjudul: 'Variabel modern, boolean, array, dan DOM web',
    accentBar: 'bg-[#7C3AED]',
    iconBg: 'bg-violet-50 text-[#7C3AED] ring-1 ring-violet-200/70',
    ctaHover: 'hover:bg-violet-50 hover:text-[#5B21B6]',
    icon: Braces,
  },
  {
    kategori: 'SQL',
    subjudul: 'SELECT, filter WHERE, urutan, dan agregasi data',
    accentBar: 'bg-[#10B981]',
    iconBg: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70',
    ctaHover: 'hover:bg-emerald-50 hover:text-emerald-900',
    icon: Database,
  },
];

export function DashboardView({
  user,
  announcement,
  onNavigate,
  onOpenCategory,
  onOpenMateri,
}: DashboardViewProps) {
  const { gamifikasi, profile } = user;
  const completedIds = Object.keys(gamifikasi.materiSelesai);
  const levelInfo = getLevelInfo(gamifikasi.xp);
  const byteEvo = getByteEvolution(gamifikasi.level);
  const byteNextTarget = getByteNextTargetText(gamifikasi.level, gamifikasi.xp);
  const today = getTodayLocalDateString();
  const todayChallenge = getDailyChallengeForDate(today);
  const dailyDone = gamifikasi.dailyCompletedDates.includes(today);

  const [byteMood, setByteMood] = useState<ByteMood>('idle');
  const prevLevelRef = useRef(gamifikasi.level);
  const moodTimerRef = useRef<number | null>(null);

  const triggerCelebrate = () => {
    if (moodTimerRef.current !== null) {
      window.clearTimeout(moodTimerRef.current);
    }
    setByteMood('celebrate');
    moodTimerRef.current = window.setTimeout(() => {
      setByteMood('idle');
      moodTimerRef.current = null;
    }, 2400);
  };

  useEffect(() => {
    if (gamifikasi.level > prevLevelRef.current) {
      triggerCelebrate();
    }
    prevLevelRef.current = gamifikasi.level;
  }, [gamifikasi.level]);

  useEffect(() => {
    return () => {
      if (moodTimerRef.current !== null) {
        window.clearTimeout(moodTimerRef.current);
      }
    };
  }, []);

  const nextRecommendedMateri =
    MATERI_LIST.find((m) => !gamifikasi.materiSelesai[m.id]) ?? MATERI_LIST[0];

  return (
    <section className="space-y-8">
      {/* Admin Preview Notice */}
      {user.role === 'admin' && (
        <div className="bg-violet-50/90 border border-violet-200/90 rounded-2xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-violet-950">
            <Shield className="w-4 h-4 text-[#7C3AED] shrink-0" aria-hidden="true" />
            <span>
              Kamu sedang melihat Dashboard dalam <strong>Mode Pratinjau Admin</strong>.
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="text-xs font-semibold text-[#6D28D9] hover:text-[#4C1D95] whitespace-nowrap"
          >
            Kembali ke Panel Admin →
          </button>
        </div>
      )}

      {/* Global Announcement Banner (Published from Admin Panel) */}
      {announcement.pesan.trim().length > 0 && (
        <div
          role="region"
          aria-label="Pengumuman Global YukNgoding"
          className="surface-card rounded-2xl px-5 py-4 flex items-start gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] ring-1 ring-blue-200/70 flex items-center justify-center shrink-0">
            <Megaphone className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-bold text-[#1E3A8A]">Info Belajar Global</span>
              <span aria-hidden="true">·</span>
              <span>
                {announcement.updatedBy} ({announcement.updatedAt})
              </span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{announcement.pesan}</p>
          </div>
        </div>
      )}

      {/* Focal Hero Banner */}
      <div className="hero-brand-surface rounded-3xl p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-medium text-slate-500">
              {user.role === 'admin' ? 'Admin (Mode Pratinjau)' : 'Pembelajar'} · @{user.username}
            </p>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950 leading-[1.14]">
              Halo, {profile.namaAlias}. Siap lanjutkan misi kodingmu?
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
              Kuasai dasar Python, JavaScript, dan SQL lewat materi ringkas, kuis berpenjelasan konsep, serta 3 simulasi game interaktif.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenMateri(nextRecommendedMateri.id)}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 whitespace-nowrap"
              >
                <span>
                  {completedIds.length === 0
                    ? `Mulai: ${nextRecommendedMateri.judul}`
                    : `Lanjut: ${nextRecommendedMateri.judul}`}
                </span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('simulasi')}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] whitespace-nowrap"
              >
                <Gamepad2 className="w-4 h-4 text-[#7C3AED]" aria-hidden="true" />
                <span>Buka Simulasi</span>
              </button>
            </div>
          </div>

          {/* Interactive Byte Mascot + Level & XP Progress Panel */}
          <div className="lg:col-span-5 bg-white/95 border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={triggerCelebrate}
                aria-label={`Sapa maskot ${byteEvo.name}`}
                title="Klik untuk menyapa Byte"
                className="rounded-2xl p-1.5 bg-slate-50 hover:bg-blue-50/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] shrink-0"
              >
                <ByteMascot level={gamifikasi.level} mood={byteMood} size="md" />
              </button>

              <div className="min-w-0 flex-1 text-center sm:text-left space-y-1">
                <p className="text-xs font-medium text-slate-500">
                  Maskot Pendamping · {levelInfo.current.gelar}
                </p>
                <p className="text-lg font-extrabold text-[#1E3A8A] tabular-nums">
                  Level {levelInfo.current.level} · {byteEvo.name}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {byteMood === 'celebrate'
                    ? `Semangat ${profile.namaAlias}! Ayo selesaikan modul berikutnya bersama Byte!`
                    : byteNextTarget}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  {gamifikasi.xp} XP
                </span>
                <span className="text-slate-500 tabular-nums">
                  {levelInfo.next
                    ? `${levelInfo.xpToNext} XP menuju Level ${levelInfo.next.level}`
                    : 'Level Maksimum Tercapai'}
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={levelInfo.progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progres XP menuju level berikutnya"
                className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] rounded-full transition-all duration-300"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Progres keseluruhan materi</span>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">
                {completedIds.length} / {MATERI_LIST.length} modul
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Column Full-Width KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="surface-card rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-500">Total Poin</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5 font-mono tabular-nums">
            {gamifikasi.totalPoin}
          </p>
          <p className="text-xs text-slate-500 mt-1">Skor papan peringkat</p>
        </div>
        <div className="surface-card rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-500">Experience Points</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#7C3AED] mt-1.5 font-mono tabular-nums">
            {gamifikasi.xp} XP
          </p>
          <p className="text-xs text-slate-500 mt-1">Penentu kenaikan level</p>
        </div>
        <div className="surface-card rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-500">Materi Selesai</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-1.5 font-mono tabular-nums">
            {completedIds.length}/{MATERI_LIST.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">Python, JS, dan SQL</p>
        </div>
        <div className="surface-card rounded-2xl p-5">
          <p className="text-xs font-medium text-slate-500">Achievement Badges</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#1E3A8A] mt-1.5 font-mono tabular-nums">
            {gamifikasi.badge.length}/{ACHIEVEMENTS.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">Lencana terbuka</p>
        </div>
      </div>

      {/* 3 Language Category Progress Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Kurikulum 3 Bahasa Pemrograman
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('materi')}
            className="text-sm font-semibold text-[#2563EB] hover:text-[#1E3A8A] transition-colors whitespace-nowrap"
          >
            Lihat semua materi →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CATEGORY_META.map((cat) => {
            const Icon = cat.icon;
            const modules = MATERI_LIST.filter((m) => m.kategori === cat.kategori);
            const completed = modules.filter((m) => Boolean(gamifikasi.materiSelesai[m.id])).length;
            const pct = Math.round((completed / modules.length) * 100);

            return (
              <div
                key={cat.kategori}
                className="surface-card-interactive rounded-2xl p-6 flex flex-col justify-between gap-6"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${cat.iconBg}`}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-600 tabular-nums">
                      {completed}/{modules.length} modul · {pct}%
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{cat.kategori}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {cat.subjudul}
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.accentBar} rounded-full transition-all duration-300`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenCategory(cat.kategori)}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-800 bg-slate-100/90 ${cat.ctaHover} rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]`}
                  >
                    <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Belajar {cat.kategori}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Access Row: Daily Challenge + Interactive Simulations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="surface-card-interactive rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-5">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700">
                <CalendarCheck className="w-4 h-4" aria-hidden="true" />
                <span>Daily Challenge · {today}</span>
              </div>
              {dailyDone && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Selesai</span>
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">{todayChallenge.judul}</h3>
            <p className="text-sm text-slate-600">
              {todayChallenge.kategori} · {todayChallenge.tingkat} · Reward +{todayChallenge.poin}{' '}
              Poin / +{todayChallenge.xp} XP
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => onNavigate('daily')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172E6E] rounded-xl shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              <span>{dailyDone ? 'Lihat Pembahasan Harian' : 'Kerjakan Tantangan Hari Ini'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="surface-card-interactive rounded-2xl p-6 sm:p-7 flex flex-col justify-between gap-5">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#7C3AED]">
                <Award className="w-4 h-4" aria-hidden="true" />
                <span>Simulasi Interaktif · Canvas &amp; SVG</span>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-600 tabular-nums">
                {gamifikasi.simulasiSelesai.length}/3 selesai
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Labirin Robot, Gerbang Logika, &amp; Detektif SQL
            </h3>
            <p className="text-sm text-slate-600">
              Tiga skenario praktikum visual tanpa setup rumit. Masing-masing berhadiah +50 Poin dan +40 XP.
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => onNavigate('simulasi')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
            >
              <span>Mainkan Simulasi</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
