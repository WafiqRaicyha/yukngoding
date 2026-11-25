import {
  ArrowRight,
  Braces,
  Database,
  Eye,
  EyeOff,
  LogIn,
  Terminal,
  UserPlus,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { ByteMascot } from '../components/ByteMascot';
import { ByteMood } from '../data/byteMascot';
import { KategoriBahasa, UserAccount } from '../types';

interface LoginViewProps {
  onLogin: (
    username: string,
    password: string,
  ) => Promise<{ ok: boolean; user?: UserAccount; error?: string }>;
  onRegister: (params: {
    namaAlias: string;
    username: string;
    password: string;
  }) => Promise<{ ok: boolean; user?: UserAccount; error?: string }>;
  onAuthSuccess: (user: UserAccount) => void;
}

type AuthMode = 'login' | 'register';

const CODE_PREVIEWS: Record<
  KategoriBahasa,
  {
    file: string;
    summary: string;
    accentClass: string;
    code: string;
    output: string;
    byteTip: string;
    icon: typeof Terminal;
  }
> = {
  Python: {
    file: 'misi_robot.py',
    summary: 'Logika variabel, percabangan, loop, hingga simulasi labirin robot.',
    accentClass: 'text-[#2563EB]',
    code: `energi = 85\nfor langkah in range(1, 4):\n    print(f"Robot maju langkah #{langkah}")`,
    output: `Robot maju langkah #1\nRobot maju langkah #2\nRobot maju langkah #3`,
    byteTip: 'Di Python, kamu belajar alur logika dan memandu robot menembus labirin 5×5!',
    icon: Terminal,
  },
  JavaScript: {
    file: 'gerbang_logika.js',
    summary: 'Variabel modern, gerbang boolean && / ||, array, dan manipulasi DOM.',
    accentClass: 'text-[#7C3AED]',
    code: `const kunci = true;\nconst energi = 90;\nconst buka = kunci && energi >= 80;\nconsole.log("Pintu terbuka:", buka);`,
    output: `Pintu terbuka: true`,
    byteTip: 'Di JavaScript, susun sakelar gerbang logika dan lihat sirkuit menyala seketika!',
    icon: Braces,
  },
  SQL: {
    file: 'detektif_data.sql',
    summary: 'Menyaring tabel dengan SELECT, WHERE, ORDER BY, dan agregasi data.',
    accentClass: 'text-emerald-700',
    code: `SELECT nama_pengguna, jam\nFROM log_akses\nWHERE lokasi = 'Ruang Server'\nORDER BY jam DESC;`,
    output: `Akun_Vega  | 21:15  (Terdeteksi)`,
    byteTip: 'Di SQL, jadilah Detektif Data untuk menyaring bukti log server lewat query visual!',
    icon: Database,
  },
};

const PREVIEW_LANGS: KategoriBahasa[] = ['Python', 'JavaScript', 'SQL'];

export function LoginView({ onLogin, onRegister, onAuthSuccess }: LoginViewProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [previewLang, setPreviewLang] = useState<KategoriBahasa>('Python');

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccessNote, setLoginSuccessNote] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Register form state
  const [regAlias, setRegAlias] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [showRegPw, setShowRegPw] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSubmitting, setRegSubmitting] = useState(false);

  // Interactive Byte mascot mood & greeting
  const [byteMood, setByteMood] = useState<ByteMood>('idle');
  const [byteMessage, setByteMessage] = useState(
    'Siap mulai perjalanan ngodingmu hari ini? Masuk ke akunmu atau buat akun baru dalam hitungan detik!',
  );

  const activePreview = CODE_PREVIEWS[previewLang];

  const handleSelectPreviewLang = (lang: KategoriBahasa) => {
    setPreviewLang(lang);
    setByteMood('hint');
    setByteMessage(CODE_PREVIEWS[lang].byteTip);
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setLoginError('');
    setRegError('');
    if (nextMode === 'register') {
      setLoginSuccessNote('');
      setByteMood('hint');
      setByteMessage(
        'Buat akun pembelajar barumu — pilih Nama Alias kreatif dan Username pilihanmu!',
      );
    } else {
      setByteMood('idle');
      setByteMessage('Siap lanjutkan belajarmu? Masukkan username dan password akunmu.');
    }
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccessNote('');
    setLoginSubmitting(true);
    try {
      const res = await onLogin(loginUsername, loginPassword);
      if (res.ok && res.user) {
        setByteMood('celebrate');
        onAuthSuccess(res.user);
      } else {
        setLoginError(res.error ?? 'Gagal masuk. Periksa kembali kredensialmu.');
        setByteMood('encourage');
        setByteMessage(
          'Hmm, username atau password belum cocok. Periksa kembali ketikanmu atau daftar akun baru di tab sebelah.',
        );
      }
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (regPassword !== regConfirm) {
      setRegError('Konfirmasi password tidak cocok.');
      setByteMood('encourage');
      setByteMessage('Pastikan kolom Password dan Konfirmasi Password berisi teks yang sama ya.');
      return;
    }

    setRegSubmitting(true);
    try {
      const res = await onRegister({
        namaAlias: regAlias,
        username: regUsername,
        password: regPassword,
      });
      if (res.ok && res.user) {
        const createdUsername = res.user.username;
        setRegAlias('');
        setRegUsername('');
        setRegPassword('');
        setRegConfirm('');
        setMode('login');
        setLoginUsername(createdUsername);
        setLoginPassword('');
        setLoginSuccessNote(
          `Akun @${createdUsername} berhasil dibuat! Silakan masuk dengan password yang baru kamu buat.`,
        );
        setByteMood('celebrate');
        setByteMessage(
          `Selamat datang ${res.user.profile.namaAlias}! Akunmu sudah siap, ayo masuk dan mulai ngoding!`,
        );
      } else {
        setRegError(res.error ?? 'Gagal mendaftarkan akun baru.');
        setByteMood('encourage');
        setByteMessage('Cek lagi syarat Nama Alias, Username, dan Password minimal 4 karakter ya.');
      }
    } finally {
      setRegSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-white text-[#0F172A]">
      {/* Left 60% Edge-to-Edge Brand & Interactive Showcase Canvas */}
      <section
        aria-label="Pengenalan platform YukNgoding"
        className="lg:col-span-7 bg-prelogin-showcase px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12 flex flex-col justify-between gap-8 lg:min-h-screen"
      >
        {/* Top Row: Official Brand Logo + Quiet Curriculum Lead-in */}
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center justify-center h-11 sm:h-12 w-[148px] sm:w-[168px] overflow-hidden shrink-0">
            <img
              src="/assets/aistudio/logo_yukngoding_7eed5a86.jpg"
              alt="YukNgoding"
              className="w-[184px] sm:w-[208px] max-w-none h-auto select-none mix-blend-multiply"
            />
          </div>
          <span className="text-xs font-medium text-slate-600 hidden sm:inline">
            Python · JavaScript · SQL
          </span>
        </div>

        {/* Main Hero + Interactive Code Preview */}
        <div className="max-w-2xl space-y-7 my-auto">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl xl:text-[2.85rem] font-extrabold tracking-tight text-slate-950 leading-[1.12]">
              Belajar pemrograman terasa lebih nyata dengan misi, kuis, dan simulasi visual.
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              Kuasai logika Python, JavaScript, dan SQL secara bertahap bersama maskot interaktif Byte. Cocok untuk pemula total, mahasiswa, hingga pembelajar mandiri.
            </p>
          </div>

          {/* Interactive 3-Language Code Preview Window */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                role="tablist"
                aria-label="Pratinjau bahasa pemrograman"
                className="inline-flex items-center gap-1 p-1 bg-white/85 border border-slate-200/90 rounded-xl shadow-xs"
              >
                {PREVIEW_LANGS.map((lang) => {
                  const Icon = CODE_PREVIEWS[lang].icon;
                  const active = previewLang === lang;
                  return (
                    <button
                      key={lang}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => handleSelectPreviewLang(lang)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                        active
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{lang}</span>
                    </button>
                  );
                })}
              </div>
              <span className={`text-xs font-medium ${activePreview.accentClass}`}>
                {activePreview.file}
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden bg-[#0F172A] text-slate-100 shadow-lg border border-slate-800">
              <div className="px-4 py-2.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>{activePreview.file}</span>
                <span className="text-slate-500">Pratinjau Interaktif</span>
              </div>
              <pre className="p-4 sm:p-5 text-xs sm:text-[13px] font-mono leading-relaxed overflow-x-auto text-blue-100">
                <code>{activePreview.code}</code>
              </pre>
              <div className="px-4 sm:px-5 py-3 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="text-[11px] font-mono text-slate-400 shrink-0">Output:</span>
                <pre className="text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                  <code>{activePreview.output}</code>
                </pre>
              </div>
            </div>
            <p className="text-xs text-slate-600">{activePreview.summary}</p>
          </div>

          {/* Interactive Byte Mascot Companion Strip */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
            <button
              type="button"
              onClick={() => {
                setByteMood((prev) => (prev === 'celebrate' ? 'idle' : 'celebrate'));
                setByteMessage('Halo! Aku Byte — aku akan terus berevolusi setiap kali levelmu naik!');
              }}
              aria-label="Sapa maskot Byte"
              title="Klik untuk menyapa Byte"
              className="rounded-2xl bg-white/90 border border-slate-200/90 p-2 shadow-xs hover:border-[#2563EB]/40 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              <ByteMascot level={2} mood={byteMood} size="sm" className="!w-16 !h-16" />
            </button>
            <div className="text-center sm:text-left space-y-0.5">
              <p className="text-xs font-bold text-[#1E3A8A]">Byte · Pendamping Belajarmu</p>
              <p className="text-sm text-slate-700 leading-relaxed">{byteMessage}</p>
            </div>
          </div>
        </div>

        {/* Bottom Highlights Strip (Unboxed Editorial Metrics) */}
        <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-2xl">
          <div>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
              12
            </p>
            <p className="text-xs text-slate-600 mt-0.5">Modul &amp; 24 Kuis</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-extrabold text-[#7C3AED] font-mono tabular-nums">
              3
            </p>
            <p className="text-xs text-slate-600 mt-0.5">Simulasi Visual</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono tabular-nums">
              5
            </p>
            <p className="text-xs text-slate-600 mt-0.5">Tahap Evolusi Byte</p>
          </div>
        </div>
      </section>

      {/* Right 40% Full-Height Pure White Authentication Panel */}
      <main className="lg:col-span-5 bg-white lg:border-l lg:border-slate-200/80 px-6 py-10 sm:px-12 lg:px-14 flex flex-col justify-center lg:min-h-screen">
        <div className="w-full max-w-md mx-auto space-y-7">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {mode === 'login' ? 'Selamat datang kembali' : 'Mulai akun barumu'}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {mode === 'login'
                ? 'Masuk untuk melanjutkan progres belajar, XP, dan tantangan harianmu.'
                : 'Daftar cepat dengan Nama Alias dan Username tanpa formulir panjang.'}
            </p>
          </div>

          {/* Clean Segmented Auth Mode Switcher */}
          <div
            role="tablist"
            aria-label="Pilih mode autentikasi"
            className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              onClick={() => switchMode('login')}
              className={`py-2.5 px-3 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                mode === 'login'
                  ? 'bg-white text-[#1E3A8A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Masuk</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              onClick={() => switchMode('register')}
              className={`py-2.5 px-3 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                mode === 'register'
                  ? 'bg-white text-[#1E3A8A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Daftar Baru</span>
            </button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 view-enter" noValidate>
              {loginSuccessNote && (
                <div
                  role="status"
                  className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900"
                >
                  {loginSuccessNote}
                </div>
              )}

              {loginError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800 font-medium"
                >
                  {loginError}
                </div>
              )}

              <div>
                <label
                  htmlFor="login-username"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Username
                </label>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Masukkan username akunmu"
                  className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Password / PIN
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type={showLoginPw ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan password atau PIN"
                    className="w-full pl-4 pr-11 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPw((prev) => !prev)}
                    aria-label={showLoginPw ? 'Sembunyikan password' : 'Tampilkan password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-800 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                  >
                    {showLoginPw ? (
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginSubmitting}
                className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 rounded-xl shadow-sm transition-all inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
              >
                <span>{loginSubmitting ? 'Memverifikasi...' : 'Masuk ke YukNgoding'}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <p className="text-center text-xs text-slate-600 pt-2">
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="font-semibold text-[#2563EB] hover:text-[#1E3A8A] underline-offset-2 hover:underline"
                >
                  Daftar gratis sekarang
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 view-enter" noValidate>
              {regError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800 font-medium"
                >
                  {regError}
                </div>
              )}

              <div>
                <label
                  htmlFor="reg-alias"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Nama Alias
                </label>
                <input
                  id="reg-alias"
                  name="nickname"
                  type="text"
                  required
                  maxLength={18}
                  value={regAlias}
                  onChange={(e) => setRegAlias(e.target.value)}
                  placeholder="contoh: KoderNusa"
                  className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]"
                />
                <p className="text-[11px] text-slate-500 mt-1">3–18 karakter untuk nama tampilanmu</p>
              </div>

              <div>
                <label
                  htmlFor="reg-username"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Username
                </label>
                <input
                  id="reg-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  maxLength={18}
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value.toLowerCase())}
                  placeholder="contoh: koder_nusa"
                  className="w-full px-4 py-3 text-sm font-mono border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]"
                />
                <p className="text-[11px] text-slate-500 mt-1">Huruf kecil, angka, atau garis bawah (_)</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="reg-password"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Password / PIN
                  </label>
                  <div className="relative">
                    <input
                      id="reg-password"
                      name="new-password"
                      type={showRegPw ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      minLength={4}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 4 karakter"
                      className="w-full pl-3.5 pr-10 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPw((prev) => !prev)}
                      aria-label={showRegPw ? 'Sembunyikan password' : 'Tampilkan password'}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-800 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                    >
                      {showRegPw ? (
                        <EyeOff className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reg-confirm"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Konfirmasi Password
                  </label>
                  <input
                    id="reg-confirm"
                    name="confirm-password"
                    type={showRegPw ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    minLength={4}
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    placeholder="Ulangi password"
                    className="w-full px-3.5 py-3 text-sm border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB]/25 focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={regSubmitting}
                className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 rounded-xl shadow-sm transition-all inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2"
              >
                <span>{regSubmitting ? 'Membuat Akun...' : 'Buat Akun Pembelajar'}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <p className="text-center text-xs text-slate-600 pt-2">
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="font-semibold text-[#2563EB] hover:text-[#1E3A8A] underline-offset-2 hover:underline"
                >
                  Masuk di sini
                </button>
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
