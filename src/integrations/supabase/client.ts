
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fmdclgkyklcnyxnzfigr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtZGNsZ2t5a2xjbnl4bnpmaWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNTgzMTUsImV4cCI6MjA2MTYzNDMxNX0.ZuKutB-8EE4N2yjKW1H_RUg5G9zQyswVfLEir4s7A2U";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
