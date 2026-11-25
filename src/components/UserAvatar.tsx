import { AvatarId } from '../types';
import { ByteMascot } from './ByteMascot';

export interface AvatarOption {
  id: AvatarId;
  label: string;
  description: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'byte-mascot', label: 'Maskot Byte', description: 'Mengikuti evolusi levelmu saat ini' },
  { id: 'avatar-wizard', label: 'Code Wizard', description: 'Topi penyihir algoritma neon' },
  { id: 'avatar-cyber', label: 'Cyber Visor', description: 'Kacamata visor futuristik' },
  { id: 'avatar-rocket', label: 'Orbit Launch', description: 'Roket eksplorasi kode' },
  { id: 'avatar-terminal', label: 'Shell Pro', description: 'Ikon terminal baris perintah' },
  { id: 'avatar-circuit', label: 'Logic Node', description: 'Sirkuit gerbang logika' },
  { id: 'avatar-shield', label: 'Data Guard', description: 'Perisai analis data' },
];

interface UserAvatarProps {
  avatar: AvatarId;
  level: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const CONTAINER_SIZES: Record<'xs' | 'sm' | 'md' | 'lg', string> = {
  xs: 'w-7 h-7',
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
};

export function UserAvatar({
  avatar,
  level,
  size = 'md',
  className = '',
}: UserAvatarProps) {
  if (avatar === 'byte-mascot') {
    const byteClass =
      size === 'xs'
        ? '!w-7 !h-7'
        : size === 'sm'
          ? '!w-10 !h-10'
          : size === 'md'
            ? '!w-16 !h-16'
            : '!w-24 !h-24';
    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 ${CONTAINER_SIZES[size]} ${className}`}
      >
        <ByteMascot level={level} mood="idle" size="sm" className={byteClass} />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl overflow-hidden shrink-0 ${CONTAINER_SIZES[size]} ${className}`}
    >
      <svg
        viewBox="0 0 80 80"
        className="w-full h-full block"
        role="img"
        aria-label={`Avatar ${AVATAR_OPTIONS.find((o) => o.id === avatar)?.label ?? 'Pengguna'}`}
      >
        {avatar === 'avatar-wizard' && (
          <>
            <rect width="80" height="80" rx="16" fill="#4C1D95" />
            <circle cx="40" cy="48" r="22" fill="#6D28D9" opacity="0.55" />
            <path d="M16 54 Q40 44 64 54 L58 60 Q40 53 22 60 Z" fill="#A855F7" />
            <path d="M24 52 L40 16 L56 52 Z" fill="#7C3AED" stroke="#FDE047" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M38 30 L40 35 L45 36.5 L40 38 L38 43 L36 38 L31 36.5 L36 35 Z" fill="#FDE047" />
            <circle cx="23" cy="24" r="2.5" fill="#34D399" />
            <circle cx="60" cy="28" r="2" fill="#60A5FA" />
          </>
        )}

        {avatar === 'avatar-cyber' && (
          <>
            <rect width="80" height="80" rx="16" fill="#0F172A" />
            <circle cx="40" cy="42" r="23" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="2" />
            <rect x="18" y="32" width="44" height="16" rx="7" fill="#10B981" fillOpacity="0.35" stroke="#34D399" strokeWidth="2.5" />
            <line x1="25" y1="38" x2="35" y2="38" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" />
            <path d="M33 54 Q40 59 47 54" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {avatar === 'avatar-rocket' && (
          <>
            <rect width="80" height="80" rx="16" fill="#1E3A8A" />
            <circle cx="20" cy="22" r="2" fill="#93C5FD" />
            <circle cx="62" cy="18" r="2.5" fill="#34D399" />
            <circle cx="60" cy="56" r="2" fill="#C4B5FD" />
            <path d="M40 16 C51 24, 54 38, 50 52 L30 52 C26 38, 29 24, 40 16 Z" fill="#FFFFFF" />
            <circle cx="40" cy="34" r="6" fill="#2563EB" stroke="#93C5FD" strokeWidth="2" />
            <path d="M30 45 L21 56 L31 53 Z" fill="#7C3AED" />
            <path d="M50 45 L59 56 L49 53 Z" fill="#7C3AED" />
            <path d="M35 53 L40 65 L45 53 Z" fill="#F59E0B" />
          </>
        )}

        {avatar === 'avatar-terminal' && (
          <>
            <rect width="80" height="80" rx="16" fill="#0F172A" />
            <rect x="12" y="16" width="56" height="48" rx="8" fill="#1E293B" stroke="#334155" strokeWidth="2" />
            <circle cx="21" cy="24" r="2.5" fill="#EF4444" />
            <circle cx="29" cy="24" r="2.5" fill="#F59E0B" />
            <circle cx="37" cy="24" r="2.5" fill="#10B981" />
            <path d="M22 39 L31 45 L22 51" fill="none" stroke="#34D399" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="36" y1="51" x2="54" y2="51" stroke="#60A5FA" strokeWidth="3.2" strokeLinecap="round" />
          </>
        )}

        {avatar === 'avatar-circuit' && (
          <>
            <rect width="80" height="80" rx="16" fill="#064E3B" />
            <path d="M18 28 H34 V40 H46 V28 H62" fill="none" stroke="#34D399" strokeWidth="2.5" />
            <path d="M18 52 H34 V40 H46 V52 H62" fill="none" stroke="#60A5FA" strokeWidth="2.5" />
            <rect x="30" y="30" width="20" height="20" rx="5" fill="#10B981" stroke="#ECFDF5" strokeWidth="2" />
            <circle cx="18" cy="28" r="4" fill="#A7F3D0" />
            <circle cx="62" cy="28" r="4" fill="#A7F3D0" />
            <circle cx="18" cy="52" r="4" fill="#93C5FD" />
            <circle cx="62" cy="52" r="4" fill="#93C5FD" />
          </>
        )}

        {avatar === 'avatar-shield' && (
          <>
            <rect width="80" height="80" rx="16" fill="#1D4ED8" />
            <path
              d="M40 14 L60 22 V40 C60 53, 51 62, 40 67 C29 62, 20 53, 20 40 V22 Z"
              fill="#FFFFFF"
              fillOpacity="0.16"
              stroke="#93C5FD"
              strokeWidth="2.5"
            />
            <path
              d="M31 41 L37.5 47.5 L50 33.5"
              fill="none"
              stroke="#34D399"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
      </svg>
    </div>
  );
}
