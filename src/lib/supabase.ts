
import { createClient } from '@supabase/supabase-js';

// Use hardcoded values for direct connection to your Supabase project
// Note: For a production app, you would use environment variables
const supabaseUrl = 'https://njvryfjggmrpiwyhdkmh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qdnJ5ZmpnZ21ycGl3eWhka21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYyNzkzOTksImV4cCI6MjAxMTg1NTM5OX0.IgQ4N4RsWetWyIYE7rDwXbUA8OG_lyYZw2ZV4Iw4QU8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
