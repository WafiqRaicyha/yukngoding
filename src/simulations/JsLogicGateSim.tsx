import { CheckCircle2, Circle, KeyRound, Lock, LockOpen } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ByteCompanion } from '../components/ByteMascot';
import { ByteMood } from '../data/byteMascot';
import { SimulasiId } from '../types';

interface JsLogicGateSimProps {
  playerLevel: number;
  isCompleted: boolean;
  onComplete: (simId: SimulasiId, title: string) => void;
}

export function JsLogicGateSim({ playerLevel, isCompleted, onComplete }: JsLogicGateSimProps) {
  const [skor, setSkor] = useState(60);
  const [punyaKunci, setPunyaKunci] = useState(false);
  const [energi, setEnergi] = useState(40);
  const [solvedMissions, setSolvedMissions] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const rewardedRef = useRef(false);

  const condSkor = skor >= 80;
  const condKunci = punyaKunci === true;
  const condOr = condSkor || condKunci;
  const condEnergi = energi >= 50;
  const finalOpen = condOr && condEnergi;

  // Evaluate 3 structured logic missions live
  const mission1Match = !punyaKunci && condSkor && condEnergi && finalOpen;
  const mission2Match = punyaKunci && !condSkor && condEnergi && finalOpen;
  const mission3Match = condSkor && punyaKunci && !condEnergi && !finalOpen;

  useEffect(() => {
    setSolvedMissions((prev) => {
      const next = new Set(prev);
      if (mission1Match) next.add('m1');
      if (mission2Match) next.add('m2');
      if (mission3Match) next.add('m3');
      if (next.size === prev.length) return prev;
      return Array.from(next);
    });
  }, [mission1Match, mission2Match, mission3Match]);

  useEffect(() => {
    if (solvedMissions.length === 3 && !rewardedRef.current) {
      rewardedRef.current = true;
      onComplete('sim-js', 'Gerbang Logika & Kastil Web');
    }
  }, [solvedMissions.length, onComplete]);

  const missions = [
    {
      id: 'm1',
      title: 'Misi 1: Jalur Prestasi (Tanpa Kunci)',
      detail: 'Buka gerbang (TRUE) dengan punyaKunci = false, skor ≥ 80, dan energi ≥ 50.',
    },
    {
      id: 'm2',
      title: 'Misi 2: Jalur Darurat (Pakai Kunci)',
      detail: 'Buka gerbang (TRUE) menggunakan punyaKunci = true meskipun skor < 80, dengan energi ≥ 50.',
    },
    {
      id: 'm3',
      title: 'Misi 3: Uji Pengaman Energi',
      detail: 'Pastikan gerbang tetap TERKUNCI (FALSE) meski skor ≥ 80 dan punyaKunci = true dengan menurunkan energi < 50.',
    },
  ];

  const wireColor = (val: boolean) => (val ? '#10B981' : '#94A3B8');
  const boxStroke = (val: boolean) => (val ? '#10B981' : '#CBD5E1');
  const boxFill = (val: boolean) => (val ? '#ECFDF5' : '#F8FAFC');
  const textFill = (val: boolean) => (val ? '#047857' : '#475569');

  const byteMood: ByteMood = showHint
    ? 'hint'
    : solvedMissions.length === 3 || mission1Match || mission2Match || mission3Match
      ? 'celebrate'
      : !finalOpen && condOr && !condEnergi && solvedMissions.includes('m3')
        ? 'encourage'
        : 'idle';

  const byteMessage = showHint
    ? 'Petunjuk Byte: Gerbang AND (&&) mewajibkan sisi kiri (skor >= 80 ATAU punyaKunci) DAN sisi kanan (energi >= 50) keduanya TRUE.'
    : solvedMissions.length === 3
      ? 'Hebat sekali! Ketiga misi gerbang logika JavaScript berhasil kamu taklukkan!'
      : mission1Match
        ? 'Misi 1 tercapai! Gerbang terbuka lewat jalur skor tinggi tanpa kunci.'
        : mission2Match
          ? 'Misi 2 tercapai! Operator OR (||) membuka jalur darurat saat punyaKunci bernilai true.'
          : mission3Match
            ? 'Misi 3 tercapai! Operator AND (&&) menahan gerbang tetap terkunci ketika energi < 50.'
            : 'Geser slider skor/energi dan tombol punyaKunci untuk melihat perubahan jalur SVG secara langsung!';

  return (
    <div className="space-y-5">
      <ByteCompanion
        level={playerLevel}
        mood={byteMood}
        message={byteMessage}
        actionLabel={showHint ? 'Tutup Petunjuk' : 'Petunjuk Byte'}
        onAction={() => setShowHint((prev) => !prev)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left 60% Interactive Dynamic SVG Flowchart */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Gerbang Logika &amp; Kastil Web (JavaScript)</h3>
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
              Misi selesai {solvedMissions.length}/3 · Status:{' '}
              <span className={isCompleted ? 'text-emerald-700 font-semibold' : 'text-slate-700 font-medium'}>
                {isCompleted ? 'Sudah Selesai' : 'Reward +50 Poin / +40 XP'}
              </span>
            </p>
          </div>
          <div
            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
              finalOpen ? 'text-emerald-700' : 'text-slate-600'
            }`}
          >
            {finalOpen ? (
              <LockOpen className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            ) : (
              <Lock className="w-4 h-4 text-slate-500" aria-hidden="true" />
            )}
            <span>{finalOpen ? 'GERBANG TERBUKA (TRUE)' : 'GERBANG TERKUNCI (FALSE)'}</span>
          </div>
        </div>

        {/* Dynamic Interactive SVG Flowchart */}
        <div className="mt-5 w-full overflow-x-auto">
          <svg
            viewBox="0 0 620 270"
            className="w-full min-w-[460px] h-auto"
            role="img"
            aria-label={`Diagram gerbang logika JavaScript. Hasil akhir: ${finalOpen ? 'TRUE gerbang terbuka' : 'FALSE gerbang terkunci'}`}
          >
            <rect width="620" height="270" rx="14" fill="#F8FAFC" />

            {/* Signal Wires */}
            <path d="M168 50 H218 V86 H244" fill="none" stroke={wireColor(condSkor)} strokeWidth="3" />
            <path d="M168 130 H218 V104 H244" fill="none" stroke={wireColor(condKunci)} strokeWidth="3" />
            <path d="M324 95 H362 V146 H386" fill="none" stroke={wireColor(condOr)} strokeWidth="3" />
            <path d="M168 214 H362 V164 H386" fill="none" stroke={wireColor(condEnergi)} strokeWidth="3" />
            <path d="M466 155 H502" fill="none" stroke={wireColor(finalOpen)} strokeWidth="3.5" />

            {/* Input Condition 1: skor >= 80 */}
            <rect x="20" y="24" width="148" height="52" rx="10" fill={boxFill(condSkor)} stroke={boxStroke(condSkor)} strokeWidth="2" />
            <text x="94" y="46" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="700" fontFamily="monospace">
              skor &gt;= 80
            </text>
            <text x="94" y="64" textAnchor="middle" fill={textFill(condSkor)} fontSize="11" fontWeight="700" fontFamily="monospace">
              {skor} → {condSkor ? 'TRUE' : 'FALSE'}
            </text>

            {/* Input Condition 2: punyaKunci === true */}
            <rect x="20" y="104" width="148" height="52" rx="10" fill={boxFill(condKunci)} stroke={boxStroke(condKunci)} strokeWidth="2" />
            <text x="94" y="126" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="700" fontFamily="monospace">
              punyaKunci
            </text>
            <text x="94" y="144" textAnchor="middle" fill={textFill(condKunci)} fontSize="11" fontWeight="700" fontFamily="monospace">
              {String(punyaKunci)} → {condKunci ? 'TRUE' : 'FALSE'}
            </text>

            {/* Input Condition 3: energi >= 50 */}
            <rect x="20" y="188" width="148" height="52" rx="10" fill={boxFill(condEnergi)} stroke={boxStroke(condEnergi)} strokeWidth="2" />
            <text x="94" y="210" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="700" fontFamily="monospace">
              energi &gt;= 50
            </text>
            <text x="94" y="228" textAnchor="middle" fill={textFill(condEnergi)} fontSize="11" fontWeight="700" fontFamily="monospace">
              {energi} → {condEnergi ? 'TRUE' : 'FALSE'}
            </text>

            {/* Gate 1: OR (||) */}
            <rect x="244" y="69" width="80" height="52" rx="10" fill={condOr ? '#7C3AED' : '#FFFFFF'} stroke={condOr ? '#7C3AED' : '#94A3B8'} strokeWidth="2" />
            <text x="284" y="92" textAnchor="middle" fill={condOr ? '#FFFFFF' : '#0F172A'} fontSize="13" fontWeight="800" fontFamily="monospace">
              OR ||
            </text>
            <text x="284" y="110" textAnchor="middle" fill={condOr ? '#EDE9FE' : '#64748B'} fontSize="10" fontWeight="700" fontFamily="monospace">
              {condOr ? 'TRUE' : 'FALSE'}
            </text>

            {/* Gate 2: AND (&&) */}
            <rect x="386" y="129" width="80" height="52" rx="10" fill={finalOpen ? '#2563EB' : '#FFFFFF'} stroke={finalOpen ? '#2563EB' : '#94A3B8'} strokeWidth="2" />
            <text x="426" y="152" textAnchor="middle" fill={finalOpen ? '#FFFFFF' : '#0F172A'} fontSize="13" fontWeight="800" fontFamily="monospace">
              AND &amp;&amp;
            </text>
            <text x="426" y="170" textAnchor="middle" fill={finalOpen ? '#DBEAFE' : '#64748B'} fontSize="10" fontWeight="700" fontFamily="monospace">
              {finalOpen ? 'TRUE' : 'FALSE'}
            </text>

            {/* Castle Gate Node */}
            <g transform="translate(502, 95)">
              <rect
                width="98"
                height="120"
                rx="12"
                fill={finalOpen ? '#ECFDF5' : '#F1F5F9'}
                stroke={finalOpen ? '#10B981' : '#94A3B8'}
                strokeWidth="2.5"
              />
              {/* Battlements */}
              <rect x="14" y="14" width="16" height="12" rx="2" fill={finalOpen ? '#10B981' : '#64748B'} />
              <rect x="41" y="14" width="16" height="12" rx="2" fill={finalOpen ? '#10B981' : '#64748B'} />
              <rect x="68" y="14" width="16" height="12" rx="2" fill={finalOpen ? '#10B981' : '#64748B'} />
              {/* Archway */}
              <path
                d="M28 84 V52 A21 21 0 0 1 70 52 V84 Z"
                fill={finalOpen ? '#FFFFFF' : '#475569'}
                stroke={finalOpen ? '#059669' : '#334155'}
                strokeWidth="2"
              />
              {!finalOpen && (
                <>
                  <line x1="42" y1="36" x2="42" y2="84" stroke="#94A3B8" strokeWidth="2" />
                  <line x1="56" y1="36" x2="56" y2="84" stroke="#94A3B8" strokeWidth="2" />
                </>
              )}
              <text
                x="49"
                y="105"
                textAnchor="middle"
                fill={finalOpen ? '#047857' : '#334155'}
                fontSize="10"
                fontWeight="800"
                fontFamily="monospace"
              >
                {finalOpen ? 'TERBUKA' : 'TERKUNCI'}
              </text>
            </g>
          </svg>
        </div>

        {/* Live JavaScript Expression Evaluation */}
        <div className="mt-4 bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs sm:text-sm overflow-x-auto">
          <div className="text-slate-400 text-[11px] mb-1.5">Ekspresi JavaScript yang dievaluasi langsung:</div>
          <code>
            <span className="text-violet-300">if</span> ( (
            <span className={condSkor ? 'text-emerald-400 font-semibold' : 'text-red-300'}>
              skor &gt;= 80
            </span>{' '}
            ||{' '}
            <span className={condKunci ? 'text-emerald-400 font-semibold' : 'text-red-300'}>
              punyaKunci === true
            </span>
            ) &amp;&amp;{' '}
            <span className={condEnergi ? 'text-emerald-400 font-semibold' : 'text-red-300'}>
              energi &gt;= 50
            </span>{' '}
            ) <span className="text-slate-400">// Hasil: {String(finalOpen)}</span>
          </code>
        </div>
      </div>

      {/* Right 40% Variable Controls & 3 Logic Missions */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900">1. Atur Variabel Input</h4>

          {/* Slider: skor */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label htmlFor="sim-skor" className="font-mono font-semibold text-slate-800">
                skor (0–100)
              </label>
              <span className="font-mono font-bold text-[#2563EB] tabular-nums">{skor}</span>
            </div>
            <input
              id="sim-skor"
              type="range"
              min={0}
              max={100}
              value={skor}
              onChange={(e) => setSkor(Number(e.target.value))}
              className="w-full accent-[#2563EB]"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-0.5">
              <span>0</span>
              <span>Batas: 80</span>
              <span>100</span>
            </div>
          </div>

          {/* Toggle: punyaKunci */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="block font-mono text-xs font-semibold text-slate-800">punyaKunci</span>
              <span className="text-xs text-slate-500">Nilai boolean: {String(punyaKunci)}</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={punyaKunci}
              onClick={() => setPunyaKunci((prev) => !prev)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                punyaKunci
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="font-mono">{punyaKunci ? 'true' : 'false'}</span>
            </button>
          </div>

          {/* Slider: energi */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label htmlFor="sim-energi" className="font-mono font-semibold text-slate-800">
                energi (0–100)
              </label>
              <span className="font-mono font-bold text-[#7C3AED] tabular-nums">{energi}</span>
            </div>
            <input
              id="sim-energi"
              type="range"
              min={0}
              max={100}
              value={energi}
              onChange={(e) => setEnergi(Number(e.target.value))}
              className="w-full accent-[#7C3AED]"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-0.5">
              <span>0</span>
              <span>Batas: 50</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* 3 Logic Missions */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 mb-3">
            2. Selesaikan 3 Misi Logika (<span className="tabular-nums">{solvedMissions.length}/3</span>)
          </h4>
          <div className="space-y-2.5">
            {missions.map((m) => {
              const done = solvedMissions.includes(m.id);
              return (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl border text-xs transition-colors ${
                    done ? 'bg-emerald-50/80 border-emerald-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" aria-hidden="true" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" aria-hidden="true" />
                    )}
                    <div>
                      <p className={`font-semibold ${done ? 'text-emerald-900' : 'text-slate-900'}`}>
                        {m.title}
                      </p>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">{m.detail}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
