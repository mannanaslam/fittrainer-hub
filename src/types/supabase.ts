
export type Profile = {
  id: string;
  email: string;
  name: string;
  role: 'trainer' | 'client';
  created_at: string;
  updated_at: string;
  specialization?: string;
  experience?: number;
  bio?: string;
  goals?: string[];
  experience_level?: string;
  activity_level?: number;
  subscription_plan?: string;
};

export type Workout = {
  id: string;
  created_at: string;
  trainer_id: string;
  client_id: string;
  title: string;
  description: string;
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
  created_at: string;
  trainer_id: string;
  client_id: string;
  title: string;
  description: string;
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
  created_at: string;
  user_id: string;
  plan: string;
  status: 'active' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string;
};
