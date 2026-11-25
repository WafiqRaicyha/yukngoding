import { LEVEL_TABLE } from './badges';

export type ByteMood = 'idle' | 'celebrate' | 'encourage' | 'hint';

export interface ByteEvolutionStage {
  stage: 1 | 2 | 3 | 4 | 5;
  minLevel: number;
  name: string;
  tagline: string;
  accessorySummary: string;
  nextEvolutionName: string | null;
  nextEvolutionLevel: number | null;
}

export const BYTE_EVOLUTIONS: ByteEvolutionStage[] = [
  {
    stage: 1,
    minLevel: 1,
    name: 'Spark Byte',
    tagline: 'Energi digital awal yang penuh rasa ingin tahu',
    accessorySummary: 'Bentuk dasar neon biru-ungu',
    nextEvolutionName: 'Script Byte',
    nextEvolutionLevel: 2,
  },
  {
    stage: 2,
    minLevel: 2,
    name: 'Script Byte',
    tagline: 'Siap membaca sintaks kode dengan fokus tajam',
    accessorySummary: 'Visor koding hijau neon',
    nextEvolutionName: 'Logic Byte',
    nextEvolutionLevel: 3,
  },
  {
    stage: 3,
    minLevel: 3,
    name: 'Logic Byte',
    tagline: 'Pengendali alur logika dan percabangan cepat',
    accessorySummary: 'Headset futuristik & aura pendar terang',
    nextEvolutionName: 'Data Byte',
    nextEvolutionLevel: 4,
  },
  {
    stage: 4,
    minLevel: 4,
    name: 'Data Byte',
    tagline: 'Mengorbitkan struktur data dan sintaks hologram',
    accessorySummary: 'Partikel orbit hologram < /> dan {}',
    nextEvolutionName: 'Master Byte',
    nextEvolutionLevel: 5,
  },
  {
    stage: 5,
    minLevel: 5,
    name: 'Master Byte',
    tagline: 'Penyihir kode puncak dengan energi penuh',
    accessorySummary: 'Jubah Code Wizard mini & mahkota emas-ungu',
    nextEvolutionName: null,
    nextEvolutionLevel: null,
  },
];

export function getByteEvolution(level: number): ByteEvolutionStage {
  const clamped = Math.max(1, Math.floor(level));
  if (clamped >= 5) return BYTE_EVOLUTIONS[4];
  return BYTE_EVOLUTIONS[clamped - 1] ?? BYTE_EVOLUTIONS[0];
}

export function getByteNextTargetText(level: number, currentXp: number): string {
  const evo = getByteEvolution(level);
  if (evo.nextEvolutionLevel !== null && evo.nextEvolutionName) {
    const nextLevelRow = LEVEL_TABLE.find((l) => l.level === evo.nextEvolutionLevel);
    const needed = nextLevelRow ? Math.max(0, nextLevelRow.minXp - currentXp) : 0;
    return `Butuh ${needed} XP lagi ke Level ${evo.nextEvolutionLevel} untuk berevolusi menjadi ${evo.nextEvolutionName}.`;
  }
  const maxRow = LEVEL_TABLE[LEVEL_TABLE.length - 1];
  if (level < maxRow.level) {
    const needed = Math.max(0, maxRow.minXp - currentXp);
    return `Evolusi Master Byte terbuka! Kumpulkan ${needed} XP lagi untuk gelar ${maxRow.gelar}.`;
  }
  return 'Evolusi puncak Master Byte tercapai! Terus asah skill kodingmu di simulasi dan tantangan harian.';
}
