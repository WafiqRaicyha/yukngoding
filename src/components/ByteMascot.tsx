import { useId } from 'react';
import { ByteMood, getByteEvolution } from '../data/byteMascot';

interface ByteMascotProps {
  level: number;
  mood?: ByteMood;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-14 h-14 sm:w-16 sm:h-16',
  md: 'w-24 h-24 sm:w-28 sm:h-28',
  lg: 'w-28 h-28 sm:w-36 sm:h-36',
};

export function ByteMascot({
  level,
  mood = 'idle',
  size = 'md',
  className = '',
}: ByteMascotProps) {
  const uid = useId().replace(/:/g, '');
  const evolution = getByteEvolution(level);
  const stage = evolution.stage;

  const hasVisor = stage >= 2;
  const hasHeadset = stage >= 3;
  const hasOrbit = stage >= 4;
  const hasWizardCrown = stage >= 5;

  const bodyAnimClass =
    mood === 'celebrate'
      ? 'byte-anim-bounce'
      : mood === 'idle' || mood === 'hint'
        ? 'byte-anim-float'
        : 'byte-anim-float-soft';

  return (
    <svg
      viewBox="0 0 160 160"
      className={`select-none shrink-0 ${SIZE_CLASSES[size]} ${className}`}
      role="img"
      aria-label={`Maskot Byte tahap ${evolution.name} Level ${level} dengan ekspresi ${mood}`}
    >
      <defs>
        <radialGradient id={`bodyGrad-${uid}`} cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="52%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#7C3AED" />
        </radialGradient>

        <radialGradient id={`auraGrad-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={hasHeadset ? '#34D399' : '#60A5FA'} stopOpacity={hasHeadset ? '0.45' : '0.26'} />
          <stop offset="55%" stopColor="#7C3AED" stopOpacity={hasHeadset ? '0.26' : '0.14'} />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>

        <linearGradient id={`visorGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.48" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.22" />
        </linearGradient>

        <linearGradient id={`cloakGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4C1D95" />
          <stop offset="55%" stopColor="#6D28D9" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>

        <linearGradient id={`crownGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>

        <filter id={`softGlow-${uid}`} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation={hasHeadset ? '4' : '2.2'} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ground shadow (stays grounded while Byte floats) */}
      <ellipse
        cx="80"
        cy="144"
        rx={mood === 'celebrate' ? 22 : 28}
        ry="5.5"
        fill="#1E3A8A"
        opacity="0.14"
      />

      {/* Animated Byte Character Group */}
      <g className={bodyAnimClass}>
        {/* Layer: Ambient Glow Aura (intensifies at Level 3+) */}
        <g data-layer="aura" className={hasHeadset ? 'opacity-100' : 'opacity-75'}>
          <circle cx="80" cy="84" r={hasHeadset ? 58 : 48} fill={`url(#auraGrad-${uid})`} />
          {hasHeadset && (
            <circle
              cx="80"
              cy="84"
              r="45"
              fill="none"
              stroke="#34D399"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              opacity="0.55"
            />
          )}
        </g>

        {/* Layer: Level 5+ Mini Code Wizard Cloak (behind body) */}
        <g data-layer="cloak" className={hasWizardCrown ? 'opacity-100' : 'hidden'}>
          <path
            d="M42 92 C32 110, 30 128, 38 134 C54 128, 66 135, 80 135 C94 135, 106 128, 122 134 C130 128, 128 110, 118 92 Z"
            fill={`url(#cloakGrad-${uid})`}
            stroke="#FBBF24"
            strokeWidth="1.6"
          />
          <path
            d="M52 126 Q80 132 108 126"
            fill="none"
            stroke="#FDE047"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            opacity="0.8"
          />
        </g>

        {/* Layer: Level 4+ Orbiting Hologram Symbols < /> and {} */}
        <g data-layer="orbit" className={hasOrbit ? 'byte-anim-orbit' : 'hidden'}>
          <ellipse
            cx="80"
            cy="84"
            rx="62"
            ry="24"
            fill="none"
            stroke="#34D399"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.65"
            transform="rotate(-14 80 84)"
          />
          <g transform="translate(15, 72)">
            <rect x="0" y="0" width="28" height="17" rx="5" fill="#0F172A" fillOpacity="0.88" stroke="#34D399" strokeWidth="1.2" />
            <text x="14" y="12" textAnchor="middle" fill="#34D399" fontSize="9.5" fontWeight="700" fontFamily="monospace">
              &lt;/&gt;
            </text>
          </g>
          <g transform="translate(120, 84)">
            <rect x="0" y="0" width="24" height="17" rx="5" fill="#0F172A" fillOpacity="0.88" stroke="#A78BFA" strokeWidth="1.2" />
            <text x="12" y="12" textAnchor="middle" fill="#C4B5FD" fontSize="10" fontWeight="700" fontFamily="monospace">
              {'{}'}
            </text>
          </g>
          <circle cx="30" cy="112" r="2.6" fill="#34D399" />
          <circle cx="132" cy="56" r="2.6" fill="#60A5FA" />
        </g>

        {/* Layer: Base Wisp Body (All Levels) */}
        <g data-layer="body" filter={`url(#softGlow-${uid})`}>
          {/* Little energy wisp crest */}
          <path
            d="M72 47 C75 36, 86 35, 89 47"
            fill="#60A5FA"
            opacity="0.9"
          />
          {/* Main round glowing wisp orb */}
          <circle cx="80" cy="84" r="38" fill={`url(#bodyGrad-${uid})`} />
          {/* Inner glossy highlight */}
          <ellipse cx="66" cy="64" rx="12" ry="7" fill="#FFFFFF" opacity="0.22" transform="rotate(-24 66 64)" />
          {/* Neon green energy core ring at chin/chest */}
          <path
            d="M66 112 Q80 118 94 112"
            fill="none"
            stroke="#34D399"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>

        {/* Layer: Level 3+ Futuristic Gamer Headset */}
        <g data-layer="headset" className={hasHeadset ? 'opacity-100' : 'hidden'}>
          <path
            d="M41 80 A39 39 0 0 1 119 80"
            fill="none"
            stroke="#1E1B4B"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M43 79 A37 37 0 0 1 117 79"
            fill="none"
            stroke="#34D399"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Left & Right Earcups */}
          <rect x="34" y="72" width="11" height="24" rx="5" fill="#1E1B4B" stroke="#34D399" strokeWidth="1.6" />
          <rect x="115" y="72" width="11" height="24" rx="5" fill="#1E1B4B" stroke="#34D399" strokeWidth="1.6" />
          {/* Mic boom */}
          <path d="M40 94 Q46 105 60 105" fill="none" stroke="#1E1B4B" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="61" cy="105" r="2.8" fill="#34D399" />
        </g>

        {/* ==================== FACIAL EXPRESSION GROUPS ==================== */}

        {/* Mood: IDLE (Big expressive eyes with periodic blink) */}
        <g data-face="idle" className={mood === 'idle' ? 'opacity-100' : 'hidden'}>
          <g className="byte-anim-blink" style={{ transformOrigin: '80px 82px' }}>
            <ellipse cx="66" cy="82" rx="6.2" ry="7.4" fill="#0F172A" />
            <circle cx="64" cy="79.5" r="2.3" fill="#FFFFFF" />
            <circle cx="68.2" cy="84.5" r="1.1" fill="#34D399" />

            <ellipse cx="94" cy="82" rx="6.2" ry="7.4" fill="#0F172A" />
            <circle cx="92" cy="79.5" r="2.3" fill="#FFFFFF" />
            <circle cx="96.2" cy="84.5" r="1.1" fill="#34D399" />
          </g>
          {/* Gentle friendly smile */}
          <path
            d="M73 96 Q80 102 87 96"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>

        {/* Mood: CELEBRATE (Joyful ^ ^ eyes + big smile) */}
        <g data-face="celebrate" className={mood === 'celebrate' ? 'opacity-100' : 'hidden'}>
          <path
            d="M59 84 Q66 74 73 84"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M87 84 Q94 74 101 84"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Rosy digital cheeks */}
          <ellipse cx="56" cy="91" rx="4.5" ry="2.5" fill="#34D399" opacity="0.6" />
          <ellipse cx="104" cy="91" rx="4.5" ry="2.5" fill="#34D399" opacity="0.6" />
          <path
            d="M71 95 Q80 105 89 95"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </g>

        {/* Mood: ENCOURAGE (Soft supportive eyes & gentle reassuring curve) */}
        <g data-face="encourage" className={mood === 'encourage' ? 'opacity-100' : 'hidden'}>
          {/* Soft angled eyebrows */}
          <path d="M59 73 Q65 70 71 72" fill="none" stroke="#DBEAFE" strokeWidth="2" strokeLinecap="round" />
          <path d="M89 72 Q95 70 101 73" fill="none" stroke="#DBEAFE" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="66" cy="83" rx="5.5" ry="6.2" fill="#0F172A" />
          <circle cx="64.5" cy="80.8" r="2.1" fill="#FFFFFF" />
          <ellipse cx="94" cy="83" rx="5.5" ry="6.2" fill="#0F172A" />
          <circle cx="92.5" cy="80.8" r="2.1" fill="#FFFFFF" />
          <path
            d="M74 98 Q80 101 86 98"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.3"
            strokeLinecap="round"
          />
        </g>

        {/* Mood: HINT (Thinking upward eyes + small curious mouth) */}
        <g data-face="hint" className={mood === 'hint' ? 'opacity-100' : 'hidden'}>
          <ellipse cx="66" cy="82" rx="6" ry="7" fill="#0F172A" />
          <circle cx="68" cy="79" r="2.2" fill="#FFFFFF" />
          <ellipse cx="94" cy="82" rx="6" ry="7" fill="#0F172A" />
          <circle cx="96" cy="79" r="2.2" fill="#FFFFFF" />
          <circle cx="80" cy="97" r="3" fill="none" stroke="#FFFFFF" strokeWidth="2.2" />
        </g>

        {/* Layer: Level 2+ Transparent Neon Green Coding Visor (sits cleanly over eyes) */}
        <g data-layer="visor" className={hasVisor ? 'opacity-100' : 'hidden'}>
          <rect
            x="49"
            y="71"
            width="62"
            height="21"
            rx="8"
            fill={`url(#visorGrad-${uid})`}
            stroke="#34D399"
            strokeWidth="2"
          />
          <line x1="56" y1="76" x2="68" y2="76" stroke="#A7F3D0" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
          <line x1="96" y1="86" x2="105" y2="86" stroke="#A7F3D0" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
        </g>

        {/* Layer: Level 5+ Neon Gold-Violet Energy Crown */}
        <g data-layer="crown" className={hasWizardCrown ? 'opacity-100' : 'hidden'}>
          <path
            d="M61 48 L65 30 L74 40 L80 25 L86 40 L95 30 L99 48 Z"
            fill={`url(#crownGrad-${uid})`}
            stroke="#FFFFFF"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <circle cx="80" cy="24" r="2.8" fill="#FEF08A" />
          <circle cx="65" cy="29" r="2.1" fill="#C4B5FD" />
          <circle cx="95" cy="29" r="2.1" fill="#C4B5FD" />
        </g>

        {/* Effect Layer: Celebrate Star Sparkles */}
        <g data-fx="sparkles" className={mood === 'celebrate' ? 'byte-anim-sparkle' : 'hidden'}>
          <path d="M26 42 L28.5 48 L34.5 50.5 L28.5 53 L26 59 L23.5 53 L17.5 50.5 L23.5 48 Z" fill="#FBBF24" />
          <path d="M134 36 L136 41 L141 43 L136 45 L134 50 L132 45 L127 43 L132 41 Z" fill="#34D399" />
          <path d="M130 108 L131.5 111.5 L135 113 L131.5 114.5 L130 118 L128.5 114.5 L125 113 L128.5 111.5 Z" fill="#A78BFA" />
        </g>

        {/* Effect Layer: Hint Lightbulb Idea Icon */}
        <g data-fx="lightbulb" className={mood === 'hint' ? 'byte-anim-bulb' : 'hidden'} transform="translate(115, 18)">
          <circle cx="14" cy="14" r="14" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.6" />
          <path
            d="M14 6 A6 6 0 0 0 10.5 16.9 V19 H17.5 V16.9 A6 6 0 0 0 14 6 Z"
            fill="#FBBF24"
            stroke="#B45309"
            strokeWidth="1.2"
          />
          <line x1="11.5" y1="21.5" x2="16.5" y2="21.5" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

interface ByteCompanionProps {
  level: number;
  mood: ByteMood;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ByteCompanion({
  level,
  mood,
  message,
  actionLabel,
  onAction,
}: ByteCompanionProps) {
  const evo = getByteEvolution(level);

  const bubbleTone = {
    idle: 'bg-slate-50 border-slate-200 text-slate-700',
    celebrate: 'bg-emerald-50 border-emerald-200 text-emerald-950',
    encourage: 'bg-amber-50 border-amber-200 text-amber-950',
    hint: 'bg-blue-50 border-blue-200 text-slate-900',
  }[mood];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <ByteMascot level={level} mood={mood} size="sm" />
        <div className={`flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm leading-relaxed ${bubbleTone}`}>
          <div className="text-[11px] font-semibold text-slate-500 mb-0.5">
            {evo.name} · Level {level}
          </div>
          <p role="status" aria-live="polite" className="font-medium">
            {message}
          </p>
        </div>
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-3.5 py-2 text-xs font-semibold text-[#1E3A8A] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
