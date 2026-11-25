import { ChevronDown, LogOut, Shield, User as UserIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TabId, UserAccount } from '../types';
import { UserAvatar } from './UserAvatar';

interface NavbarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  currentUser: UserAccount;
  onLogout: () => void;
}

const BASE_NAV_ITEMS: { id: TabId; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'materi', label: 'Materi' },
  { id: 'simulasi', label: 'Simulasi' },
  { id: 'daily', label: 'Harian' },
  { id: 'leaderboard', label: 'Peringkat' },
  { id: 'profile', label: 'Profile' },
];

export function Navbar({
  activeTab,
  onSelectTab,
  currentUser,
  onLogout,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems =
    currentUser.role === 'admin'
      ? [...BASE_NAV_ITEMS, { id: 'admin' as TabId, label: 'Admin' }]
      : BASE_NAV_ITEMS;

  useEffect(() => {
    if (!menuOpen) return;
    function handleOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab(currentUser.role === 'admin' ? 'admin' : 'dashboard')}
          className="text-lg sm:text-xl font-extrabold tracking-tight text-[#1E3A8A] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 rounded-md"
        >
          YukNgoding
        </button>

        {/* Zone 2: Desktop Single-Line Navigation Links */}
        <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isAdminLink = item.id === 'admin';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 rounded-sm ${
                  isActive
                    ? isAdminLink
                      ? 'text-[#7C3AED] font-semibold'
                      : 'text-[#2563EB] font-semibold'
                    : isAdminLink
                      ? 'text-[#6D28D9] hover:text-[#4C1D95]'
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-[17px] h-0.5 ${
                      isAdminLink ? 'bg-[#7C3AED]' : 'bg-[#2563EB]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Profile Dropdown Action */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 text-sm font-medium text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
          >
            <UserAvatar
              avatar={currentUser.profile.avatar}
              level={currentUser.gamifikasi.level}
              size="xs"
            />
            <span className="max-w-[116px] truncate">{currentUser.profile.namaAlias}</span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-150 ${
                menuOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              aria-label="Menu akun pengguna"
              className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50"
            >
              <div className="px-3.5 py-2 border-b border-slate-100">
                <div className="text-sm font-bold text-slate-900 truncate">
                  {currentUser.profile.namaAlias}
                </div>
                <div className="text-xs text-slate-500 font-mono truncate mt-0.5">
                  @{currentUser.username} ·{' '}
                  <span
                    className={
                      currentUser.role === 'admin'
                        ? 'text-[#7C3AED] font-semibold'
                        : 'text-[#2563EB] font-semibold'
                    }
                  >
                    {currentUser.role === 'admin' ? 'Admin' : 'Learner'}
                  </span>
                </div>
              </div>

              <div className="py-1 px-1 space-y-0.5">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onSelectTab('profile');
                  }}
                  className="w-full px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#2563EB] shrink-0" aria-hidden="true" />
                  <span>Lihat Profile &amp; Pengaturan</span>
                </button>

                {currentUser.role === 'admin' && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onSelectTab('admin');
                    }}
                    className="w-full px-2.5 py-2 text-left text-xs font-medium text-[#6D28D9] hover:bg-violet-50 rounded-lg inline-flex items-center gap-2 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Panel Admin</span>
                  </button>
                )}
              </div>

              <div className="border-t border-slate-100 pt-1 px-1">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full px-2.5 py-2 text-left text-xs font-medium text-red-700 hover:bg-red-50 rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compact Mobile Horizontal Scroll Navigation */}
      <nav
        aria-label="Navigasi mobile"
        className="md:hidden border-t border-slate-100 px-4 flex items-center gap-5 overflow-x-auto no-scrollbar h-10"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isAdminLink = item.id === 'admin';
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative h-full inline-flex items-center text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? isAdminLink
                    ? 'text-[#7C3AED] font-semibold'
                    : 'text-[#2563EB] font-semibold'
                  : 'text-slate-600'
              }`}
            >
              {item.label}
              {isActive && (
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-0.5 ${
                    isAdminLink ? 'bg-[#7C3AED]' : 'bg-[#2563EB]'
                  }`}
                />
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
