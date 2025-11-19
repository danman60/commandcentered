import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Debug logging - remove after fixing
  console.log('Supabase URL:', url)
  console.log('Supabase Key (first 20 chars):', key?.substring(0, 20))

  return createBrowserClient(url, key)
}
