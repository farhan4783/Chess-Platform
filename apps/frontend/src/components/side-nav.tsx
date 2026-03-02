import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/useSidebar';
import { useLocation, Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/subnav-accordian';
import { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { type LucideIcon } from 'lucide-react';
import { useUser } from '@repo/store/useUser';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  color?: string;
  isChidren?: boolean;
  children?: NavItem[];
  badge?: string;
}

interface SideNavProps {
  items: NavItem[];
  setOpen?: (open: boolean) => void;
  className?: string;
}

export function SideNav({ items, setOpen, className }: SideNavProps) {
  const user = useUser();
  const location = useLocation();
  const { isOpen } = useSidebar();
  const [openItem, setOpenItem] = useState('');
  const [lastOpenItem, setLastOpenItem] = useState('');

  useEffect(() => {
    if (isOpen) {
      setOpenItem(lastOpenItem);
    } else {
      setLastOpenItem(openItem);
      setOpenItem('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <nav className="dark px-1.5 space-y-0.5">
      {items.map((item) =>
        item.isChidren ? (
          <Accordion
            type="single"
            collapsible
            className="space-y-0.5"
            key={item.title}
            value={openItem}
            onValueChange={setOpenItem}
          >
            <AccordionItem value={item.title} className="border-none">
              <AccordionTrigger
                className={cn(
                  'group relative flex h-10 items-center justify-between px-3 py-2 rounded-lg text-sm duration-200',
                  'text-gray-400 hover:text-white hover:bg-white/[0.06]',
                  'hover:no-underline'
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn('h-4 w-4 flex-shrink-0', item.color)} />
                  {isOpen && <span className={cn('text-sm font-medium', !isOpen && className)}>{item.title}</span>}
                </div>
                {isOpen && (
                  <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 text-gray-500 transition-transform duration-200" />
                )}
              </AccordionTrigger>
              <AccordionContent className="mt-0.5 space-y-0.5 pb-1 pl-3">
                {item.children?.map((child) => (
                  <Link
                    key={child.title}
                    to={child.href}
                    onClick={() => {
                      if (setOpen) setOpen(false);
                    }}
                    className={cn(
                      'group relative flex h-9 items-center gap-3 px-3 rounded-lg text-sm duration-200',
                      'text-gray-400 hover:text-white hover:bg-white/[0.06]',
                      location.pathname === child.href && 'nav-active text-white'
                    )}
                  >
                    <child.icon className={cn('h-4 w-4 flex-shrink-0', child.color)} />
                    {isOpen && <span className={cn('text-sm duration-200', !isOpen && className)}>{child.title}</span>}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <div
            key={item.title}
            hidden={(user && item.title === 'Login') || (!user && item.title === 'Logout') ? true : false}
          >
            <Link
              to={item.href}
              onClick={() => {
                if (setOpen) setOpen(false);
              }}
              className={cn(
                'group relative flex h-10 items-center gap-3 px-3 rounded-lg text-sm duration-200',
                'text-gray-400 hover:text-white hover:bg-white/[0.06]',
                location.pathname === item.href && 'nav-active text-white'
              )}
            >
              <item.icon
                className={cn(
                  'h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110',
                  item.color
                )}
              />
              {isOpen && (
                <span className={cn('text-sm font-medium duration-200', !isOpen && className)}>{item.title}</span>
              )}
              {isOpen && item.badge && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {item.badge}
                </span>
              )}
              {!isOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-gray-900 border border-white/10 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                  {item.title}
                </div>
              )}
            </Link>
          </div>
        )
      )}
    </nav>
  );
}
