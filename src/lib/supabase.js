// feat/supabase-client — M3: Gabriel Antonino
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error(
    'Missing Supabase env vars. Copy .env.example → .env and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

/** Single Supabase client instance — never call createClient() anywhere else. */
export const supabase = createClient(url, key);
