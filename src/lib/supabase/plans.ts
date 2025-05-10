import { supabase } from './client';

export interface Plan {
  id: string;
  title: string;
  description: string;
  type: 'workout' | 'diet' | 'combined';
  duration: number;
  isPremium: boolean;
  price: number;
  created_at: string;
  trainer_id: string;
  trainer: {
    id: string;
    first_name: string;
    last_name: string;
    bio: string;
  };
  workouts: Workout[];
  meals: Meal[];
}

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
  difficulty: 'beginner' | 'intermediate' | 'advanced';
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

export interface CreatePlanData {
  title: string;
  description: string;
  type: 'workout' | 'diet' | 'combined';
  duration: number;
  isPremium: boolean;
  price: number;
  workouts: Workout[];
  meals: Meal[];
}

export const getPlans = async () => {
  const { data, error } = await supabase
    .from('plans')
    .select(`
      *,
      trainer:trainer_id (
        id,
        first_name,
        last_name,
        bio
      )
    `)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const getPlanById = async (id: string) => {
  const { data, error } = await supabase
    .from('plans')
    .select(`
      *,
      trainer:trainer_id (
        id,
        first_name,
        last_name,
        bio
      )
    `)
    .eq('id', id)
    .single();

  return { data, error };
};

export const createPlan = async (planData: CreatePlanData) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('plans')
    .insert([
      {
        ...planData,
        trainer_id: user.id,
      },
    ])
    .select()
    .single();

  return { data, error };
};

export const updatePlan = async (id: string, planData: Partial<CreatePlanData>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Verify that the user is the trainer who created the plan
  const { data: plan } = await getPlanById(id);
  if (!plan || plan.trainer_id !== user.id) {
    throw new Error('Not authorized to update this plan');
  }

  const { data, error } = await supabase
    .from('plans')
    .update(planData)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

export const deletePlan = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Verify that the user is the trainer who created the plan
  const { data: plan } = await getPlanById(id);
  if (!plan || plan.trainer_id !== user.id) {
    throw new Error('Not authorized to delete this plan');
  }

  const { error } = await supabase
    .from('plans')
    .delete()
    .eq('id', id);

  return { error };
};

export const subscribeToPlan = async (planId: string, userId: string) => {
  const { data: plan } = await getPlanById(planId);
  if (!plan) throw new Error('Plan not found');

  // Check if user is already subscribed
  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select()
    .eq('plan_id', planId)
    .eq('user_id', userId)
    .single();

  if (existingSubscription) {
    throw new Error('Already subscribed to this plan');
  }

  // Create subscription
  const { data, error } = await supabase
    .from('subscriptions')
    .insert([
      {
        plan_id: planId,
        user_id: userId,
        status: 'active',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000).toISOString(),
      },
    ])
    .select()
    .single();

  return { data, error };
};

export const getSubscribedPlans = async (userId: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      plan:plan_id (
        *,
        trainer:trainer_id (
          id,
          first_name,
          last_name,
          bio
        )
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('start_date', { ascending: false });

  return { data, error };
};

export const getTrainerPlans = async (trainerId: string) => {
  const { data, error } = await supabase
    .from('plans')
    .select(`
      *,
      trainer:trainer_id (
        id,
        first_name,
        last_name,
        bio
      )
    `)
    .eq('trainer_id', trainerId)
    .order('created_at', { ascending: false });

  return { data, error };
}; 