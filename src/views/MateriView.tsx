import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Code2,
  Info,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { ByteCompanion } from '../components/ByteMascot';
import { ModuleIllustration } from '../components/ModuleIllustration';
import { ByteMood } from '../data/byteMascot';
import { KUIS_LIST } from '../data/kuis';
import { MATERI_LIST } from '../data/materi';
import { KategoriBahasa, Materi, TingkatKesulitan, UserAccount } from '../types';

interface MateriViewProps {
  user: UserAccount;
  initialCategory: KategoriBahasa | 'Semua';
  selectedMateriId: string | null;
  onSelectMateri: (id: string | null) => void;
  onRecordQuizAnswer: (params: {
    questionId: string;
    isCorrect: boolean;
    poin: number;
    xp: number;
  }) => { rewarded: boolean; alreadyClaimed: boolean };
  onCompleteMateri: (materiId: string, skor: number) => void;
}

const CATEGORIES: (KategoriBahasa | 'Semua')[] = ['Semua', 'Python', 'JavaScript', 'SQL'];
const LEVELS: (TingkatKesulitan | 'Semua')[] = ['Semua', 'Pemula', 'Menengah', 'Tantangan'];

export function MateriView({
  user,
  initialCategory,
  selectedMateriId,
  onSelectMateri,
  onRecordQuizAnswer,
  onCompleteMateri,
}: MateriViewProps) {
  const [categoryFilter, setCategoryFilter] = useState<KategoriBahasa | 'Semua'>(initialCategory);
  const [difficultyFilter, setDifficultyFilter] = useState<TingkatKesulitan | 'Semua'>('Semua');

  const selectedMateri = useMemo(
    () => MATERI_LIST.find((m) => m.id === selectedMateriId) ?? null,
    [selectedMateriId],
  );

  const filteredMateri = useMemo(() => {
    return MATERI_LIST.filter((m) => {
      if (categoryFilter !== 'Semua' && m.kategori !== categoryFilter) return false;
      if (difficultyFilter !== 'Semua' && m.tingkatKesulitan !== difficultyFilter) return false;
      return true;
    });
  }, [categoryFilter, difficultyFilter]);

  if (selectedMateri) {
    return (
      <MateriDetailWithQuiz
        key={selectedMateri.id}
        materi={selectedMateri}
        user={user}
        onBack={() => onSelectMateri(null)}
        onSelectNext={(nextId) => onSelectMateri(nextId)}
        onRecordQuizAnswer={onRecordQuizAnswer}
        onCompleteMateri={onCompleteMateri}
      />
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Materi &amp; Kuis Pembelajaran
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
            12 modul inti Python, JavaScript, dan SQL dengan ilustrasi lokal serta 24 soal kuis interaktif berpenjelasan konsep.
          </p>
        </div>
        <div className="text-sm text-slate-600 tabular-nums shrink-0">
          Selesai: <strong className="text-slate-900">{Object.keys(user.gamifikasi.materiSelesai).length} / {MATERI_LIST.length}</strong> modul
        </div>
      </div>

      {/* Filter Controls (Interactive Segmented Buttons) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filter kategori bahasa"
          className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl w-fit overflow-x-auto max-w-full"
        >
          {CATEGORIES.map((cat) => {
            const active = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={active}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                  active
                    ? 'bg-white text-[#1E3A8A] font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div
          role="group"
          aria-label="Filter tingkat kesulitan"
          className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl w-fit overflow-x-auto max-w-full"
        >
          {LEVELS.map((lvl) => {
            const active = difficultyFilter === lvl;
            return (
              <button
                key={lvl}
                type="button"
                aria-pressed={active}
                onClick={() => setDifficultyFilter(lvl)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                  active
                    ? 'bg-white text-slate-900 font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>

      {/* Module Grid */}
      {filteredMateri.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <p className="text-sm text-slate-600">
            Tidak ada materi yang cocok dengan kombinasi filter saat ini.
          </p>
          <button
            type="button"
            onClick={() => {
              setCategoryFilter('Semua');
              setDifficultyFilter('Semua');
            }}
            className="mt-3 px-4 py-2 text-xs font-semibold text-[#2563EB] bg-blue-50 hover:bg-blue-100 rounded-lg"
          >
            Tampilkan Semua Materi
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMateri.map((materi) => {
            const prog = user.gamifikasi.materiSelesai[materi.id];
            const isDone = Boolean(prog);

            return (
              <article
                key={materi.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="p-3 pb-0">
                    <ModuleIllustration materiId={materi.id} compact />
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                      <span>
                        {materi.kategori} · {materi.tingkatKesulitan} · {materi.estimasiMenit} mnt
                      </span>
                      {isDone && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Selesai</span>
                        </span>
                      )}
                    </div>
                    <h2 className="text-base font-bold text-slate-900">{materi.judul}</h2>
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                      {materi.deskripsi}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 font-mono tabular-nums">
                    {prog ? `Skor terbaik: ${prog.skor}%` : '2 soal kuis · +50 Poin'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectMateri(materi.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] whitespace-nowrap"
                  >
                    <span>{isDone ? 'Ulangi Latihan' : 'Pelajari'}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

interface MateriDetailProps {
  materi: Materi;
  user: UserAccount;
  onBack: () => void;
  onSelectNext: (nextId: string) => void;
  onRecordQuizAnswer: (params: {
    questionId: string;
    isCorrect: boolean;
    poin: number;
    xp: number;
  }) => { rewarded: boolean; alreadyClaimed: boolean };
  onCompleteMateri: (materiId: string, skor: number) => void;
}

function MateriDetailWithQuiz({
  materi,
  user,
  onBack,
  onSelectNext,
  onRecordQuizAnswer,
  onCompleteMateri,
}: MateriDetailProps) {
  const questions = useMemo(
    () => KUIS_LIST.filter((q) => q.materiId === materi.id),
    [materi.id],
  );

  // Track answers selected in the current viewing session
  const [answers, setAnswers] = useState<
    Record<string, { selectedIndex: number; isCorrect: boolean; practiceMode: boolean }>
  >({});
  const [byteMood, setByteMood] = useState<ByteMood>('idle');
  const [byteMessage, setByteMessage] = useState<string>(
    'Baca contoh kodenya dulu, lalu jawab 2 soal kuis di bawah untuk meraih poin dan XP!',
  );
  const [hintIndex, setHintIndex] = useState(0);

  const currentIdx = MATERI_LIST.findIndex((m) => m.id === materi.id);
  const nextMateri = currentIdx >= 0 && currentIdx < MATERI_LIST.length - 1 ? MATERI_LIST[currentIdx + 1] : null;
  const allAnswered = questions.every((q) => Boolean(answers[q.id]));
  const alreadyCompletedModule = Boolean(user.gamifikasi.materiSelesai[materi.id]);

  const handleRequestHint = () => {
    const tip = materi.poinPenting[hintIndex % materi.poinPenting.length];
    setHintIndex((prev) => prev + 1);
    setByteMood('hint');
    setByteMessage(`Petunjuk Byte: ${tip}`);
  };

  const handleSelectAnswer = (questionId: string, optionIdx: number) => {
    if (answers[questionId]) return;
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const isCorrect = optionIdx === question.jawabanBenar;
    const result = onRecordQuizAnswer({
      questionId: question.id,
      isCorrect,
      poin: question.poin,
      xp: question.xp,
    });

    const nextAnswers = {
      ...answers,
      [questionId]: {
        selectedIndex: optionIdx,
        isCorrect,
        practiceMode: result.alreadyClaimed,
      },
    };
    setAnswers(nextAnswers);

    const finishedAll = questions.every((q) => Boolean(nextAnswers[q.id]));
    if (finishedAll) {
      const correctCount = questions.filter((q) => nextAnswers[q.id]?.isCorrect).length;
      const skor = Math.round((correctCount / questions.length) * 100);
      if (correctCount > 0) {
        onCompleteMateri(materi.id, skor);
      }
      if (correctCount === questions.length) {
        setByteMood('celebrate');
        setByteMessage(
          `Mantap! Semua soal pada materi ${materi.judul} berhasil dijawab tepat (Skor ${skor}%).`,
        );
      } else if (isCorrect) {
        setByteMood('celebrate');
        setByteMessage(
          `Bagus! Materi selesai dengan skor ${skor}%. Kamu bisa ulangi kuis kapan saja sebagai latihan.`,
        );
      } else {
        setByteMood('encourage');
        setByteMessage('Hampir tepat! Cek lagi penjelasannya ya, lalu coba ulangi kuisnya.');
      }
    } else if (isCorrect) {
      setByteMood('celebrate');
      setByteMessage(
        result.alreadyClaimed
          ? 'Jawabanmu tepat! (Mode Latihan — poin soal ini sudah pernah diklaim).'
          : `Hebat! Jawabanmu benar (+${question.poin} Poin, +${question.xp} XP). Lanjut soal berikutnya!`,
      );
    } else {
      setByteMood('encourage');
      setByteMessage('Hampir tepat! Cek lagi penjelasannya ya.');
    }
  };

  const resetQuizPractice = () => {
    setAnswers({});
    setByteMood('idle');
    setByteMessage('Siap latihan ulang! Pilih jawaban yang paling sesuai dengan konsepnya.');
  };

  return (
    <article className="space-y-8">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-md"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Kembali ke Daftar Materi</span>
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-medium text-slate-500 flex flex-wrap items-center gap-2">
            <span>{materi.kategori}</span>
            <span aria-hidden="true">·</span>
            <span>{materi.tingkatKesulitan}</span>
            <span aria-hidden="true">·</span>
            <span>Estimasi {materi.estimasiMenit} menit</span>
            {alreadyCompletedModule && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-semibold">Sudah Selesai</span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {materi.judul}
          </h1>
          <p className="text-base text-slate-600 max-w-3xl leading-relaxed">{materi.deskripsi}</p>
        </div>

        {/* Local SVG Visual Diagram */}
        <div className="max-w-2xl">
          <ModuleIllustration materiId={materi.id} />
        </div>

        {/* Micro-learning Explanations */}
        <div className="space-y-3 max-w-3xl text-slate-700 text-sm sm:text-base leading-relaxed">
          {materi.ringkasanParagraf.map((paragraf, idx) => (
            <p key={idx}>{paragraf}</p>
          ))}
        </div>

        {/* Key Takeaways */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 max-w-3xl">
          <h2 className="text-sm font-bold text-slate-900 mb-2.5">Poin Penting yang Perlu Diingat</h2>
          <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5">
            {materi.poinPenting.map((poin, idx) => (
              <li key={idx} className="leading-relaxed">
                {poin}
              </li>
            ))}
          </ul>
        </div>

        {/* Code Example + Simulated Output */}
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Code2 className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
            <span>Contoh Kode: {materi.contohKode.judul}</span>
          </div>
          <div className="bg-slate-900 text-slate-100 rounded-xl overflow-hidden">
            <div className="px-4 py-2 border-b border-slate-800 text-xs font-mono text-slate-400">
              {materi.contohKode.bahasa}
            </div>
            <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed text-slate-100">
              <code>{materi.contohKode.kode}</code>
            </pre>
            <div className="px-4 py-3 bg-slate-950 border-t border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 mb-1">Output:</div>
              <pre className="text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                <code>{materi.contohKode.output}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Quiz Section with Anti-Farming */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Kuis Pemahaman Konsep</h2>
            <p className="text-sm text-slate-600 mt-0.5">
              Jawab semua soal untuk menyelesaikan materi ini. Setiap jawaban langsung menampilkan pembahasan ilmiahnya.
            </p>
          </div>
          {allAnswered && (
            <button
              type="button"
              onClick={resetQuizPractice}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Ulangi Kuis (Mode Latihan)</span>
            </button>
          )}
        </div>

        {/* Mini Byte Companion reacting to quiz answers & hints */}
        <ByteCompanion
          level={user.gamifikasi.level}
          mood={byteMood}
          message={byteMessage}
          actionLabel="Petunjuk Byte"
          onAction={handleRequestHint}
        />

        <div className="space-y-6">
          {questions.map((q, qIndex) => {
            const answerState = answers[q.id];
            const isAlreadyClaimedBefore =
              user.gamifikasi.claimedQuestions.includes(q.id) && !answerState;

            return (
              <div key={q.id} className="space-y-3 pb-6 border-b border-slate-100 last:border-b-0 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Soal {qIndex + 1} dari {questions.length}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {isAlreadyClaimedBefore || answerState?.practiceMode
                      ? 'Mode Latihan · +0 Poin / +0 XP (sudah diklaim)'
                      : `Reward: +${q.poin} Poin · +${q.xp} XP`}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{q.pertanyaan}</h3>

                {q.potonganKode && (
                  <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto">
                    <code>{q.potonganKode}</code>
                  </pre>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.pilihanJawaban.map((opt, optIdx) => {
                    const isSelected = answerState?.selectedIndex === optIdx;
                    const isRightOption = optIdx === q.jawabanBenar;

                    let buttonStyle =
                      'bg-white border-slate-200 text-slate-800 hover:border-[#2563EB] hover:bg-blue-50/40';
                    if (answerState) {
                      if (isRightOption) {
                        buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold';
                      } else if (isSelected && !isRightOption) {
                        buttonStyle = 'bg-red-50 border-red-400 text-red-900 font-semibold';
                      } else {
                        buttonStyle = 'bg-slate-50 border-slate-200 text-slate-500 opacity-75';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={Boolean(answerState)}
                        onClick={() => handleSelectAnswer(q.id, optIdx)}
                        className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors flex items-start gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${buttonStyle}`}
                      >
                        <span className="font-mono text-xs font-bold mt-0.5 shrink-0">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Immediate Conceptual Explanation */}
                {answerState && (
                  <div
                    role="status"
                    className={`p-4 rounded-xl border text-sm space-y-1 ${
                      answerState.isCorrect
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-red-50/70 border-red-200 text-red-950'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold">
                      {answerState.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0" aria-hidden="true" />
                      )}
                      <span>
                        {answerState.isCorrect
                          ? answerState.practiceMode
                            ? 'Jawaban Benar — Mode Latihan (+0 Poin / +0 XP)'
                            : `Jawaban Benar (+${q.poin} Poin, +${q.xp} XP)`
                          : 'Jawaban Belum Tepat'}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed pl-6">{q.penjelasan}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Anti-farming notice & Next Module CTA */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-2 text-xs text-slate-500 max-w-lg">
            <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" aria-hidden="true" />
            <span>
              Proteksi Anti-Farming aktif: Poin dan XP dari setiap soal hanya diberikan 1 kali. Pengulangan tetap dibuka kapan saja sebagai Mode Latihan.
            </span>
          </div>
          {nextMateri && (
            <button
              type="button"
              onClick={() => onSelectNext(nextMateri.id)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-colors whitespace-nowrap shrink-0"
            >
              <span>Materi Berikutnya: {nextMateri.judul}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
