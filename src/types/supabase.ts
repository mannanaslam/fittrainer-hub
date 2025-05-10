export type Profile = {
  id: string;
  email: string;
  name?: string | null;
  first_name: string;
  last_name: string;
  role: 'trainer' | 'client';
  created_at: string | null;
  updated_at: string | null;
  specialization?: string | null;
  experience?: number | null;
  bio?: string | null;
  goals?: string[] | null;
  experience_level?: string | null;
  activity_level?: number | null;
  subscription_plan?: string | null;
  height?: number | null;
  weight?: number | null;
  fitness_level?: string | null;
  target_weight?: number | null;
  notification_preferences?: {
    email: boolean;
    app: boolean;
  } | null;
  avatar_url?: string | null;
};

export type Workout = {
  id: string;
  created_at: string | null;
  trainer_id: string | null;
  client_id: string | null;
  title: string;
  description: string | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  workout_type: 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'balance' | 'mixed';
  duration: number;
  frequency: number;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
    duration?: number;
    notes?: string;
  }[];
};

export type MealPlan = {
  id: string;
  created_at: string | null;
  trainer_id: string | null;
  client_id: string | null;
  title: string;
  description: string | null;
  meals: {
    name: string;
    time: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    notes?: string;
  }[];
};

export type Subscription = {
  id: string;
  created_at: string | null;
  user_id: string | null;
  plan: string;
  status: 'active' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string;
};

// Message type definition
export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

// Health metrics type definition
export interface HealthMetric {
  id: string;
  user_id: string;
  weight: number | null;
  body_fat_percentage: number | null;
  muscle_mass: number | null;
  resting_heart_rate: number | null;
  blood_pressure: string | null;
  recorded_at: string;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          first_name: string
          last_name: string
          email: string
          role: 'trainer' | 'client'
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          first_name: string
          last_name: string
          email: string
          role: 'trainer' | 'client'
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name?: string
          last_name?: string
          email?: string
          role?: 'trainer' | 'client'
          avatar_url?: string | null
        }
      }
      trainer_profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          bio: string
          experience: number
          specialties: string[]
          certifications: string[]
          hourly_rate: number
          availability: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          bio: string
          experience: number
          specialties: string[]
          certifications: string[]
          hourly_rate: number
          availability: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          bio?: string
          experience?: number
          specialties?: string[]
          certifications?: string[]
          hourly_rate?: number
          availability?: Json
        }
      }
      client_profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          height: number
          weight: number
          fitness_goals: string[]
          medical_conditions: string[]
          dietary_restrictions: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          height: number
          weight: number
          fitness_goals: string[]
          medical_conditions: string[]
          dietary_restrictions: string[]
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          height?: number
          weight?: number
          fitness_goals?: string[]
          medical_conditions?: string[]
          dietary_restrictions?: string[]
        }
      }
      plans: {
        Row: {
          id: string
          title: string
          description: string
          type: 'workout' | 'diet' | 'combined'
          duration: number
          is_premium: boolean
          price: number
          created_at: string
          trainer_id: string
          workouts: Json
          meals: Json
        }
        Insert: {
          id?: string
          title: string
          description: string
          type: 'workout' | 'diet' | 'combined'
          duration: number
          is_premium: boolean
          price: number
          created_at?: string
          trainer_id: string
          workouts?: Json
          meals?: Json
        }
        Update: {
          id?: string
          title?: string
          description?: string
          type?: 'workout' | 'diet' | 'combined'
          duration?: number
          is_premium?: boolean
          price?: number
          created_at?: string
          trainer_id?: string
          workouts?: Json
          meals?: Json
        }
      }
      subscriptions: {
        Row: {
          id: string
          plan_id: string
          user_id: string
          status: 'active' | 'completed' | 'cancelled'
          start_date: string
          end_date: string
          created_at: string
        }
        Insert: {
          id?: string
          plan_id: string
          user_id: string
          status?: 'active' | 'completed' | 'cancelled'
          start_date: string
          end_date: string
          created_at?: string
        }
        Update: {
          id?: string
          plan_id?: string
          user_id?: string
          status?: 'active' | 'completed' | 'cancelled'
          start_date?: string
          end_date?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          created_at: string
          sender_id: string
          receiver_id: string
          content: string
          read: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          sender_id: string
          receiver_id: string
          content: string
          read?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          read?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
