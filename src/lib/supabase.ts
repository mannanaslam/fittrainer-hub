// Use the official Supabase client from the integrations folder
import { supabase as officialClient } from '@/integrations/supabase/client';
import { Profile, Workout, MealPlan, Subscription } from '@/types/supabase';

// Re-export the official client to maintain backward compatibility
export const supabase = officialClient;

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

// Get all workouts with optional filtering by trainer or client
export async function getWorkouts(options?: { trainerId?: string; clientId?: string }): Promise<Workout[]> {
  try {
    let query = supabase.from('workouts').select('*');
    
    if (options?.trainerId) {
      query = query.eq('trainer_id', options.trainerId);
    }
    
    if (options?.clientId) {
      query = query.eq('client_id', options.clientId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching workouts:', error);
      return [];
    }
    
    return data as Workout[];
  } catch (error) {
    console.error('Error in getWorkouts:', error);
    return [];
  }
}

// Get a specific workout by ID
export async function getWorkoutById(workoutId: string): Promise<Workout | null> {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('id', workoutId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching workout by ID:', error);
      return null;
    }
    
    return data as Workout;
  } catch (error) {
    console.error('Error in getWorkoutById:', error);
    return null;
  }
}

// Create a new workout
export async function createWorkout(workout: Omit<Workout, 'id' | 'created_at'>): Promise<Workout | null> {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .insert(workout)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Error creating workout:', error);
      return null;
    }
    
    return data as Workout;
  } catch (error) {
    console.error('Error in createWorkout:', error);
    return null;
  }
}

// Get all meal plans with optional filtering by trainer or client
export async function getMealPlans(options?: { trainerId?: string; clientId?: string }): Promise<MealPlan[]> {
  try {
    let query = supabase.from('meal_plans').select('*');
    
    if (options?.trainerId) {
      query = query.eq('trainer_id', options.trainerId);
    }
    
    if (options?.clientId) {
      query = query.eq('client_id', options.clientId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching meal plans:', error);
      return [];
    }
    
    return data as MealPlan[];
  } catch (error) {
    console.error('Error in getMealPlans:', error);
    return [];
  }
}

// Get a specific meal plan by ID
export async function getMealPlanById(mealPlanId: string): Promise<MealPlan | null> {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('id', mealPlanId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching meal plan by ID:', error);
      return null;
    }
    
    return data as MealPlan;
  } catch (error) {
    console.error('Error in getMealPlanById:', error);
    return null;
  }
}

// Create a new meal plan
export async function createMealPlan(mealPlan: Omit<MealPlan, 'id' | 'created_at'>): Promise<MealPlan | null> {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .insert(mealPlan)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Error creating meal plan:', error);
      return null;
    }
    
    return data as MealPlan;
  } catch (error) {
    console.error('Error in createMealPlan:', error);
    return null;
  }
}

// Get all subscriptions with optional filtering by user
export async function getSubscriptions(userId?: string): Promise<Subscription[]> {
  try {
    let query = supabase.from('subscriptions').select('*');
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching subscriptions:', error);
      return [];
    }
    
    return data as Subscription[];
  } catch (error) {
    console.error('Error in getSubscriptions:', error);
    return [];
  }
}

// Create a new subscription
export async function createSubscription(subscription: Omit<Subscription, 'id' | 'created_at'>): Promise<Subscription | null> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscription)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Error creating subscription:', error);
      return null;
    }
    
    return data as Subscription;
  } catch (error) {
    console.error('Error in createSubscription:', error);
    return null;
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
