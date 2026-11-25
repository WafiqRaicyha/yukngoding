import { CalendarCheck, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useState } from 'react';
import { ByteCompanion } from '../components/ByteMascot';
import { ByteMood } from '../data/byteMascot';
import { getDailyChallengeForDate, getTodayLocalDateString } from '../data/kuis';
import { UserAccount } from '../types';

interface DailyChallengeViewProps {
  user: UserAccount;
  onCompleteDaily: (dateStr: string, poin: number, xp: number) => { rewarded: boolean };
}

export function DailyChallengeView({ user, onCompleteDaily }: DailyChallengeViewProps) {
  const { gamifikasi, profile } = user;
  const today = getTodayLocalDateString();
  const challenge = getDailyChallengeForDate(today);
  const alreadyCompletedToday = gamifikasi.dailyCompletedDates.includes(today);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [justClaimed, setJustClaimed] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isAnswered = selectedIndex !== null;
  const isCorrect = selectedIndex === challenge.jawabanBenar;

  const byteMood: ByteMood = isAnswered
    ? isCorrect
      ? 'celebrate'
      : 'encourage'
    : showHint
      ? 'hint'
      : 'idle';

  const byteMessage = isAnswered
    ? isCorrect
      ? justClaimed
        ? `Keren! Tantangan harian ${today} tuntas (+${challenge.poin} Poin, +${challenge.xp} XP)!`
        : 'Jawabanmu benar! Tantangan hari ini sudah tercatat selesai.'
      : 'Hampir tepat! Cek lagi penjelasannya ya, lalu klik Coba Jawab Lagi.'
    : showHint
      ? `Petunjuk Byte: Fokus pada konsep ${challenge.kategori} (${challenge.tingkat}) dan telusuri baris kode langkah demi langkah.`
      : alreadyCompletedToday
        ? 'Kamu sudah menaklukkan tantangan hari ini! Tetap boleh latihan ulang kapan saja.'
        : `Tantangan spesial ${today}! Selesaikan untuk mengklaim +${challenge.poin} Poin dan +${challenge.xp} XP.`;

  const handleChoose = (idx: number) => {
    if (isAnswered) return;
    setSelectedIndex(idx);
    setShowHint(false);
    if (idx === challenge.jawabanBenar && !alreadyCompletedToday) {
      const res = onCompleteDaily(today, challenge.poin, challenge.xp);
      if (res.rewarded) setJustClaimed(true);
    }
  };

  return (
    <section className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Daily Challenge
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1">
          Satu tantangan koding baru dipilih otomatis setiap hari berdasarkan tanggal lokal perangkatmu. Hanya dapat diklaim 1 kali per hari per profil.
        </p>
      </div>

      <ByteCompanion
        level={gamifikasi.level}
        mood={byteMood}
        message={byteMessage}
        actionLabel={!isAnswered ? (showHint ? 'Tutup Petunjuk' : 'Petunjuk Byte') : undefined}
        onAction={!isAnswered ? () => setShowHint((prev) => !prev) : undefined}
      />

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
            <CalendarCheck className="w-5 h-5 text-amber-600" aria-hidden="true" />
            <span className="font-mono tabular-nums">{today}</span>
            <span aria-hidden="true">·</span>
            <span>{challenge.kategori}</span>
            <span aria-hidden="true">·</span>
            <span>{challenge.tingkat}</span>
          </div>
          <span
            className={`text-xs font-semibold ${
              alreadyCompletedToday ? 'text-emerald-700' : 'text-amber-700'
            }`}
          >
            {alreadyCompletedToday
              ? 'Status: Selesai Hari Ini'
              : `Reward: +${challenge.poin} Poin · +${challenge.xp} XP`}
          </span>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">{challenge.judul}</h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            {challenge.pertanyaan}
          </p>
          {challenge.potonganKode && (
            <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
              <code>{challenge.potonganKode}</code>
            </pre>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {challenge.pilihanJawaban.map((opt, idx) => {
            const chosen = selectedIndex === idx;
            const right = idx === challenge.jawabanBenar;

            let cls =
              'bg-white border-slate-200 text-slate-800 hover:border-[#2563EB] hover:bg-blue-50/40';
            if (isAnswered) {
              if (right) cls = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold';
              else if (chosen) cls = 'bg-red-50 border-red-400 text-red-900 font-semibold';
              else cls = 'bg-slate-50 border-slate-200 text-slate-500 opacity-75';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswered}
                onClick={() => handleChoose(idx)}
                className={`text-left px-4 py-3.5 rounded-xl border text-sm transition-colors flex items-start gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${cls}`}
              >
                <span className="font-mono text-xs font-bold mt-0.5 shrink-0">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div
            role="status"
            className={`p-4 rounded-xl border text-sm space-y-1.5 ${
              isCorrect
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-red-50/70 border-red-200 text-red-950'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
              )}
              <span>
                {isCorrect
                  ? justClaimed
                    ? `Tepat! +${challenge.poin} Poin dan +${challenge.xp} XP diklaim.`
                    : 'Jawaban Benar — Tantangan hari ini sudah diklaim (+0 Poin tambahan).'
                  : 'Belum tepat. Pelajari penjelasannya lalu kamu bisa mencoba ulang.'}
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed pl-6">{challenge.penjelasan}</p>
            {!isCorrect && (
              <div className="pl-6 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Coba Jawab Lagi</span>
                </button>
              </div>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Total hari selesai oleh {profile.namaAlias}</span>
          <span className="font-mono font-semibold text-slate-900 tabular-nums">
            {gamifikasi.dailyCompletedDates.length} hari
          </span>
        </div>
      </div>
    </section>
  );
}
