import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth helpers
export const auth = {
  signUp: (email: string, password: string) =>
    supabase.auth.signUp({ email, password }),
  signIn: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),
  signOut: () => supabase.auth.signOut(),
  getSession: () => supabase.auth.getSession(),
};

// Database queries
export const db = {
  jobs: {
    getAll: () => supabase.from('jobs').select('*'),
    getById: (id: string) =>
      supabase.from('jobs').select('*').eq('id', id).single(),
    getSaved: () =>
      supabase.from('saved_jobs').select('*, jobs(*)'),
  },
  users: {
    getProfile: () =>
      supabase.from('profiles').select('*').single(),
    updateProfile: (data: Record<string, unknown>) =>
      supabase.from('profiles').update(data),
  },
  matches: {
    getMatches: () =>
      supabase.from('matches').select('*, jobs(*)'),
  },
};
