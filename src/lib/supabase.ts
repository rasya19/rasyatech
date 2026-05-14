import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("CRITICAL: Missing Supabase configuration or placeholder detected. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correctly set in the AI Studio Secrets panel.");
}

// Check for "placeholder" or empty
const isValid = supabaseUrl && supabaseUrl !== 'placeholder' && supabaseAnonKey && supabaseAnonKey !== 'placeholder';

export const supabase = isValid
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
