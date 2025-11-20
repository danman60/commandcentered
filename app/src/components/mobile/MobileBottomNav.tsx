'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  Calendar,
  Users,
  Package,
  MessageSquare,
  LayoutDashboard,
  FileText,
  Briefcase,
} from 'lucide-react';

/**
 * Mobile Bottom Navigation
 *
 * Sticky bottom navigation bar for mobile devices
 * Shows key dashboard pages with icons and labels
 */
export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      color: 'text-green-400',
      activeColor: 'text-green-400',
    },
    {
      name: 'Planning',
      icon: Calendar,
      path: '/planning',
      color: 'text-green-400',
      activeColor: 'text-green-400',
    },
    {
      name: 'Pipeline',
      icon: Briefcase,
      path: '/pipeline',
      color: 'text-green-400',
      activeColor: 'text-green-400',
    },
    {
      name: 'Operators',
      icon: Users,
      path: '/operators',
      color: 'text-green-400',
      activeColor: 'text-green-400',
    },
    {
      name: 'Deliverables',
      icon: FileText,
      path: '/deliverables',
      color: 'text-green-400',
      activeColor: 'text-green-400',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-green-500/20 z-50 md:hidden">
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-lg transition-all ${
                isActive
                  ? `bg-green-500/20 ${item.activeColor}`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? item.activeColor : ''}`} />
              <span className="text-xs font-medium truncate w-full text-center">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
