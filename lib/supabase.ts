import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function signInWithEmail(email: string) {
  if (!supabase) return { error: { message: 'Supabase not configured' } };
  return supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}/carnival` } });
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function syncEntries(userId: string, entries: object[]) {
  if (!supabase) return;
  await supabase.from('journal_entries').upsert(
    entries.map((e: object) => ({ ...(e as Record<string, unknown>), user_id: userId })),
    { onConflict: 'id,user_id' }
  );
}
