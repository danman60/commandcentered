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
    <header className="bg-gradient-to-r from-[rgba(6,182,212,0.15)] to-[rgba(168,85,247,0.15)] border-b border-[rgba(6,182,212,0.3)] px-8 py-6">
      <div className="flex items-center justify-between">
        {/* Left side - Page title */}
        <div className="flex items-center gap-4">
          <h1 className="text-[28px] font-bold bg-gradient-to-r from-cyan-600 to-purple-500 bg-clip-text text-transparent leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-400 ml-4">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right side - Search and User menu */}
        <div className="flex items-center gap-3">
          {/* Global Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search events, operators, gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2.5 bg-[rgba(71,85,105,0.3)] border border-[rgba(71,85,105,0.5)] rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
            />
          </div>

          {/* User Menu Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 bg-[rgba(71,85,105,0.3)] border border-[rgba(71,85,105,0.5)] rounded-lg text-sm font-medium text-slate-300 hover:bg-[rgba(71,85,105,0.5)] transition-all",
                isMenuOpen && "bg-[rgba(71,85,105,0.5)]"
              )}
            >
              <User className="w-4 h-4" />
              <span>Account</span>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform",
                isMenuOpen && "rotate-180"
              )} />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-600 rounded-lg shadow-lg overflow-hidden z-50">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      router.push('/dashboard/settings')
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <div className="border-t border-slate-700"></div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleLogout()
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-slate-700 transition-colors"
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
