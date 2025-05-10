import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/supabase';

export type Workout = Database['public']['Tables']['workouts']['Row'];
export type CreateWorkoutData = Omit<Workout, 'id' | 'created_at'>;
export type UpdateWorkoutData = Partial<CreateWorkoutData>;

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
export async function createWorkout(workout: CreateWorkoutData): Promise<Workout | null> {
  try {
    console.log("Creating workout:", workout);
    const { data, error } = await supabase
      .from('workouts')
      .insert(workout)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Error creating workout:', error);
      return null;
    }
    
    console.log("Workout created successfully:", data);
    return data as Workout;
  } catch (error) {
    console.error('Error in createWorkout:', error);
    return null;
  }
}

// Update an existing workout
export async function updateWorkout(
  workoutId: string, 
  updates: Partial<Omit<Workout, 'id' | 'created_at'>>
): Promise<Workout | null> {
  try {
    const { data, error } = await supabase
      .from('workouts')
      .update(updates)
      .eq('id', workoutId)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Error updating workout:', error);
      return null;
    }
    
    return data as Workout;
  } catch (error) {
    console.error('Error in updateWorkout:', error);
    return null;
  }
}

// Delete a workout
export async function deleteWorkout(workoutId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('workouts')
      .delete()
      .eq('id', workoutId);
    
    if (error) {
      console.error('Error deleting workout:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteWorkout:', error);
    return false;
  }
}
