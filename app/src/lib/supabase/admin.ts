import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Admin Client
 *
 * Uses service role key for admin operations like:
 * - Creating auth users
 * - Bypassing RLS policies
 * - Administrative tasks
 *
 * IMPORTANT: Only use server-side, never expose to client
 */

let _supabaseAdmin: SupabaseClient | null = null;

/**
 * Get Supabase Admin client with lazy initialization
 * Throws error only when actually used, not at module load time
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) {
    return _supabaseAdmin;
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === 'placeholder') {
    throw new Error(
      'Missing or placeholder SUPABASE_SERVICE_ROLE_KEY environment variable.\n' +
      'Get the service role key from Supabase Dashboard > Settings > API > service_role key\n' +
      'Add it to app/.env.local: SUPABASE_SERVICE_ROLE_KEY="your-actual-key-here"'
    );
  }

  _supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  return _supabaseAdmin;
}

/**
 * Admin client with service role privileges
 * Can bypass RLS and perform admin operations
 *
 * Note: This is a getter that lazily initializes the client
 */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseAdmin() as any)[prop];
  },
});
