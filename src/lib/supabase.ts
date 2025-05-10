// This file is maintained for backward compatibility
// All functions are now split into separate modules in the supabase/ directory

import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (email: string, password: string, role: 'trainer' | 'client') => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// User profile helpers
export const createUserProfile = async (userId: string, profile: {
  firstName: string;
  lastName: string;
  bio?: string;
  avatarUrl?: string;
  phoneNumber?: string;
}) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      user_id: userId,
      first_name: profile.firstName,
      last_name: profile.lastName,
      bio: profile.bio,
      avatar_url: profile.avatarUrl,
      phone_number: profile.phoneNumber,
    })
    .select()
    .single();
  return { data, error };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
};

// Trainer profile helpers
export const createTrainerProfile = async (userId: string, profile: {
  experience: number;
  specialties: string[];
  certifications: Array<{
    name: string;
    issuer: string;
    year: number;
    expiryDate?: Date;
  }>;
}) => {
  const { data: trainerProfile, error: trainerError } = await supabase
    .from('trainer_profiles')
    .insert({
      user_id: userId,
      experience: profile.experience,
    })
    .select()
    .single();

  if (trainerError) return { error: trainerError };

  // Insert specialties
  const { error: specialtiesError } = await supabase
    .from('trainer_specialties')
    .insert(
      profile.specialties.map(specialty => ({
        trainer_id: trainerProfile.id,
        specialty,
      }))
    );

  if (specialtiesError) return { error: specialtiesError };

  // Insert certifications
  const { error: certificationsError } = await supabase
    .from('certifications')
    .insert(
      profile.certifications.map(cert => ({
        trainer_id: trainerProfile.id,
        name: cert.name,
        issuer: cert.issuer,
        year: cert.year,
        expiry_date: cert.expiryDate,
      }))
    );

  return { data: trainerProfile, error: certificationsError };
};

// Client profile helpers
export const createClientProfile = async (userId: string, profile: {
  height?: number;
  weight?: number;
  fitnessGoals?: string[];
  medicalConditions?: string[];
  dietaryRestrictions?: string[];
}) => {
  const { data: clientProfile, error: clientError } = await supabase
    .from('client_profiles')
    .insert({
      user_id: userId,
      height: profile.height,
      weight: profile.weight,
    })
    .select()
    .single();

  if (clientError) return { error: clientError };

  if (profile.fitnessGoals?.length) {
    const { error: goalsError } = await supabase
      .from('client_fitness_goals')
      .insert(
        profile.fitnessGoals.map(goal => ({
          client_id: clientProfile.id,
          goal,
        }))
      );

    if (goalsError) return { error: goalsError };
  }

  return { data: clientProfile, error: null };
};

// Plan helpers
export const createPlan = async (trainerId: string, plan: {
  title: string;
  description: string;
  type: 'workout' | 'diet' | 'combined';
  duration: number;
  isPremium: boolean;
  price?: number;
  workouts?: Array<{
    name: string;
    description: string;
    duration: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    exercises: Array<{
      name: string;
      description: string;
      sets: number;
      reps: number;
      restInterval: number;
      equipment?: string[];
      videoUrl?: string;
      notes?: string;
    }>;
  }>;
  meals?: Array<{
    name: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    ingredients: string[];
    instructions: string[];
    imageUrl?: string;
  }>;
}) => {
  const { data: planData, error: planError } = await supabase
    .from('plans')
    .insert({
      trainer_id: trainerId,
      title: plan.title,
      description: plan.description,
      type: plan.type,
      duration: plan.duration,
      is_premium: plan.isPremium,
      price: plan.price,
    })
    .select()
    .single();

  if (planError) return { error: planError };

  if (plan.workouts?.length) {
    for (const workout of plan.workouts) {
      const { data: workoutData, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          plan_id: planData.id,
          name: workout.name,
          description: workout.description,
          duration: workout.duration,
          difficulty: workout.difficulty,
        })
        .select()
        .single();

      if (workoutError) return { error: workoutError };

      for (const exercise of workout.exercises) {
        const { data: exerciseData, error: exerciseError } = await supabase
          .from('exercises')
          .insert({
            workout_id: workoutData.id,
            name: exercise.name,
            description: exercise.description,
            sets: exercise.sets,
            reps: exercise.reps,
            rest_interval: exercise.restInterval,
            video_url: exercise.videoUrl,
            notes: exercise.notes,
          })
          .select()
          .single();

        if (exerciseError) return { error: exerciseError };

        if (exercise.equipment?.length) {
          const { error: equipmentError } = await supabase
            .from('exercise_equipment')
            .insert(
              exercise.equipment.map(equipment => ({
                exercise_id: exerciseData.id,
                equipment,
              }))
            );

          if (equipmentError) return { error: equipmentError };
        }
      }
    }
  }

  if (plan.meals?.length) {
    for (const meal of plan.meals) {
      const { data: mealData, error: mealError } = await supabase
        .from('meals')
        .insert({
          plan_id: planData.id,
          name: meal.name,
          description: meal.description,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fats: meal.fats,
          image_url: meal.imageUrl,
        })
        .select()
        .single();

      if (mealError) return { error: mealError };

      const { error: ingredientsError } = await supabase
        .from('meal_ingredients')
        .insert(
          meal.ingredients.map(ingredient => ({
            meal_id: mealData.id,
            ingredient,
          }))
        );

      if (ingredientsError) return { error: ingredientsError };

      const { error: instructionsError } = await supabase
        .from('meal_instructions')
        .insert(
          meal.instructions.map((instruction, index) => ({
            meal_id: mealData.id,
            step_number: index + 1,
            instruction,
          }))
        );

      if (instructionsError) return { error: instructionsError };
    }
  }

  return { data: planData, error: null };
};

// Subscription helpers
export const createSubscription = async (userId: string, planId: string, payment: {
  amount: number;
  currency: string;
  paymentMethod: string;
}) => {
  const { data: subscription, error: subscriptionError } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_id: planId,
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    })
    .select()
    .single();

  if (subscriptionError) return { error: subscriptionError };

  const { error: paymentError } = await supabase
    .from('payments')
    .insert({
      subscription_id: subscription.id,
      amount: payment.amount,
      currency: payment.currency,
      payment_method: payment.paymentMethod,
      status: 'success',
    });

  return { data: subscription, error: paymentError };
};

// Progress tracking helpers
export const createProgress = async (userId: string, planId: string, progress: {
  date: Date;
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
  notes?: string;
}) => {
  const { data, error } = await supabase
    .from('progress')
    .insert({
      user_id: userId,
      plan_id: planId,
      date: progress.date,
      weight: progress.weight,
      body_fat: progress.bodyFat,
      chest: progress.measurements?.chest,
      waist: progress.measurements?.waist,
      hips: progress.measurements?.hips,
      arms: progress.measurements?.arms,
      thighs: progress.measurements?.thighs,
      workout_completion: progress.workoutCompletion,
      diet_adherence: progress.dietAdherence,
      notes: progress.notes,
    })
    .select()
    .single();

  return { data, error };
};

// Message helpers
export const sendMessage = async (senderId: string, receiverId: string, content: string, attachments?: string[]) => {
  const { data: message, error: messageError } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      content,
    })
    .select()
    .single();

  if (messageError) return { error: messageError };

  if (attachments?.length) {
    const { error: attachmentsError } = await supabase
      .from('message_attachments')
      .insert(
        attachments.map(attachmentUrl => ({
          message_id: message.id,
          attachment_url: attachmentUrl,
        }))
      );

    if (attachmentsError) return { error: attachmentsError };
  }

  return { data: message, error: null };
};

// Notification helpers
export const createNotification = async (userId: string, notification: {
  type: 'workout' | 'diet' | 'payment' | 'message' | 'system';
  title: string;
  message: string;
}) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
    })
    .select()
    .single();

  return { data, error };
};
