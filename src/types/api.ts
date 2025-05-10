import type { Workout, MealPlan, Subscription } from './supabase';

export type Exercise = {
  id: string;
  name: string;
  description: string;
  muscle_group: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  instructions: string[];
  video_url?: string;
  created_at: string;
  updated_at: string;
};

export type WorkoutPlan = {
  id: string;
  title: string;
  description: string;
  trainer_id: string;
  client_id: string;
  workouts: Workout[];
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
};

export type Meal = {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  instructions: string[];
  created_at: string;
  updated_at: string;
};

export type DietPlan = {
  id: string;
  title: string;
  description: string;
  trainer_id: string;
  client_id: string;
  meals: Meal[];
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
};

export type ClientProgress = {
  id: string;
  client_id: string;
  current_weight: number;
  target_weight: number;
  body_fat_percentage: number;
  muscle_mass: number;
  created_at: string;
  updated_at: string;
};

export type WorkoutLog = {
  id: string;
  client_progress_id: string;
  workout_id: string;
  date: string;
  duration: number;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type Measurement = {
  id: string;
  client_progress_id: string;
  type: 'weight' | 'body_fat' | 'muscle_mass' | 'waist' | 'chest' | 'arms' | 'thighs';
  value: number;
  date: string;
  created_at: string;
  updated_at: string;
};

export type Goal = {
  id: string;
  client_progress_id: string;
  type: 'weight' | 'body_fat' | 'muscle_mass' | 'strength' | 'endurance' | 'flexibility';
  target_value: number;
  current_value: number;
  deadline: string;
  status: 'in_progress' | 'achieved' | 'missed';
  created_at: string;
  updated_at: string;
}; 