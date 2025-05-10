import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type TrainerProfile = Database['public']['Tables']['trainer_profiles']['Row'];
export type ClientProfile = Database['public']['Tables']['client_profiles']['Row'];

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
export async function getAllClients() {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      client_profiles (*)
    `)
    .eq('role', 'client')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Get all trainers (profiles with role 'trainer')
export async function getAllTrainers() {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      trainer_profiles (*)
    `)
    .eq('role', 'trainer')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Get a profile by ID
export async function getProfileById(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      trainer_profiles (*),
      client_profiles (*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
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

// Get health metrics for a user
export async function getUserHealthMetrics(userId: string): Promise<HealthMetric[]> {
  try {
    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching health metrics:', error);
      return [];
    }
    
    return data as HealthMetric[];
  } catch (error) {
    console.error('Error in getUserHealthMetrics:', error);
    return [];
  }
}

// Add a new health metric record
export async function addHealthMetric(metricData: Omit<HealthMetric, 'id' | 'recorded_at'>): Promise<HealthMetric | null> {
  try {
    const { data, error } = await supabase
      .from('health_metrics')
      .insert(metricData)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding health metric:', error);
      return null;
    }
    
    return data as HealthMetric;
  } catch (error) {
    console.error('Error in addHealthMetric:', error);
    return null;
  }
}

// Update a health metric record
export async function updateHealthMetric(id: string, metricData: Partial<Omit<HealthMetric, 'id' | 'user_id'>>): Promise<HealthMetric | null> {
  try {
    const { data, error } = await supabase
      .from('health_metrics')
      .update(metricData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating health metric:', error);
      return null;
    }
    
    return data as HealthMetric;
  } catch (error) {
    console.error('Error in updateHealthMetric:', error);
    return null;
  }
}

// Delete a health metric record
export async function deleteHealthMetric(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('health_metrics')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting health metric:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteHealthMetric:', error);
    return false;
  }
}

// Update a profile
export async function updateProfile(id: string, profile: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update a trainer profile
export async function updateTrainerProfile(id: string, profile: Partial<TrainerProfile>) {
  const { data, error } = await supabase
    .from('trainer_profiles')
    .update(profile)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update a client profile
export async function updateClientProfile(id: string, profile: Partial<ClientProfile>) {
  const { data, error } = await supabase
    .from('client_profiles')
    .update(profile)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
