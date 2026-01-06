import { PuzzleIcon, LogInIcon, LogOutIcon, SettingsIcon, GraduationCapIcon, EyeIcon, MonitorIcon } from 'lucide-react';
const BACKEND_URL =
  import.meta.env.VITE_APP_BACKEND_URL ?? 'http://localhost:3000';
export const UpperNavItems = [
  {
    title: 'Play',
    icon: PuzzleIcon,
    href: '/game/random',
    color: 'text-green-500',
  },
  {
    title: 'vs Computer',
    icon: MonitorIcon,
    href: '/game/ai',
    color: 'text-orange-500',
  },
  {
    title: 'Analysis',
    icon: EyeIcon,
    href: '/analysis',
    color: 'text-blue-500',
  },
  {
    title: 'Learn',
    icon: GraduationCapIcon,
    href: '/learn',
    color: 'text-purple-500',
  },
];

export const LowerNavItems = [
  {
    title: 'Login',
    icon: LogInIcon,
    href: '/login',
    color: 'text-green-500',
  },
  {
    title: 'Logout',
    icon: LogOutIcon,
    href: `${BACKEND_URL}/auth/logout`,
    color: 'text-green-500',
  },
  {
    title: 'Settings',
    icon: SettingsIcon,
    href: '/settings',
    color: 'text-green-500',
  },
];
