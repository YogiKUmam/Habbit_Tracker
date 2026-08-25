import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = (): boolean => {
  try {
    return Boolean(
      supabaseUrl && 
      supabaseAnonKey && 
      supabaseUrl.startsWith('http') &&
      !supabaseUrl.includes('your-project-id') &&
      !supabaseAnonKey.includes('your-anon-public-key')
    );
  } catch {
    return false;
  }
};

let client: SupabaseClient | null = null;
if (isSupabaseConfigured()) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (e) {
    console.warn('Supabase initialization failed:', e);
    client = null;
  }
}

export const supabase: SupabaseClient | null = client;
