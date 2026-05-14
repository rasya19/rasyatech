import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("CRITICAL: Missing Supabase configuration or placeholder detected. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correctly set in the AI Studio Secrets panel.");
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);
