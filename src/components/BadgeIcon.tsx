import {
  Braces,
  CalendarCheck,
  Database,
  Gamepad2,
  Rocket,
  Terminal,
  Trophy,
} from 'lucide-react';
import { Achievement } from '../types';

interface BadgeIconProps {
  iconKey: Achievement['iconKey'];
  className?: string;
}

export function BadgeIcon({ iconKey, className = 'w-5 h-5' }: BadgeIconProps) {
  switch (iconKey) {
    case 'rocket':
      return <Rocket className={className} aria-hidden="true" />;
    case 'terminal':
      return <Terminal className={className} aria-hidden="true" />;
    case 'braces':
      return <Braces className={className} aria-hidden="true" />;
    case 'database':
      return <Database className={className} aria-hidden="true" />;
    case 'calendar':
      return <CalendarCheck className={className} aria-hidden="true" />;
    case 'gamepad':
      return <Gamepad2 className={className} aria-hidden="true" />;
    case 'trophy':
    default:
      return <Trophy className={className} aria-hidden="true" />;
  }
}
