import { createClient } from '@supabase/supabase-js';

// These values should come from your Supabase project settings
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qluitvnalelaijihfheh.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsdWl0dm5hbGVsYWlqaWhmaGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMTA5MjgsImV4cCI6MjA3NTg4NjkyOH0.vM5vl2CewqTVsBpu8akENo_fATLzARy3U7y9E7-gsc0';

// Create a single supabase client for client-side use
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);