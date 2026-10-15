import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

// Sin variables de entorno el cliente se crea con valores de relleno para no
// romper el CV Builder (público); las llamadas de auth simplemente fallan.
export const supabase = createClient(
  supabaseUrl || 'http://localhost:54321',
  supabaseKey || 'missing-anon-key',
  { auth: { flowType: 'pkce', persistSession: true, detectSessionInUrl: true } }
);

// Auth helpers
export const auth = {
  signUp: (email: string, password: string) =>
    supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/ats` },
    }),
  signIn: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),
  signInWithGoogle: () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/ats`,
        // Siempre mostrar el selector de cuentas de Google.
        queryParams: { prompt: 'select_account' },
      },
    }),
  signOut: () => supabase.auth.signOut(),
  getSession: () => supabase.auth.getSession(),
};
