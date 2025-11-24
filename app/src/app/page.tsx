import { redirect } from 'next/navigation'
// import { createClient } from '@/lib/supabase/server'

// TEMPORARILY DISABLED AUTH FOR TESTING
export default async function Home() {
  // const supabase = await createClient()
  // const { data: { session } } = await supabase.auth.getSession()

  // if (session) {
  //   // User is authenticated, redirect to dashboard
  //   redirect('/dashboard')
  // } else {
  //   // User is not authenticated, redirect to login
  //   redirect('/login')
  // }

  // Always redirect to dashboard (auth disabled)
  redirect('/dashboard')
}
