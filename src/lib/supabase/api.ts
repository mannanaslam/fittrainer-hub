import { supabase } from './supabase';
import type {
  User,
  UserProfile,
  WorkoutPlan,
  Exercise,
  DietPlan,
  Meal,
  Subscription,
  ClientProgress,
  WorkoutLog,
  Measurement,
  Goal,
} from '../types';

// Profile API
export const profileApi = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Workout Plan API
export const workoutPlanApi = {
  async createWorkoutPlan(plan: Omit<WorkoutPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkoutPlan> {
    const { data, error } = await supabase
      .from('workout_plans')
      .insert(plan)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getWorkoutPlans(trainerId: string): Promise<WorkoutPlan[]> {
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('trainer_id', trainerId);

    if (error) throw error;
    return data;
  },

  async getWorkoutPlan(id: string): Promise<WorkoutPlan> {
    const { data, error } = await supabase
      .from('workout_plans')
      .select('*, exercises(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateWorkoutPlan(id: string, updates: Partial<WorkoutPlan>): Promise<WorkoutPlan> {
    const { data, error } = await supabase
      .from('workout_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteWorkoutPlan(id: string): Promise<void> {
    const { error } = await supabase
      .from('workout_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Exercise API
export const exerciseApi = {
  async createExercise(exercise: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exercise> {
    const { data, error } = await supabase
      .from('exercises')
      .insert(exercise)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateExercise(id: string, updates: Partial<Exercise>): Promise<Exercise> {
    const { data, error } = await supabase
      .from('exercises')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteExercise(id: string): Promise<void> {
    const { error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Diet Plan API
export const dietPlanApi = {
  async createDietPlan(plan: Omit<DietPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<DietPlan> {
    const { data, error } = await supabase
      .from('diet_plans')
      .insert(plan)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getDietPlans(trainerId: string): Promise<DietPlan[]> {
    const { data, error } = await supabase
      .from('diet_plans')
      .select('*')
      .eq('trainer_id', trainerId);

    if (error) throw error;
    return data;
  },

  async getDietPlan(id: string): Promise<DietPlan> {
    const { data, error } = await supabase
      .from('diet_plans')
      .select('*, meals(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateDietPlan(id: string, updates: Partial<DietPlan>): Promise<DietPlan> {
    const { data, error } = await supabase
      .from('diet_plans')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteDietPlan(id: string): Promise<void> {
    const { error } = await supabase
      .from('diet_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Meal API
export const mealApi = {
  async createMeal(meal: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .insert(meal)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateMeal(id: string, updates: Partial<Meal>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteMeal(id: string): Promise<void> {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Subscription API
export const subscriptionApi = {
  async createSubscription(subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<Subscription> {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscription)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSubscriptions(userId: string): Promise<Subscription[]> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  },

  async updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription> {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Client Progress API
export const clientProgressApi = {
  async createClientProgress(progress: Omit<ClientProgress, 'id' | 'createdAt' | 'updatedAt'>): Promise<ClientProgress> {
    const { data, error } = await supabase
      .from('client_progress')
      .insert(progress)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getClientProgress(userId: string): Promise<ClientProgress> {
    const { data, error } = await supabase
      .from('client_progress')
      .select('*, workout_logs(*), measurements(*), goals(*)')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateClientProgress(id: string, updates: Partial<ClientProgress>): Promise<ClientProgress> {
    const { data, error } = await supabase
      .from('client_progress')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Workout Log API
export const workoutLogApi = {
  async createWorkoutLog(log: Omit<WorkoutLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkoutLog> {
    const { data, error } = await supabase
      .from('workout_logs')
      .insert(log)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getWorkoutLogs(clientProgressId: string): Promise<WorkoutLog[]> {
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*, workout_log_exercises(*)')
      .eq('client_progress_id', clientProgressId);

    if (error) throw error;
    return data;
  },
};

// Measurement API
export const measurementApi = {
  async createMeasurement(measurement: Omit<Measurement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Measurement> {
    const { data, error } = await supabase
      .from('measurements')
      .insert(measurement)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMeasurements(clientProgressId: string): Promise<Measurement[]> {
    const { data, error } = await supabase
      .from('measurements')
      .select('*')
      .eq('client_progress_id', clientProgressId);

    if (error) throw error;
    return data;
  },

  async updateMeasurement(id: string, updates: Partial<Measurement>): Promise<Measurement> {
    const { data, error } = await supabase
      .from('measurements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Goal API
export const goalApi = {
  async createGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .insert(goal)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getGoals(clientProgressId: string): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('client_progress_id', clientProgressId);

    if (error) throw error;
    return data;
  },

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
}; 