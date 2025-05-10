// User Types
export interface User {
  id: string;
  email: string;
  role: 'trainer' | 'client';
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  trainerProfile?: TrainerProfile;
  clientProfile?: ClientProfile;
}

export interface TrainerProfile {
  id: string;
  userId: string;
  certifications: Certification[];
  specialties: string[];
  experience: number;
  rating?: number;
  totalClients?: number;
}

export interface ClientProfile {
  id: string;
  userId: string;
  height?: number;
  weight?: number;
  fitnessGoals?: string[];
  medicalConditions?: string[];
  dietaryRestrictions?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: number;
  expiryDate?: Date;
}

// Plan Types
export interface Plan {
  id: string;
  trainerId: string;
  title: string;
  description: string;
  type: 'workout' | 'diet' | 'combined';
  duration: number; // in days
  isPremium: boolean;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
  workouts?: Workout[];
  meals?: Meal[];
}

export interface Workout {
  id: string;
  planId: string;
  name: string;
  description: string;
  exercises: Exercise[];
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Exercise {
  id: string;
  workoutId: string;
  name: string;
  description: string;
  sets: number;
  reps: number;
  restInterval: number; // in seconds
  equipment?: string[];
  videoUrl?: string;
  notes?: string;
}

export interface Meal {
  id: string;
  planId: string;
  name: string;
  description: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
}

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  paymentStatus: 'paid' | 'pending' | 'failed';
  paymentHistory: Payment[];
}

export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'success' | 'pending' | 'failed';
  paymentMethod: string;
  createdAt: Date;
}

// Progress Tracking Types
export interface Progress {
  id: string;
  userId: string;
  planId: string;
  date: Date;
  metrics: {
    weight?: number;
    bodyFat?: number;
    measurements?: {
      chest?: number;
      waist?: number;
      hips?: number;
      arms?: number;
      thighs?: number;
    };
    workoutCompletion?: number;
    dietAdherence?: number;
  };
  notes?: string;
}

// Communication Types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachments?: string[];
  read: boolean;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'workout' | 'diet' | 'payment' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
} 