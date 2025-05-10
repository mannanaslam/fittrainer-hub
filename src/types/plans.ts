export type PlanType = 'workout' | 'diet' | 'combined';
export type WorkoutDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type SubscriptionStatus = 'active' | 'completed' | 'cancelled';

export interface Exercise {
  name: string;
  description: string;
  sets: number;
  reps: number;
  restInterval: number;
  equipment: string[];
  videoUrl?: string;
  notes?: string;
}

export interface Workout {
  name: string;
  description: string;
  duration: number;
  difficulty: WorkoutDifficulty;
  exercises: Exercise[];
}

export interface Meal {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  type: PlanType;
  duration: number;
  isPremium: boolean;
  price: number;
  createdAt: string;
  trainerId: string;
  trainer: {
    id: string;
    firstName: string;
    lastName: string;
    bio: string;
  };
  workouts: Workout[];
  meals: Meal[];
}

export interface CreatePlanData {
  title: string;
  description: string;
  type: PlanType;
  duration: number;
  isPremium: boolean;
  price: number;
  workouts: Workout[];
  meals: Meal[];
}

export interface Subscription {
  id: string;
  planId: string;
  userId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  plan: Plan;
}

export interface CreateSubscriptionData {
  planId: string;
  userId: string;
  startDate: string;
  endDate: string;
} 