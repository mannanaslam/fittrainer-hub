
// Use the official Supabase client from the integrations folder
import { supabase as officialClient } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';

// Re-export the official client to maintain backward compatibility
export const supabase = officialClient;

// Helper function to get the current user's profile
export async function getCurrentUserProfile(): Promise<Profile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error);
    return null;
  }
}

// Helper function to get a user profile by ID
export async function getUserProfileById(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile by ID:', error);
      return null;
    }
    
    return data as Profile;
  } catch (error) {
    console.error('Error in getUserProfileById:', error);
    return null;
  }
}
