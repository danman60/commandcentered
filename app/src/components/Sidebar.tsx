'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
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
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Planning', href: '/dashboard/planning', icon: Calendar },
  { name: 'Pipeline', href: '/dashboard/pipeline', icon: TrendingUp },
  { name: 'Gear Inventory', href: '/dashboard/gear', icon: Package },
  { name: 'Operators', href: '/dashboard/operators', icon: Users },
  { name: 'Deliverables', href: '/dashboard/deliverables', icon: FileText },
  { name: 'Communications', href: '/dashboard/communications', icon: MessageSquare },
  { name: 'Files & Assets', href: '/dashboard/files', icon: FolderOpen },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'Operator Portal', href: '/dashboard/operator-portal', icon: UserCircle },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

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
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-slate-700 p-4">
        <div className="text-xs text-gray-400">
          <p>StreamStage</p>
          <p className="text-cyan-400 mt-1">streamstage.commandcentered.app</p>
        </div>
      </div>
    </div>
  )
}
