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
    <div className="flex flex-col w-64 bg-slate-800 border-r border-slate-700">
      <div className="flex items-center justify-center h-16 border-b border-slate-700">
        <h1 className="text-xl font-bold text-cyan-400">CommandCentered</h1>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-cyan-600 text-white'
                  : 'text-gray-300 hover:bg-slate-700 hover:text-white'
              )}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-slate-700">
        {user && (
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-cyan-400" />
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
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-300 bg-slate-700 rounded-md hover:bg-slate-600 hover:text-white transition-colors"
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
