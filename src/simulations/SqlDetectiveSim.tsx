import { CheckCircle2, Search, ShieldAlert, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ByteCompanion } from '../components/ByteMascot';
import { ByteMood } from '../data/byteMascot';
import { SQL_DETECTIVE_LOGS, SQL_SUSPECT_OPTIONS } from '../data/demoProfiles';
import { SimulasiId, SqlLogRow } from '../types';

interface SqlDetectiveSimProps {
  playerLevel: number;
  isCompleted: boolean;
  onComplete: (simId: SimulasiId, title: string) => void;
}

type ColumnKey = keyof SqlLogRow;

const ALL_COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: 'id_log', label: 'id_log' },
  { key: 'nama_pengguna', label: 'nama_pengguna' },
  { key: 'peran', label: 'peran' },
  { key: 'lokasi', label: 'lokasi' },
  { key: 'jam', label: 'jam' },
  { key: 'aktivitas', label: 'aktivitas' },
];

export function SqlDetectiveSim({ playerLevel, isCompleted, onComplete }: SqlDetectiveSimProps) {
  const [selectedCols, setSelectedCols] = useState<ColumnKey[]>([
    'nama_pengguna',
    'lokasi',
    'jam',
    'aktivitas',
  ]);
  const [selectAll, setSelectAll] = useState(false);
  const [lokasiFilter, setLokasiFilter] = useState<string>('ALL');
  const [jamFilter, setJamFilter] = useState<'ALL' | 'AFTER_20' | 'BEFORE_20'>('ALL');
  const [orderBy, setOrderBy] = useState<'id_log ASC' | 'jam DESC' | 'jam ASC' | 'nama_pengguna ASC'>(
    'jam DESC',
  );
  const [selectedSuspect, setSelectedSuspect] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [verdict, setVerdict] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const activeColumns: ColumnKey[] = selectAll
    ? ALL_COLUMNS.map((c) => c.key)
    : selectedCols.length > 0
      ? selectedCols
      : ['nama_pengguna'];

  const toggleColumn = (col: ColumnKey) => {
    setSelectAll(false);
    setSelectedCols((prev) => {
      if (prev.includes(col)) {
        return prev.length > 1 ? prev.filter((c) => c !== col) : prev;
      }
      return [...prev, col];
    });
  };

  const filteredRows = useMemo(() => {
    const rows = SQL_DETECTIVE_LOGS.filter((row) => {
      if (lokasiFilter !== 'ALL' && row.lokasi !== lokasiFilter) return false;
      if (jamFilter === 'AFTER_20' && row.jam <= '20:00') return false;
      if (jamFilter === 'BEFORE_20' && row.jam > '20:00') return false;
      return true;
    });

    return [...rows].sort((a, b) => {
      switch (orderBy) {
        case 'jam DESC':
          return b.jam.localeCompare(a.jam);
        case 'jam ASC':
          return a.jam.localeCompare(b.jam);
        case 'nama_pengguna ASC':
          return a.nama_pengguna.localeCompare(b.nama_pengguna);
        case 'id_log ASC':
        default:
          return a.id_log - b.id_log;
      }
    });
  }, [lokasiFilter, jamFilter, orderBy]);

  const sqlPreview = useMemo(() => {
    const selectClause = selectAll ? 'SELECT *' : `SELECT ${activeColumns.join(', ')}`;
    const conditions: string[] = [];
    if (lokasiFilter !== 'ALL') conditions.push(`lokasi = '${lokasiFilter}'`);
    if (jamFilter === 'AFTER_20') conditions.push(`jam > '20:00'`);
    if (jamFilter === 'BEFORE_20') conditions.push(`jam <= '20:00'`);
    const whereClause = conditions.length > 0 ? `\nWHERE ${conditions.join(' AND ')}` : '';
    return `${selectClause}\nFROM log_akses${whereClause}\nORDER BY ${orderBy};`;
  }, [selectAll, activeColumns, lokasiFilter, jamFilter, orderBy]);

  const hasValidEvidenceQuery = lokasiFilter === 'Ruang Server' && jamFilter === 'AFTER_20';

  const handleVerifySuspect = () => {
    if (!selectedSuspect) {
      setVerdict({
        type: 'error',
        message: 'Pilih nama tersangka terlebih dahulu pada daftar di bawah.',
      });
      return;
    }

    if (!hasValidEvidenceQuery) {
      setVerdict({
        type: 'error',
        message:
          'Susun filter WHERE terlebih dahulu untuk menyaring lokasi Ruang Server dan jam setelah 20:00 agar bukti tabel akurat.',
      });
      return;
    }

    if (selectedSuspect === 'Akun_Vega') {
      setVerdict({
        type: 'success',
        message:
          'Kasus terpecahkan! Query SQL-mu tepat mengisolasi Akun_Vega yang menyalin file presentasi di Ruang Server pukul 21:15.',
      });
      onComplete('sim-sql', 'Detektif Data Server');
    } else {
      setVerdict({
        type: 'error',
        message: `${selectedSuspect} bukan pelaku utamanya. Periksa kembali baris hasil filter Ruang Server setelah pukul 20:00.`,
      });
    }
  };

  const byteMood: ByteMood = showHint
    ? 'hint'
    : verdict.type === 'success'
      ? 'celebrate'
      : verdict.type === 'error'
        ? 'encourage'
        : 'idle';

  const byteMessage = showHint
    ? "Petunjuk Byte: Pilih WHERE lokasi = 'Ruang Server' dan WHERE jam > '20:00' agar hanya baris pelaku utama yang tersisa di tabel!"
    : verdict.type === 'success'
      ? 'Kasus selesai! Query SQL-mu berhasil menemukan pelaku sebenarnya dengan bukti yang akurat.'
      : verdict.type === 'error'
        ? 'Hampir tepat! Periksa lagi filter WHERE lokasi & jam lalu lihat akun yang muncul di tabel hasil.'
        : hasValidEvidenceQuery
          ? 'Filter SQL-mu sudah menyaring bukti tepat! Sekarang pilih nama tersangka di panel kiri.'
          : 'Gunakan kontrol WHERE lokasi dan WHERE jam untuk menyaring tabel log_akses.';

  return (
    <div className="space-y-6">
      <ByteCompanion
        level={playerLevel}
        mood={byteMood}
        message={byteMessage}
        actionLabel={showHint ? 'Tutup Petunjuk' : 'Petunjuk Byte'}
        onAction={() => setShowHint((prev) => !prev)}
      />

      {/* Story Case Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Search className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Detektif Data Server (SQL)</h3>
              <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                <strong>Kasus:</strong> File presentasi proyek robotik di <strong>Ruang Server</strong> disalin tanpa izin pada malam hari (<strong>setelah pukul 20:00</strong>). Susun query SQL pada tabel <code className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">log_akses</code> untuk menemukan pelakunya.
              </p>
            </div>
          </div>
          <span
            className={`text-xs font-semibold ${
              isCompleted ? 'text-emerald-700' : 'text-slate-600'
            }`}
          >
            {isCompleted ? 'Sudah Selesai' : 'Reward +50 Poin / +40 XP'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Visual Query Builder + Suspect Selector */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900">1. SELECT Kolom</span>
              <button
                type="button"
                onClick={() => setSelectAll((prev) => !prev)}
                aria-pressed={selectAll}
                className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-md transition-colors ${
                  selectAll
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                SELECT *
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ALL_COLUMNS.map((col) => {
                const checked = selectAll || selectedCols.includes(col.key);
                return (
                  <label
                    key={col.key}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleColumn(col.key)}
                      className="accent-[#2563EB] rounded"
                    />
                    <span className="truncate">{col.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
            <div>
              <label htmlFor="sql-lokasi" className="block text-xs font-bold text-slate-900 mb-1.5">
                2. WHERE lokasi
              </label>
              <select
                id="sql-lokasi"
                value={lokasiFilter}
                onChange={(e) => setLokasiFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="ALL">Semua lokasi (tanpa filter)</option>
                <option value="Ruang Server">Ruang Server</option>
                <option value="Lab Komputer">Lab Komputer</option>
                <option value="Perpustakaan">Perpustakaan</option>
                <option value="Ruang Komunitas">Ruang Komunitas</option>
              </select>
            </div>

            <div>
              <label htmlFor="sql-jam" className="block text-xs font-bold text-slate-900 mb-1.5">
                3. WHERE jam
              </label>
              <select
                id="sql-jam"
                value={jamFilter}
                onChange={(e) => setJamFilter(e.target.value as 'ALL' | 'AFTER_20' | 'BEFORE_20')}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="ALL">Semua waktu (tanpa filter)</option>
                <option value="AFTER_20">&gt; &apos;20:00&apos; (Malam hari)</option>
                <option value="BEFORE_20">&lt;= &apos;20:00&apos; (Siang / Sore)</option>
              </select>
            </div>

            <div>
              <label htmlFor="sql-order" className="block text-xs font-bold text-slate-900 mb-1.5">
                4. ORDER BY
              </label>
              <select
                id="sql-order"
                value={orderBy}
                onChange={(e) =>
                  setOrderBy(e.target.value as 'id_log ASC' | 'jam DESC' | 'jam ASC' | 'nama_pengguna ASC')
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="jam DESC">jam DESC (Terbaru dulu)</option>
                <option value="jam ASC">jam ASC (Terawal dulu)</option>
                <option value="nama_pengguna ASC">nama_pengguna ASC (A–Z)</option>
                <option value="id_log ASC">id_log ASC</option>
              </select>
            </div>
          </div>

          {/* Suspect Verification Panel */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#7C3AED]" aria-hidden="true" />
              <h4 className="text-sm font-bold text-slate-900">Tentukan Tersangka</h4>
            </div>
            <div>
              <label htmlFor="sql-suspect" className="block text-xs text-slate-600 mb-1.5">
                Berdasarkan bukti tabel hasil filter, siapa pelaku penyalinan file?
              </label>
              <select
                id="sql-suspect"
                value={selectedSuspect}
                onChange={(e) => setSelectedSuspect(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="">— Pilih nama akun —</option>
                {SQL_SUSPECT_OPTIONS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleVerifySuspect}
              className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
            >
              Verifikasi Bukti &amp; Tersangka
            </button>

            {verdict.type !== 'idle' && (
              <div
                role="status"
                aria-live="polite"
                className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                  verdict.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                {verdict.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" aria-hidden="true" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" aria-hidden="true" />
                )}
                <span className="leading-relaxed">{verdict.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live SQL Syntax Preview + Responsive Result Table */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-300">Pratinjau Query SQL</span>
              <span className="font-mono tabular-nums">{filteredRows.length} baris ditemukan</span>
            </div>
            <pre className="font-mono text-xs sm:text-sm text-emerald-300 overflow-x-auto leading-relaxed">
              <code>{sqlPreview}</code>
            </pre>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">
                Hasil Tabel <code className="font-mono text-xs text-slate-600">log_akses</code>
              </h4>
              <span className="text-xs text-slate-500 tabular-nums">
                Menampilkan {filteredRows.length} dari {SQL_DETECTIVE_LOGS.length} baris
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-xs">
                    {activeColumns.map((col) => (
                      <th key={col} className="px-4 py-2.5 font-semibold whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={activeColumns.length}
                        className="px-4 py-8 text-center text-slate-500 text-sm"
                      >
                        Tidak ada baris log yang cocok dengan kombinasi filter WHERE saat ini.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row) => {
                      const isEvidenceRow = hasValidEvidenceQuery && row.nama_pengguna === 'Akun_Vega';
                      return (
                        <tr
                          key={row.id_log}
                          className={
                            isEvidenceRow ? 'bg-emerald-50/70 font-medium text-emerald-950' : 'hover:bg-slate-50'
                          }
                        >
                          {activeColumns.map((col) => (
                            <td
                              key={col}
                              className={`px-4 py-2.5 whitespace-nowrap ${
                                col === 'id_log' || col === 'jam' ? 'font-mono tabular-nums' : ''
                              }`}
                            >
                              {row[col]}
                            </td>
                          ))}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
