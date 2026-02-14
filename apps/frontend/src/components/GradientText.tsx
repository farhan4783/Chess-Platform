import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'gold' | 'success';
  className?: string;
  shimmer?: boolean;
}

export const GradientText = ({ children, variant = 'primary', className, shimmer = false }: GradientTextProps) => {
  const variants = {
    primary: 'text-gradient-primary',
    accent: 'text-gradient-accent',
    gold: 'text-gradient-gold',
    success: 'bg-gradient-to-r from-emerald-400 to-green-600 bg-clip-text text-transparent',
  };

  return (
    <span className={cn('font-bold', variants[variant], shimmer && 'animate-shimmer bg-[length:200%_100%]', className)}>
      {children}
    </span>
  );
};
