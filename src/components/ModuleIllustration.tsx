interface ModuleIllustrationProps {
  materiId: string;
  compact?: boolean;
}

export function ModuleIllustration({ materiId, compact = false }: ModuleIllustrationProps) {
  const heightClass = compact ? 'h-32' : 'h-48 sm:h-52';

  switch (materiId) {
    case 'py-1':
      return (
        <svg viewBox="0 0 360 160" className={`w-full ${heightClass}`} role="img" aria-label="Ilustrasi Variabel dan Tipe Data Python">
          <rect width="360" height="160" rx="12" fill="#EFF6FF" />
          <rect x="20" y="24" width="96" height="52" rx="8" fill="#FFFFFF" stroke="#BFDBFE" strokeWidth="1.5" />
          <text x="32" y="44" fill="#1E3A8A" fontSize="11" fontWeight="700" fontFamily="monospace">nama</text>
          <text x="32" y="64" fill="#2563EB" fontSize="12" fontFamily="monospace">"Bintang"</text>
          <text x="86" y="44" fill="#64748B" fontSize="10" fontFamily="monospace">str</text>

          <rect x="132" y="24" width="96" height="52" rx="8" fill="#FFFFFF" stroke="#BFDBFE" strokeWidth="1.5" />
          <text x="144" y="44" fill="#1E3A8A" fontSize="11" fontWeight="700" fontFamily="monospace">umur</text>
          <text x="144" y="64" fill="#7C3AED" fontSize="12" fontFamily="monospace">14</text>
          <text x="198" y="44" fill="#64748B" fontSize="10" fontFamily="monospace">int</text>

          <rect x="244" y="24" width="96" height="52" rx="8" fill="#FFFFFF" stroke="#BFDBFE" strokeWidth="1.5" />
          <text x="256" y="44" fill="#1E3A8A" fontSize="11" fontWeight="700" fontFamily="monospace">nilai</text>
          <text x="256" y="64" fill="#059669" fontSize="12" fontFamily="monospace">92.5</text>
          <text x="302" y="44" fill="#64748B" fontSize="10" fontFamily="monospace">float</text>

          <rect x="86" y="96" width="188" height="40" rx="8" fill="#1E3A8A" />
          <text x="180" y="120" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontFamily="monospace">print(nama, nilai)</text>
          <path d="M68 76 V96 M180 76 V96 M292 76 V96" stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="3 3" />
        </svg>
      );

    case 'py-2':
      return (
        <svg viewBox="0 0 360 160" className={`w-full ${heightClass}`} role="img" aria-label="Ilustrasi Percabangan if elif else Python">
          <rect width="360" height="160" rx="12" fill="#EFF6FF" />
          <polygon points="180,18 250,52 180,86 110,52" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" />
          <text x="180" y="56" textAnchor="middle" fill="#1E3A8A" fontSize="11" fontWeight="700" fontFamily="monospace">nilai &gt;= 75?</text>
          <path d="M110 52 H66 V106" fill="none" stroke="#10B981" strokeWidth="2" />
          <path d="M250 52 H294 V106" fill="none" stroke="#D97706" strokeWidth="2" />
          <text x="72" y="46" fill="#047857" fontSize="10" fontWeight="700">True</text>
          <text x="260" y="46" fill="#B45309" fontSize="10" fontWeight="700">False</text>
          <rect x="22" y="106" width="110" height="36" rx="8" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
          <text x="77" y="128" textAnchor="middle" fill="#047857" fontSize="11" fontFamily="monospace">Lulus ("Baik")</text>
          <rect x="228" y="106" width="110" height="36" rx="8" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.5" />
          <text x="283" y="128" textAnchor="middle" fill="#B45309" fontSize="11" fontFamily="monospace">else: Latihan</text>
        </svg>
      );

    case 'py-3':
      return (
        <svg viewBox="0 0 360 160" className={`w-full ${heightClass}`} role="img" aria-label="Ilustrasi Perulangan for dan while Python">
          <rect width="360" height="160" rx="12" fill="#EFF6FF" />
          {[0, 1, 2, 3].map((step) => (
            <g key={step} transform={`translate(${28 + step * 78}, 34)`}>
              <rect width="62" height="44" rx="8" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
              <text x="31" y="20" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="monospace">i = {step + 1}</text>
              <text x="31" y="36" textAnchor="middle" fill="#1E3A8A" fontSize="11" fontWeight="700" fontFamily="monospace">maju()</text>
              {step < 3 && <path d="M62 22 H78" stroke="#2563EB" strokeWidth="2" />}
            </g>
          ))}
          <path d="M294 78 V118 H59 V84" fill="none" stroke="#7C3AED" strokeWidth="2" strokeDasharray="5 4" />
          <polygon points="59,78 54,88 64,88" fill="#7C3AED" />
          <rect x="115" y="104" width="130" height="28" rx="6" fill="#7C3AED" />
          <text x="180" y="122" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontFamily="monospace">for i in range(1, 5)</text>
        </svg>
      );

    case 'py-4':
      return (
        <svg viewBox="0 0 360 160" className={`w-full ${heightClass}`} role="img" aria-label="Ilustrasi List dan Fungsi Python">
          <rect width="360" height="160" rx="12" fill="#EFF6FF" />
          {[80, 90, 100].map((val, idx) => (
            <g key={idx} transform={`translate(${36 + idx * 96}, 24)`}>
              <rect width="84" height="48" rx="8" fill="#FFFFFF" stroke="#2563EB" strokeWidth="1.5" />
              <text x="42" y="20" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="monospace">indeks [{idx}]</text>
              <text x="42" y="39" textAnchor="middle" fill="#1E3A8A" fontSize="14" fontWeight="700" fontFamily="monospace">{val}</text>
            </g>
          ))}
          <rect x="52" y="96" width="256" height="42" rx="8" fill="#1E3A8A" />
          <text x="180" y="121" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontFamily="monospace">def hitung_rata(skor) → 90.0</text>
          <path d="M180 72 V96" stroke="#2563EB" strokeWidth="2" />
        </svg>
      );

    case 'js-1':
      return (
        <svg viewBox="0 0 360 160" className={`w-full ${heightClass}`} role="img" aria-label="Ilustrasi Variabel let const dan Console JavaScript">
          <rect width="360" height="160" rx="12" fill="#F5F3FF" />
          <rect x="24" y="22" width="144" height="50" rx="8" fill="#FFFFFF" stroke="#C4B5FD" strokeWidth="1.5" />
          <text x="36" y="42" fill="#7C3AED" fontSize="11" fontWeight="700" fontFamily="monospace">const app</text>
          <text x="36" y="61" fill="#0F172A" fontSize="11" fontFamily="monospace">"YukNgoding"</text>
          <rect x="192" y="22" width="144" height="50" rx="8" fill="#FFFFFF" stroke="#C4B5FD" strokeWidth="1.5" />
          <text x="204" y="42" fill="#2563EB" fontSize="11" fontWeight="700" fontFamily="monospace">let skor</text>
          <text x="204" y="61" fill="#0F172A" fontSize="11" fontFamily="monospace">50 → 75</text>
          <rect x="24" y="92" width="312" height="46" rx="8" fill="#0F172A" />
          <text x="38" y="112" fill="#94A3B8" fontSize="10" fontFamily="monospace">Console Output</text>
          <text x="38" y="128" fill="#34D399" fontSize="11" fontFamily="monospace">Skor terbaru: 75 poin</text>
        </svg>
      );

    case 'js-2':
      return (
        <svg viewBox="0 0 360 160" className={`w-full ${heightClass}`} role="img" aria-label="Ilustrasi Operator Logika JavaScript">
          <rect width="360" height="160" rx="12" fill="#F5F3FF" />
          <rect x="20" y="28" width="96" height="36" rx="8" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.5" />
          <text x="68" y="50" textAnchor="middle" fill="#047857" fontSize="11" fontFamily="monospace">skor &gt;= 80</text>
          <rect x="20" y="96" width="96" height="36" rx="8" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.5" />
          <text x="68" y="118" textAnchor="middle" fill="#047857" fontSize="11" fontFamily="monospace">energi &gt;= 50</text>
          <path d="M116 46 H156 V72 M116 114 H156 V88" fill="none" stroke="#10B981" strokeWidth="2" />
          <rect x="148" y="60" width="68" height="40" rx="8" fill="#7C3AED" />
          <text x="182" y="84" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="700" fontFamily="monospace">&amp;&amp;</text>
          <path d="M216 80 H252" stroke="#10B981" strokeWidth="2.5" />
          <rect x="252" y="58" width="88" height="44" rx="8" fill="#ECFDF5" stroke="#10B981" strokeWidth="2" />
          <text x="296" y="84" textAnchor="middle" fill="#047857" fontSize="12" fontWeight="700" fontFamily="monospace">TRUE</text>
        </svg>
      );

    case 'js-3':
      return (
        <svg viewBox="0 0 360 160" className={`w-full ${heightClass}`} role="img" aria-label="Ilustrasi Array dan Object JavaScript">
          <rect width="360" height="160" rx="12" fill="#F5F3FF" />
          <rect x="22" y="24" width="136" height="112" rx="8" fill="#FFFFFF" stroke="#C4B5FD" strokeWidth="1.5" />
          <text x="34" y="45" fill="#7C3AED" fontSize="11" fontWeight="700" fontFamily="monospace">Array [3]</text>
          <rect x="34" y="55" width="112" height="20" rx="4" fill="#ECFDF5" />
          <text x="42" y="69" fill="#047857" fontSize="10" fontFamily="monospace">js-1: selesai</text>
          <rect x="34" y="80" width="112" height="20" rx="4" fill="#F1F5F9" />
          <text x="42" y="94" fill="#64748B" fontSize="10" fontFamily="monospace">js-2: belum</text>
          <rect x="34" y="105" width="112" height="20" rx="4" fill="#ECFDF5" />
          <text x="42" y="119" fill="#047857" fontSize="10" fontFamily="monospace">js-3: selesai</text>

          <path d="M164 80 H198" stroke="#7C3AED" strokeWidth="2" />
          <polygon points="204,80 194,75 194,85" fill="#7C3AED" />
          <text x="182" y="70" textAnchor="middle" fill="#7C3AED" fontSize="10" fontFamily="monospace">.filter()</text>

          <rect x="208" y="38" width="130" height="84" rx="8" fill="#FFFFFF" stroke="#10B981" strokeWidth="1.5" />
          <text x="220" y="58" fill="#047857" fontSize="11" fontWeight="700" fontFamily="monospace">Hasil [2]</text>
          <rect x="220" y="68" width="106" height="20" rx="4" fill="#ECFDF5" />
          <text x="228" y="82" fill="#047857" fontSize="10" fontFamily="monospace">js-1: selesai</text>
          <rect x="220" y="93" width="106" height="20" rx="4" fill="#ECFDF5" />
          <text x="228" y="107" fill="#047857" fontSize="10" fontFamily="monospace">js-3: selesai</text>
        </svg>
      );

    case 'js-4':
      return (
        <svg viewBox="0 0 360 160" className={`w-full ${heightClass}`} role="img" aria-label="Ilustrasi Manipulasi DOM dan Event JavaScript">
          <rect width="360" height="160" rx="12" fill="#F5F3FF" />
          <rect x="24" y="22" width="140" height="116" rx="8" fill="#FFFFFF" stroke="#C4B5FD" strokeWidth="1.5" />
          <text x="38" y="42" fill="#475569" fontSize="10" fontWeight="700" fontFamily="monospace">DOM Tree</text>
          <rect x="38" y="52" width="112" height="24" rx="5" fill="#EEF2FF" />
          <text x="94" y="68" textAnchor="middle" fill="#1E3A8A" fontSize="10" fontFamily="monospace">&lt;button id="btn"&gt;</text>
          <rect x="38" y="86" width="112" height="24" rx="5" fill="#ECFDF5" />
          <text x="94" y="102" textAnchor="middle" fill="#047857" fontSize="10" fontFamily="monospace">&lt;p id="label"&gt;</text>

          <path d="M164 64 H206" stroke="#2563EB" strokeWidth="2" />
          <rect x="206" y="44" width="130" height="40" rx="8" fill="#2563EB" />
          <text x="271" y="68" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700" fontFamily="monospace">click event</text>
          <path d="M271 84 V104 H164" fill="none" stroke="#10B981" strokeWidth="2" />
          <text x="250" y="122" textAnchor="middle" fill="#047857" fontSize="10" fontFamily="monospace">textContent diperbarui</text>
        </svg>
      );

    case 'sql-1':
      return (
        <svg viewBox="0 0 360 160" className={`w-full ${heightClass}`} role="img" aria-label="Ilustrasi SELECT dan FROM SQL">
          <rect width="360" height="160" rx="12" fill="#ECFDF5" />
          <rect x="28" y="24" width="304" height="112" rx="8" fill="#FFFFFF" stroke="#A7F3D0" strokeWidth="1.5" />
          <rect x="28" y="24" width="304" height="30" rx="8" fill="#047857" />
          <text x="52" y="43" fill="#FFFFFF" fontSize="11" fontWeight="700" fontFamily="monospace">nama_alias</text>
          <text x="172" y="43" fill="#FFFFFF" fontSize="11" fontWeight="700" fontFamily="monospace">jalur</text>
          <text x="262" y="43" fill="#FFFFFF" fontSize="11" fontWeight="700" fontFamily="monospace">poin</text>
          <text x="52" y="74" fill="#0F172A" fontSize="11" fontFamily="monospace">Bot_Alfa</text>
          <text x="172" y="74" fill="#475569" fontSize="11" fontFamily="monospace">Python</text>
          <text x="262" y="74" fill="#047857" fontSize="11" fontWeight="700" fontFamily="monospace">220</text>
          <line x1="40" y1="86" x2="320" y2="86" stroke="#E2E8F0" />
          <text x="52" y="106" fill="#0F172A" fontSize="11" fontFamily="monospace">Tim_Orion</text>
          <text x="172" y="106" fill="#475569" fontSize="11" fontFamily="monospace">SQL</text>
          <text x="262" y="106" fill="#047857" fontSize="11" fontWeight="700" fontFamily="monospace">195</text>
        </svg>
      );

    case 'sql-2':
      return (
        <svg viewBox="0 0 360 160" className={`w-full ${heightClass}`} role="img" aria-label="Ilustrasi Penyaringan Data WHERE SQL">
          <rect width="360" height="160" rx="12" fill="#ECFDF5" />
          <rect x="22" y="26" width="110" height="108" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <text x="34" y="46" fill="#475569" fontSize="10" fontWeight="700" fontFamily="monospace">log_akses</text>
          <rect x="34" y="56" width="86" height="18" rx="4" fill="#F1F5F9" />
          <rect x="34" y="80" width="86" height="18" rx="4" fill="#D1FAE5" />
          <rect x="34" y="104" width="86" height="18" rx="4" fill="#F1F5F9" />

          <polygon points="152,44 218,44 196,86 196,118 174,118 174,86" fill="#10B981" />
          <text x="185" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="700" fontFamily="monospace">WHERE</text>

          <rect x="232" y="54" width="106" height="52" rx="8" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" />
          <text x="285" y="76" textAnchor="middle" fill="#047857" fontSize="11" fontWeight="700" fontFamily="monospace">Akun_Vega</text>
          <text x="285" y="94" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="monospace">Server · 21:15</text>
        </svg>
      );

    case 'sql-3':
      return (
        <svg viewBox="0 0 360 160" className={`w-full ${heightClass}`} role="img" aria-label="Ilustrasi ORDER BY SQL">
          <rect width="360" height="160" rx="12" fill="#ECFDF5" />
          <rect x="36" y="24" width="212" height="112" rx="8" fill="#FFFFFF" stroke="#A7F3D0" strokeWidth="1.5" />
          {[
            { label: '#1 Kode_Bintang', val: '420', w: 150, y: 40 },
            { label: '#2 Logika_Nusa', val: '315', w: 115, y: 72 },
            { label: '#3 Rakit_Skrip', val: '210', w: 80, y: 104 },
          ].map((row) => (
            <g key={row.label}>
              <rect x="48" y={row.y} width={row.w} height="22" rx="4" fill="#D1FAE5" />
              <text x="54" y={row.y + 15} fill="#047857" fontSize="10" fontWeight="700" fontFamily="monospace">{row.label}</text>
              <text x="236" y={row.y + 15} textAnchor="end" fill="#0F172A" fontSize="11" fontWeight="700" fontFamily="monospace">{row.val}</text>
            </g>
          ))}
          <rect x="266" y="48" width="66" height="64" rx="8" fill="#047857" />
          <text x="299" y="76" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700" fontFamily="monospace">DESC</text>
          <text x="299" y="96" textAnchor="middle" fill="#A7F3D0" fontSize="14" fontFamily="monospace">↓</text>
        </svg>
      );

    case 'sql-4':
    default:
      return (
        <svg viewBox="0 0 360 160" className={`w-full ${heightClass}`} role="img" aria-label="Ilustrasi COUNT dan GROUP BY SQL">
          <rect width="360" height="160" rx="12" fill="#ECFDF5" />
          {[
            { name: 'Lab', count: 4, h: 72, x: 56 },
            { name: 'Server', count: 3, h: 54, x: 146 },
            { name: 'Perpus', count: 2, h: 36, x: 236 },
          ].map((bar) => (
            <g key={bar.name}>
              <rect x={bar.x} y={118 - bar.h} width="64" height={bar.h} rx="6" fill="#10B981" />
              <text x={bar.x + 32} y={110 - bar.h} textAnchor="middle" fill="#047857" fontSize="12" fontWeight="700" fontFamily="monospace">{bar.count}</text>
              <text x={bar.x + 32} y="138" textAnchor="middle" fill="#0F172A" fontSize="11" fontFamily="monospace">{bar.name}</text>
            </g>
          ))}
          <line x1="36" y1="118" x2="324" y2="118" stroke="#047857" strokeWidth="1.5" />
        </svg>
      );
  }
}
