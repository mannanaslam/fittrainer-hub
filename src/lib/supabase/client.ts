
// Re-export the official client from the integrations folder
import { supabase as officialClient } from '@/integrations/supabase/client';

// Export the official client
export const supabase = officialClient;
