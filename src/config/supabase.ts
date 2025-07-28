import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema will be created via Supabase migration
export const initializeDatabase = async () => {
  // This function will be called to set up initial data
  console.log('Database initialized');
};