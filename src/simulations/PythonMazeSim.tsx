import {
  CheckCircle2,
  CornerUpLeft,
  CornerUpRight,
  HelpCircle,
  Play,
  Repeat,
  RotateCcw,
  StepForward,
  Trash2,
  Undo2,
  ArrowUp,
  XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ByteCompanion } from '../components/ByteMascot';
import { ByteMood } from '../data/byteMascot';
import { SimulasiId } from '../types';

interface PythonMazeSimProps {
  playerLevel: number;
  isCompleted: boolean;
  onComplete: (simId: SimulasiId, title: string) => void;
}

type Direction = 'N' | 'E' | 'S' | 'W';
type CommandType = 'maju' | 'belok_kiri' | 'belok_kanan' | 'ulang_2x_maju';

interface QueueItem {
  id: string;
  cmd: CommandType;
}

interface RobotState {
  row: number;
  col: number;
  dir: Direction;
  collectedCoins: string[];
  status: 'idle' | 'running' | 'won' | 'failed';
  message: string;
}

const GRID_SIZE = 5;
const START_POS = { row: 4, col: 0, dir: 'E' as Direction };
const FINISH_POS = { row: 0, col: 4 };
const WALLS = new Set(['3,0', '3,1', '3,3', '2,4', '1,1', '1,3']);
const COINS = ['4,2', '2,2', '0,2'];

const COMMAND_META: Record<CommandType, { label: string; code: string; steps: ('maju' | 'kiri' | 'kanan')[] }> = {
  maju: { label: 'Maju', code: 'maju()', steps: ['maju'] },
  belok_kiri: { label: 'Belok Kiri', code: 'belok_kiri()', steps: ['kiri'] },
  belok_kanan: { label: 'Belok Kanan', code: 'belok_kanan()', steps: ['kanan'] },
  ulang_2x_maju: { label: 'Ulang 2x Maju', code: 'for _ in range(2): maju()', steps: ['maju', 'maju'] },
};

function turnLeft(dir: Direction): Direction {
  const order: Direction[] = ['N', 'W', 'S', 'E'];
  return order[(order.indexOf(dir) + 1) % 4];
}

function turnRight(dir: Direction): Direction {
  const order: Direction[] = ['N', 'E', 'S', 'W'];
  return order[(order.indexOf(dir) + 1) % 4];
}

function stepForward(row: number, col: number, dir: Direction): { row: number; col: number } {
  if (dir === 'N') return { row: row - 1, col };
  if (dir === 'S') return { row: row + 1, col };
  if (dir === 'E') return { row, col: col + 1 };
  return { row, col: col - 1 };
}

function createInitialRobot(): RobotState {
  return {
    row: START_POS.row,
    col: START_POS.col,
    dir: START_POS.dir,
    collectedCoins: [],
    status: 'idle',
    message: 'Susun perintah Python untuk mengambil semua 3 koin lalu berhenti tepat di bendera finis.',
  };
}

export function PythonMazeSim({ playerLevel, isCompleted, onComplete }: PythonMazeSimProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<number | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [robot, setRobot] = useState<RobotState>(createInitialRobot);
  const [activeQueueIndex, setActiveQueueIndex] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);

  const byteMood: ByteMood = showHint
    ? 'hint'
    : robot.status === 'won'
      ? 'celebrate'
      : robot.status === 'failed'
        ? 'encourage'
        : 'idle';

  const byteMessage = showHint
    ? 'Petunjuk Byte: Mulai dengan ulang_2x(maju()) untuk koin pertama, lalu belok_kiri(), maju 4 langkah ke atas, belok_kanan(), lalu ulang_2x(maju())!'
    : robot.status === 'won'
      ? 'Luar biasa! Algoritma Python-mu membawa robot mengambil semua koin dan tiba di finis!'
      : robot.status === 'failed'
        ? 'Hampir berhasil! Cek posisi dinding di koordinat papan lalu sesuaikan urutan perintahnya.'
        : robot.status === 'running'
          ? 'Robot sedang mengeksekusi antrean kode Python-mu langkah demi langkah...'
          : 'Ayo susun blok perintah Python di kanan, lalu tekan Jalankan Kode!';

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => stopTimer(), [stopTimer]);

  // Render 5x5 HTML5 Canvas Maze
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 400;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const pad = 24;
    const boardSize = size - pad * 2;
    const cell = boardSize / GRID_SIZE;

    // Background
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, size, size);

    // Axis coordinates
    ctx.fillStyle = '#64748B';
    ctx.font = '600 11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < GRID_SIZE; i++) {
      ctx.fillText(String(i), pad + i * cell + cell / 2, 12);
      ctx.fillText(String(i), 12, pad + i * cell + cell / 2);
    }

    // Draw grid cells
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const x = pad + c * cell;
        const y = pad + r * cell;
        const key = `${r},${c}`;

        if (WALLS.has(key)) {
          ctx.fillStyle = '#1E293B';
          ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4);
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(x + 10, y + 10);
          ctx.lineTo(x + cell - 10, y + cell - 10);
          ctx.moveTo(x + cell - 10, y + 10);
          ctx.lineTo(x + 10, y + cell - 10);
          ctx.stroke();
        } else {
          ctx.fillStyle = r === FINISH_POS.row && c === FINISH_POS.col ? '#ECFDF5' : '#FFFFFF';
          ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
        }

        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cell, cell);
      }
    }

    // Draw Finish Flag
    const fx = pad + FINISH_POS.col * cell;
    const fy = pad + FINISH_POS.row * cell;
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fx + cell * 0.34, fy + cell * 0.78);
    ctx.lineTo(fx + cell * 0.34, fy + cell * 0.22);
    ctx.stroke();
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.moveTo(fx + cell * 0.34, fy + cell * 0.22);
    ctx.lineTo(fx + cell * 0.74, fy + cell * 0.35);
    ctx.lineTo(fx + cell * 0.34, fy + cell * 0.5);
    ctx.closePath();
    ctx.fill();

    // Draw uncollected coins
    for (const coinKey of COINS) {
      if (robot.collectedCoins.includes(coinKey)) continue;
      const [cr, cc] = coinKey.split(',').map(Number);
      const cx = pad + cc * cell + cell / 2;
      const cy = pad + cr * cell + cell / 2;

      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(cx, cy, cell * 0.21, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#FEF3C7';
      ctx.font = '700 12px JetBrains Mono, monospace';
      ctx.fillText('$', cx, cy + 0.5);
    }

    // Draw Robot
    const rx = pad + robot.col * cell + cell / 2;
    const ry = pad + robot.row * cell + cell / 2;
    const radius = cell * 0.31;

    ctx.fillStyle = robot.status === 'failed' ? '#DC2626' : robot.status === 'won' ? '#059669' : '#2563EB';
    ctx.beginPath();
    ctx.roundRect(rx - radius, ry - radius, radius * 2, radius * 2, 8);
    ctx.fill();

    // Direction triangle indicator inside robot
    ctx.save();
    ctx.translate(rx, ry);
    const angle =
      robot.dir === 'E' ? 0 : robot.dir === 'S' ? Math.PI / 2 : robot.dir === 'W' ? Math.PI : -Math.PI / 2;
    ctx.rotate(angle);
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(radius * 0.52, 0);
    ctx.lineTo(-radius * 0.36, -radius * 0.42);
    ctx.lineTo(-radius * 0.36, radius * 0.42);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }, [robot]);

  const addCommand = (cmd: CommandType) => {
    if (robot.status === 'running' || queue.length >= 16) return;
    setQueue((prev) => [...prev, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, cmd }]);
  };

  const resetBoardOnly = useCallback(() => {
    stopTimer();
    setActiveQueueIndex(null);
    setRobot(createInitialRobot());
  }, [stopTimer]);

  const clearAll = () => {
    stopTimer();
    setActiveQueueIndex(null);
    setQueue([]);
    setRobot(createInitialRobot());
  };

  const runQueue = (singleStepMode = false) => {
    if (queue.length === 0) {
      setRobot((prev) => ({
        ...prev,
        status: 'failed',
        message: 'Antrean perintah masih kosong. Tambahkan perintah maju() atau belok terlebih dahulu.',
      }));
      return;
    }

    stopTimer();

    // Flatten queue into atomic steps linked to queue index
    const expanded: { queueIdx: number; action: 'maju' | 'kiri' | 'kanan' }[] = [];
    queue.forEach((item, idx) => {
      for (const s of COMMAND_META[item.cmd].steps) {
        expanded.push({ queueIdx: idx, action: s });
      }
    });

    if (singleStepMode) {
      // Execute next single command block from current robot position if idle/running, or restart if won/failed
      const startFrom = robot.status === 'won' || robot.status === 'failed' ? createInitialRobot() : robot;
      const nextQIdx =
        robot.status === 'won' || robot.status === 'failed' || activeQueueIndex === null
          ? 0
          : activeQueueIndex + 1;

      if (nextQIdx >= queue.length) {
        evaluateFinish(startFrom);
        return;
      }

      const item = queue[nextQIdx];
      let current = { ...startFrom, status: 'running' as RobotState['status'] };
      for (const act of COMMAND_META[item.cmd].steps) {
        const res = applyAtomicStep(current, act);
        current = res;
        if (current.status === 'failed') break;
      }

      setActiveQueueIndex(nextQIdx);
      if (current.status === 'failed') {
        setRobot(current);
      } else if (nextQIdx === queue.length - 1) {
        evaluateFinish(current);
      } else {
        setRobot({ ...current, message: `Menjalankan baris ${nextQIdx + 1}: ${COMMAND_META[item.cmd].code}` });
      }
      return;
    }

    // Full animated execution
    let current = createInitialRobot();
    current.status = 'running';
    current.message = 'Robot sedang menjalankan kode Python...';
    setRobot({ ...current });

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stepDelay = prefersReduced ? 60 : 280;

    let stepPointer = 0;

    const tick = () => {
      if (stepPointer >= expanded.length) {
        evaluateFinish(current);
        return;
      }
      const { queueIdx, action } = expanded[stepPointer];
      setActiveQueueIndex(queueIdx);
      current = applyAtomicStep(current, action);
      setRobot({ ...current });

      if (current.status === 'failed') {
        stopTimer();
        return;
      }

      stepPointer += 1;
      timerRef.current = window.setTimeout(tick, stepDelay);
    };

    timerRef.current = window.setTimeout(tick, stepDelay);
  };

  const applyAtomicStep = (state: RobotState, action: 'maju' | 'kiri' | 'kanan'): RobotState => {
    if (action === 'kiri') {
      return { ...state, dir: turnLeft(state.dir), message: 'Robot berbelok ke kiri.' };
    }
    if (action === 'kanan') {
      return { ...state, dir: turnRight(state.dir), message: 'Robot berbelok ke kanan.' };
    }

    const nextPos = stepForward(state.row, state.col, state.dir);
    if (
      nextPos.row < 0 ||
      nextPos.row >= GRID_SIZE ||
      nextPos.col < 0 ||
      nextPos.col >= GRID_SIZE
    ) {
      return {
        ...state,
        status: 'failed',
        message: 'Robot keluar dari batas papan 5x5! Cek kembali urutan belokan dan jumlah langkah maju.',
      };
    }

    const key = `${nextPos.row},${nextPos.col}`;
    if (WALLS.has(key)) {
      return {
        ...state,
        status: 'failed',
        message: `Robot menabrak dinding di koordinat (${nextPos.row}, ${nextPos.col}). Perbaiki jalurmu.`,
      };
    }

    const nextCoins =
      COINS.includes(key) && !state.collectedCoins.includes(key)
        ? [...state.collectedCoins, key]
        : state.collectedCoins;

    return {
      ...state,
      row: nextPos.row,
      col: nextPos.col,
      collectedCoins: nextCoins,
      message:
        nextCoins.length > state.collectedCoins.length
          ? `Koin emas terkumpul (${nextCoins.length}/${COINS.length})!`
          : `Robot bergerak ke (${nextPos.row}, ${nextPos.col}).`,
    };
  };

  const evaluateFinish = (finalState: RobotState) => {
    const atFinish = finalState.row === FINISH_POS.row && finalState.col === FINISH_POS.col;
    const allCoins = finalState.collectedCoins.length === COINS.length;

    if (atFinish && allCoins) {
      setRobot({
        ...finalState,
        status: 'won',
        message: 'Berhasil! Seluruh 3 koin terkumpul dan robot berhenti tepat di bendera finis.',
      });
      onComplete('sim-python', 'Labirin Robot Algoritma');
    } else if (atFinish && !allCoins) {
      setRobot({
        ...finalState,
        status: 'failed',
        message: `Robot sampai di finis, tetapi koin baru terkumpul ${finalState.collectedCoins.length}/${COINS.length}.`,
      });
    } else {
      setRobot({
        ...finalState,
        status: 'failed',
        message: `Kode selesai dijalankan, namun robot berhenti di (${finalState.row}, ${finalState.col}) dan belum mencapai bendera finis (0, 4).`,
      });
    }
  };

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
      {/* Left 60% Interactive Canvas Stage */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Labirin Robot Algoritma (Python)</h3>
            <p className="text-xs text-slate-500 mt-0.5 tabular-nums">
              Papan 5×5 · Koin {robot.collectedCoins.length}/{COINS.length} · Status:{' '}
              <span className={isCompleted ? 'text-emerald-700 font-semibold' : 'text-slate-700 font-medium'}>
                {isCompleted ? 'Sudah Selesai' : 'Reward +50 Poin / +40 XP'}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowHint((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{showHint ? 'Tutup Petunjuk' : 'Petunjuk'}</span>
          </button>
        </div>

        {showHint && (
          <div className="mt-4 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 leading-relaxed">
            <strong>Strategi Algoritma:</strong> Mulai dari (4, 0) menghadap kanan. Coba{' '}
            <code className="font-mono text-[#1E3A8A]">ulang_2x(maju())</code> untuk koin pertama, lalu{' '}
            <code className="font-mono text-[#1E3A8A]">belok_kiri()</code>, kemudian naik 4 langkah lurus ke atas, lalu{' '}
            <code className="font-mono text-[#1E3A8A]">belok_kanan()</code> dan maju 2 langkah menuju bendera.
          </div>
        )}

        <div className="mt-5 flex justify-center">
          <div className="w-full max-w-[400px] aspect-square border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            <canvas
              ref={canvasRef}
              className="w-full h-full block"
              aria-label="Papan simulasi labirin robot 5 kali 5"
            />
          </div>
        </div>

        {/* Status feedback bar (icon + explicit text, never hue-only) */}
        <div
          role="status"
          aria-live="polite"
          className={`mt-4 p-3.5 rounded-xl border text-sm flex items-start gap-2.5 ${
            robot.status === 'won'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : robot.status === 'failed'
                ? 'bg-red-50 border-red-200 text-red-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          {robot.status === 'won' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" aria-hidden="true" />
          ) : robot.status === 'failed' ? (
            <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" aria-hidden="true" />
          ) : null}
          <span>{robot.message}</span>
        </div>
      </div>

      {/* Right 40% Command Builder & Execution Deck */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
        <div>
          <h4 className="text-sm font-bold text-slate-900">1. Susun Blok Perintah Python</h4>
          <p className="text-xs text-slate-500 mt-1">
            Klik blok di bawah untuk menambah instruksi ke antrean (maks. 16 baris).
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => addCommand('maju')}
              disabled={robot.status === 'running'}
              className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-900 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              <ArrowUp className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
              <span className="font-mono">maju()</span>
            </button>
            <button
              type="button"
              onClick={() => addCommand('belok_kiri')}
              disabled={robot.status === 'running'}
              className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-900 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              <CornerUpLeft className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
              <span className="font-mono">belok_kiri()</span>
            </button>
            <button
              type="button"
              onClick={() => addCommand('belok_kanan')}
              disabled={robot.status === 'running'}
              className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-900 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              <CornerUpRight className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
              <span className="font-mono">belok_kanan()</span>
            </button>
            <button
              type="button"
              onClick={() => addCommand('ulang_2x_maju')}
              disabled={robot.status === 'running'}
              className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-violet-950 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
            >
              <Repeat className="w-4 h-4 text-[#7C3AED]" aria-hidden="true" />
              <span className="font-mono">ulang_2x(maju())</span>
            </button>
          </div>
        </div>

        {/* Live Python Queue */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-slate-900">
              2. Antrean Kode (<span className="tabular-nums">{queue.length}/16</span>)
            </h4>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setQueue((prev) => prev.slice(0, -1))}
                disabled={queue.length === 0 || robot.status === 'running'}
                aria-label="Hapus perintah terakhir"
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 rounded-lg transition-colors"
              >
                <Undo2 className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={clearAll}
                disabled={queue.length === 0 || robot.status === 'running'}
                aria-label="Kosongkan semua perintah"
                className="p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-40 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="bg-slate-900 text-slate-100 rounded-xl p-3.5 min-h-[168px] max-h-[220px] overflow-y-auto font-mono text-xs space-y-1">
            {queue.length === 0 ? (
              <p className="text-slate-400 italic"># Belum ada perintah. Klik blok di atas.</p>
            ) : (
              queue.map((item, index) => {
                const isRunningLine = activeQueueIndex === index;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-2.5 px-2 py-1 rounded ${
                      isRunningLine ? 'bg-blue-600/40 text-white font-semibold' : 'text-slate-200'
                    }`}
                  >
                    <span className="text-slate-500 w-5 text-right tabular-nums select-none">
                      {index + 1}
                    </span>
                    <span>{COMMAND_META[item.cmd].code}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => runQueue(false)}
            disabled={robot.status === 'running'}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 whitespace-nowrap"
          >
            <Play className="w-4 h-4" aria-hidden="true" />
            <span>Jalankan Kode</span>
          </button>
          <button
            type="button"
            onClick={() => runQueue(true)}
            disabled={robot.status === 'running'}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] whitespace-nowrap"
          >
            <StepForward className="w-4 h-4" aria-hidden="true" />
            <span>1 Langkah</span>
          </button>
          <button
            type="button"
            onClick={resetBoardOnly}
            aria-label="Reset posisi robot"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
