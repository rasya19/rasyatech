import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug log to identify what is actually being loaded
console.log("Supabase Debug - Full Env Keys:", Object.keys(import.meta.env));
console.log("Supabase Debug - URL from env:", supabaseUrl);
console.log("Supabase Debug - Key from env:", supabaseKey ? "Present" : "Missing");

if (!supabaseUrl || !supabaseKey) {
  console.error("CRITICAL: Missing Supabase configuration. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correctly set in the AI Studio Secrets panel.");
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
