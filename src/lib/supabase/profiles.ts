
import { supabase } from './client';
import { Profile } from '@/types/supabase';

// Helper function to get the current user's profile
export async function getCurrentUserProfile(): Promise<Profile | null> {
  try {
    console.log("Getting current user profile...");
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log("No current user found");
      return null;
    }
    
    console.log("Found current user:", user.id);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    console.log("Retrieved profile:", data);
    return data as Profile;
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error);
    return null;
  }
}

// Helper function to get a user profile by ID
export async function getUserProfileById(userId: string): Promise<Profile | null> {
  try {
    console.log("Getting user profile by ID:", userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user profile by ID:', error);
      return null;
    }
    
    console.log("Retrieved profile by ID:", data);
    return data as Profile;
  } catch (error) {
    console.error('Error in getUserProfileById:', error);
    return null;
  }
}

// Get all clients (profiles with role 'client')
export async function getAllClients(): Promise<Profile[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'client');
    
    if (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
    
    return data as Profile[];
  } catch (error) {
    console.error('Error in getAllClients:', error);
    return [];
  }
}

// Helper function to create or update a user profile
export async function upsertUserProfile(profileData: Pick<Profile, 'id'> & Partial<Omit<Profile, 'id'>>): Promise<Profile | null> {
  try {
    if (!profileData.id) {
      console.error('Profile ID is required for upsert');
      return null;
    }
    
    console.log("Upserting profile:", profileData);
    
    // Ensure we have all required fields for the profile
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: profileData.id,
        email: profileData.email || '', // Provide a default empty string if email is not provided
        name: profileData.name || '',
        role: profileData.role || 'client', // Provide a default role if not provided
        ...profileData, // Include all other profile data
      })
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Error upserting user profile:', error);
      return null;
    }
    
    console.log("Profile upserted successfully:", data);
    return data as Profile;
  } catch (error) {
    console.error('Error in upsertUserProfile:', error);
    return null;
  }
}
