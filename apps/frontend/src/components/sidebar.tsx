import { useEffect } from 'react';
import { SideNav } from '@/components/side-nav';
import { UpperNavItems, LowerNavItems } from '@/components/constants/side-nav';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/useSidebar';
import { useUser } from '@repo/store/useUser';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { isOpen, toggle } = useSidebar();
  const user = useUser();

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const isBetweenMDAndLG = screenWidth >= 768 && screenWidth < 1024;
      if (isBetweenMDAndLG) {
        if (isOpen) toggle();
      } else {
        if (!isOpen) toggle();
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, toggle]);

  return (
    <nav
      className={cn(
        `relative hidden h-screen md:flex flex-col pt-0 top-0 sticky
         transition-all duration-300 ease-in-out overflow-hidden
         border-r border-white/[0.06]
         w-14 lg:w-52`,
        className
      )}
      style={{
        background: 'linear-gradient(180deg, #0f0f1a 0%, #12101f 50%, #0d0d18 100%)',
      }}
    >
      {/* Top logo area */}
      <div className="flex items-center gap-3 px-3 py-4 border-b border-white/[0.06]">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-lg shadow-glow"
          style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
        >
          ♞
        </div>
        {isOpen && (
          <div className="animate-fade-in overflow-hidden whitespace-nowrap">
            <span
              className="text-lg font-black tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #667eea, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ChessAI
            </span>
            <div className="text-[9px] text-purple-400/60 font-medium tracking-widest uppercase -mt-0.5">Platform</div>
          </div>
        )}
      </div>

      {/* Main nav items */}
      <div className="flex flex-col flex-1 justify-between pt-2 pb-2 overflow-y-auto no-scrollbar">
        <div>
          <SideNav className="opacity-0 transition-all duration-300 group-hover:opacity-100" items={UpperNavItems} />
        </div>

        {/* Bottom nav + user */}
        <div className="flex flex-col gap-1">
          <div className="h-px bg-white/[0.06] mx-3 mb-2" />
          <SideNav className="opacity-0 transition-all duration-300 group-hover:opacity-100" items={LowerNavItems} />

          {/* User badge */}
          {user && (
            <div className="mx-2 mt-2 mb-1">
              <div
                className="rounded-xl p-2 border border-white/[0.08] flex items-center gap-2"
                style={{ background: 'rgba(102,126,234,0.08)' }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                >
                  {(user.name?.[0] ?? 'U').toUpperCase()}
                </div>
                {isOpen && (
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-white truncate max-w-[100px]">
                      {user.name ?? 'Player'}
                    </div>
                    <div className="text-[10px] text-purple-400/70">{user.isGuest ? 'Guest' : 'Member'}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
