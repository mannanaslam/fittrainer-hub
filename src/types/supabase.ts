
export type Profile = {
  id: string;
  email: string;
  name: string | null;
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
};

export type Workout = {
  id: string;
  created_at: string | null;
  trainer_id: string | null;
  client_id: string | null;
  title: string;
  description: string | null;
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
