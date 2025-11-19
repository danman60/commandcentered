import { redirect } from 'next/navigation'

export default async function Home() {
  // TEMPORARILY DISABLED AUTH FOR TESTING
  // Just redirect to dashboard
  redirect('/dashboard')
}
