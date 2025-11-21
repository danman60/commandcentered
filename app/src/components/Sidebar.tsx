'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth/AuthProvider'
import {
  Calendar,
  LayoutDashboard,
  Users,
  Package,
  FileText,
  MessageSquare,
  Settings,
  TrendingUp,
  BarChart3,
  FolderOpen,
  Wrench,
  UserCircle,
  LogOut,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Planning', href: '/planning', icon: '📅' },
  { name: 'Pipeline', href: '/pipeline', icon: '⚡' },
  { name: 'Gear Inventory', href: '/gear', icon: '🎥' },
  { name: 'Operators', href: '/operators', icon: '👥' },
  { name: 'Deliverables', href: '/deliverables', icon: '📦' },
  { name: 'Communications', href: '/communications', icon: '💬' },
  { name: 'Files & Assets', href: '/files', icon: '📁' },
  { name: 'Reports', href: '/reports', icon: '📈' },
  { name: 'Operator Portal', href: '/operator-portal', icon: '👤' },
  { name: 'Settings', href: '/settings', icon: '🔧' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <div className="flex flex-col w-64 bg-slate-800 border-r border-slate-700 relative overflow-hidden">
      {/* Animated gridlines overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 tactical-grid-overlay" />
        <div className="tactical-scanline" />
      </div>

      <div className="flex items-center justify-center h-16 border-b border-slate-700 relative z-10">
        <h1 className="text-xl font-bold tactical-heading">CommandCentered</h1>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto relative z-10">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all',
                isActive
                  ? 'tactical-button-primary'
                  : 'text-gray-300 hover:bg-green-500/10 hover:text-green-400'
              )}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-green-500/20 relative z-10">
        {user && (
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-full tactical-glass tactical-border flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-green-400" style={{ filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.6))' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.user_metadata?.company_name || 'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="w-full tactical-button flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
