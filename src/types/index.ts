export interface User {
  id: string;
  email: string;
  role: 'trainer' | 'client';
  profile: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatarUrl?: string;
  contactInfo?: {
    phone?: string;
    address?: string;
  };
  // Trainer specific fields
  certifications?: string[];
  specialties?: string[];
  experience?: string;
}

export interface WorkoutPlan {
  id: string;
  trainerId: string;
  title: string;
  description: string;
  duration: number; // in days
  isPremium: boolean;
  price?: number;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: number;
  reps: number;
  restInterval: number; // in seconds
  equipment?: string[];
  videoUrl?: string;
  notes?: string;
  modifications?: string[];
}

export interface DietPlan {
  id: string;
  trainerId: string;
  title: string;
  description: string;
  duration: number; // in days
  isPremium: boolean;
  price?: number;
  meals: Meal[];
  createdAt: string;
  updatedAt: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  calories: number;
  ingredients: string[];
  instructions: string[];
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planType: 'workout' | 'diet';
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  price: number;
  paymentStatus: 'paid' | 'pending' | 'failed';
}

export interface ClientProgress {
  id: string;
  userId: string;
  trainerId: string;
  workoutLogs: WorkoutLog[];
  measurements: Measurement[];
  goals: Goal[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutLog {
  id: string;
  workoutPlanId: string;
  completedAt: string;
  exercises: {
    exerciseId: string;
    completedSets: number;
    completedReps: number;
    notes?: string;
  }[];
}

export interface Measurement {
  id: string;
  type: 'weight' | 'bodyFat' | 'muscleMass' | 'custom';
  value: number;
  unit: string;
  date: string;
  notes?: string;
}

export interface Goal {
  id: string;
  type: 'weight' | 'strength' | 'endurance' | 'custom';
  target: number;
  unit: string;
  deadline: string;
  status: 'in_progress' | 'achieved' | 'missed';
  notes?: string;
} 