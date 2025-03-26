
import { createClient } from '@supabase/supabase-js';

// Create a custom Supabase client with better error handling
const supabaseUrl = 'https://njvryfjggmrpiwyhdkmh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qdnJ5ZmpnZ21ycGl3eWhka21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYyNzkzOTksImV4cCI6MjAxMTg1NTM5OX0.IgQ4N4RsWetWyIYE7rDwXbUA8OG_lyYZw2ZV4Iw4QU8';

// Use additional options to handle CORS and network issues
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (url, options) => {
      // Add logging for debug purposes
      console.log('Supabase fetch:', url);
      return fetch(url, options);
    }
  }
});
