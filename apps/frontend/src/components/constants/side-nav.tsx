import {
  PuzzleIcon,
  LogInIcon,
  LogOutIcon,
  SettingsIcon,
  GraduationCapIcon,
  EyeIcon,
  MonitorIcon,
  UserIcon,
  Zap,
} from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL ?? 'http://localhost:3000';

export const UpperNavItems = [
  {
    title: 'Play',
    icon: PuzzleIcon,
    href: '/game/random',
    color: 'text-emerald-400',
    badge: 'Live',
  },
  {
    title: 'vs Computer',
    icon: MonitorIcon,
    href: '/game/ai',
    color: 'text-orange-400',
  },
  {
    title: 'Puzzles',
    icon: Zap,
    href: '/puzzles',
    color: 'text-yellow-400',
    badge: 'New',
  },
  {
    title: 'Analysis',
    icon: EyeIcon,
    href: '/analysis',
    color: 'text-blue-400',
  },
  {
    title: 'Learn',
    icon: GraduationCapIcon,
    href: '/learn',
    color: 'text-purple-400',
  },
];

export const LowerNavItems = [
  {
    title: 'Profile',
    icon: UserIcon,
    href: '/profile',
    color: 'text-cyan-400',
  },
  {
    title: 'Login',
    icon: LogInIcon,
    href: '/login',
    color: 'text-green-400',
  },
  {
    title: 'Logout',
    icon: LogOutIcon,
    href: `${BACKEND_URL}/auth/logout`,
    color: 'text-red-400',
  },
  {
    title: 'Settings',
    icon: SettingsIcon,
    href: '/settings',
    color: 'text-gray-400',
  },
];
