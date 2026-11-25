import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  KeyRound,
  LogIn,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { ByteMascot } from '../components/ByteMascot';
import { ByteMood } from '../data/byteMascot';
import { UserAccount } from '../types';

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

export function LoginView({ onLogin, onRegister, onAuthSuccess }: LoginViewProps) {
  const [mode, setMode] = useState<AuthMode>('login');

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

  // Demo credentials accordion
  const [demoOpen, setDemoOpen] = useState(true);

  // Interactive Byte mascot mood & greeting
  const [byteMood, setByteMood] = useState<ByteMood>('idle');
  const [byteMessage, setByteMessage] = useState(
    'Siap mulai perjalanan ngodingmu hari ini? Masuk ke akunmu atau daftar akun baru gratis!',
  );

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setLoginError('');
    setRegError('');
    if (nextMode === 'register') {
      setLoginSuccessNote('');
      setByteMood('hint');
      setByteMessage(
        'Buat akun pembelajar barumu di perangkat ini — cukup pakai Nama Alias dan Username tanpa data pribadi.',
      );
    } else {
      setByteMood('idle');
      setByteMessage('Siap mulai perjalanan ngodingmu hari ini? Masukkan username dan password-mu.');
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
          'Hmm, username atau password belum cocok. Cek lagi ketikanmu atau lihat Info Akun Demo di bawah.',
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

  const fillDemo = (username: string, password: string) => {
    setMode('login');
    setLoginUsername(username);
    setLoginPassword(password);
    setLoginError('');
    setLoginSuccessNote('');
    setByteMood('hint');
    setByteMessage(
      username === 'admin'
        ? 'Kredensial Admin Demo terisi! Klik Masuk untuk membuka Panel Admin.'
        : 'Kredensial User Demo terisi! Klik Masuk untuk lanjut ke Dashboard Belajar.',
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] text-[#0F172A]">
      {/* Minimal Top Brand Bar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          <div className="inline-flex items-center justify-center h-10 sm:h-12 w-[134px] sm:w-[160px] overflow-hidden shrink-0">
            <img
              src="/assets/aistudio/logo_yukngoding_7eed5a86.jpg"
              alt="YukNgoding"
              className="w-[168px] sm:w-[198px] max-w-none h-auto select-none mix-blend-multiply"
            />
          </div>
          <span className="text-xs font-medium text-slate-500">
            Belajar Koding Interaktif untuk Semua
          </span>
        </div>
      </header>

      {/* Main Centered Auth Layout */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Left Panel: Brand & Interactive Byte Mascot */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#6D28D9] text-white p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-wide uppercase text-blue-100">
                Python · JavaScript · SQL
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Belajar Koding Seru dengan Misi &amp; Simulasi
              </h1>
              <p className="text-sm text-blue-100/90 leading-relaxed">
                Terbuka untuk pemula total, mahasiswa, career switcher, hingga pembelajar mandiri. Progres tersimpan lokal per akun di perangkat ini.
              </p>
            </div>

            {/* Byte Mascot Greeting */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex flex-col sm:flex-row lg:flex-col items-center gap-3 text-center sm:text-left lg:text-center">
              <div className="bg-white/95 rounded-2xl p-2 shrink-0">
                <ByteMascot level={2} mood={byteMood} size="md" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-emerald-300">Byte · Maskot YukNgoding</p>
                <p className="text-xs sm:text-sm text-white/95 leading-relaxed">{byteMessage}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-blue-100/90">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" aria-hidden="true" />
              <span>100% lokal di browser · Password di-hash SHA-256 · Tanpa data pribadi</span>
            </div>
          </div>

          {/* Right Panel: Login / Register Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-6">
              {/* Mode Switcher */}
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
                  className={`py-2.5 px-3 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                    mode === 'login'
                      ? 'bg-white text-[#1E3A8A] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LogIn className="w-4 h-4" aria-hidden="true" />
                  <span>Masuk</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'register'}
                  onClick={() => switchMode('register')}
                  className={`py-2.5 px-3 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                    mode === 'register'
                      ? 'bg-white text-[#1E3A8A] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className="w-4 h-4" aria-hidden="true" />
                  <span>Daftar Akun Baru</span>
                </button>
              </div>

              {mode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Masuk ke YukNgoding</h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Peran akun (Pembelajar atau Admin) terdeteksi otomatis saat masuk.
                    </p>
                  </div>

                  {loginSuccessNote && (
                    <div
                      role="status"
                      className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900"
                    >
                      {loginSuccessNote}
                    </div>
                  )}

                  {loginError && (
                    <div
                      role="alert"
                      className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800 font-medium"
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
                      placeholder="contoh: user1 atau admin"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
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
                        className="w-full pl-3.5 pr-11 py-2.5 text-sm border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
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
                    className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                  >
                    {loginSubmitting ? 'Memverifikasi...' : 'Masuk Sekarang'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4" noValidate>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Daftar Akun Pembelajar</h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Gunakan nama alias kreatif tanpa data pribadi. Akun baru otomatis berstatus Pembelajar.
                    </p>
                  </div>

                  {regError && (
                    <div
                      role="alert"
                      className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800 font-medium"
                    >
                      {regError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">3–18 karakter (non-pribadi)</p>
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
                        className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">Huruf kecil, angka, atau _</p>
                    </div>
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
                          placeholder="Minimal 4 karakter"
                          className="w-full pl-3.5 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
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
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={regSubmitting}
                    className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2"
                  >
                    {regSubmitting ? 'Membuat Akun...' : 'Buat Akun Pembelajar'}
                  </button>
                </form>
              )}
            </div>

            {/* Collapsible Demo Account Info Box */}
            <div className="border border-slate-200 rounded-xl bg-slate-50/80 overflow-hidden">
              <button
                type="button"
                onClick={() => setDemoOpen((prev) => !prev)}
                aria-expanded={demoOpen}
                className="w-full px-4 py-3 flex items-center justify-between gap-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              >
                <span className="inline-flex items-center gap-2">
                  <KeyRound className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" />
                  <span>Info Akun Demo (Bantuan Uji Coba)</span>
                </span>
                {demoOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" aria-hidden="true" />
                )}
              </button>

              {demoOpen && (
                <div className="px-4 pb-3.5 pt-1 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-[#1E3A8A]">User Demo (Pembelajar)</p>
                      <p className="font-mono text-slate-600 mt-0.5">
                        user1 / 1234
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fillDemo('user1', '1234')}
                      className="px-2.5 py-1.5 text-xs font-semibold text-[#2563EB] bg-blue-50 hover:bg-blue-100 rounded-md shrink-0 transition-colors"
                    >
                      Isi
                    </button>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-bold text-[#6D28D9]">Admin Default</p>
                      <p className="font-mono text-slate-600 mt-0.5">
                        admin / admin123
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fillDemo('admin', 'admin123')}
                      className="px-2.5 py-1.5 text-xs font-semibold text-[#7C3AED] bg-violet-50 hover:bg-violet-100 rounded-md shrink-0 transition-colors"
                    >
                      Isi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>YukNgoding · Belajar Koding Interaktif untuk Semua</span>
          <span>Penyimpanan lokal perangkat · Privasi terjaga</span>
        </div>
      </footer>
    </div>
  );
}
