'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Users, CircleDot, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems = [
  { href: '/chats', label: 'Chats', icon: MessageSquare },
  { href: '/status', label: 'Status', icon: CircleDot },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  if (isMobile) {
    return (
      <div className="flex h-screen flex-col bg-background">
        <main className="flex-1 overflow-y-auto">{children}</main>
        <footer className="sticky bottom-0 border-t bg-card">
          <nav className="flex items-center justify-around p-2">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link href={item.href} key={item.href}>
                  <div
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-md p-2 text-muted-foreground transition-colors',
                      isActive && 'text-primary'
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full">
      <aside className="flex h-full w-20 flex-col items-center justify-between border-r bg-card py-4">
        <div>
          <Link href="/chats">
            <div className="p-2">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                </svg>
            </div>
          </Link>
          <TooltipProvider>
            <nav className="mt-8 flex flex-col items-center gap-4">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link href={item.href}>
                        <div
                          className={cn(
                            'rounded-lg p-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                            isActive && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                          )}
                        >
                          <item.icon className="h-6 w-6" />
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </nav>
          </TooltipProvider>
        </div>
        <div>
            <Avatar>
              <AvatarImage src="https://picsum.photos/seed/0/200/200" alt="My Avatar" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
        </div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
