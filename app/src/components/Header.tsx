'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Search, User, LogOut, Settings, ChevronDown } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <header className="tactical-glass border-b tactical-border px-8 py-6 relative overflow-hidden">
      <div className="tactical-scanline absolute inset-0 pointer-events-none opacity-30" />
      <div className="flex items-center justify-between relative z-10">
        {/* Left side - Page title */}
        <div className="flex items-center gap-4">
          <h1 className="text-[28px] font-bold tactical-heading">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-300 ml-4">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right side - Search and User menu */}
        <div className="flex items-center gap-3">
          {/* Global Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-green-400" style={{ filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.6))' }} />
            </div>
            <input
              type="text"
              placeholder="Search events, operators, gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2.5 tactical-glass border tactical-border rounded-lg text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:tactical-border-intense transition-all"
            />
          </div>

          {/* User Menu Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "tactical-button flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 transition-all",
                isMenuOpen && "tactical-border-intense"
              )}
            >
              <User className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.6))' }} />
              <span>Account</span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                isMenuOpen && "rotate-180"
              )} />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 tactical-card rounded-lg overflow-hidden z-50 animate-slide-up">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      router.push('/dashboard/settings')
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-200 hover:bg-green-500/10 hover:text-green-400 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <div className="border-t border-green-500/20"></div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleLogout()
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
