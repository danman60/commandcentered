'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [subdomain, setSubdomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate subdomain
    if (!/^[a-z0-9-]+$/.test(subdomain)) {
      setError('Subdomain can only contain lowercase letters, numbers, and hyphens')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_name: companyName,
            subdomain: subdomain,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      alert('Check your email to confirm your account!')
      router.push('/login')
    } catch (err: any) {
      setError(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-slate-800 rounded-lg shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-cyan-400">
            CommandCentered
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Create your production company account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
                Company Name
              </label>
              <input
                id="company"
                name="company"
                type="text"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-600 bg-slate-700 placeholder-gray-400 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                placeholder="ACME Productions"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="subdomain" className="block text-sm font-medium text-gray-300 mb-1">
                Subdomain
              </label>
              <div className="flex items-center">
                <input
                  id="subdomain"
                  name="subdomain"
                  type="text"
                  required
                  className="appearance-none rounded-l relative block w-full px-3 py-2 border border-gray-600 bg-slate-700 placeholder-gray-400 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                  placeholder="acme"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase())}
                />
                <span className="inline-flex items-center px-3 py-2 rounded-r border border-l-0 border-gray-600 bg-slate-600 text-gray-300 text-sm">
                  .commandcentered.app
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-600 bg-slate-700 placeholder-gray-400 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                placeholder="admin@acme.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-600 bg-slate-700 placeholder-gray-400 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>

          <div className="text-center">
            <a
              href="/login"
              className="font-medium text-cyan-400 hover:text-cyan-300"
            >
              Already have an account? Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
