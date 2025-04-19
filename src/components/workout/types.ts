
import { z } from "zod";

export type WorkoutType = 'strength' | 'cardio' | 'flexibility' | 'hiit';

export const exerciseSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Exercise name is required"),
  description: z.string().min(1, "Exercise description is required"),
  sets: z.string().min(1, "Number of sets is required"),
  reps: z.string().min(1, "Number of reps is required"),
  restTime: z.string(),
  videoUrl: z.string().optional()
});

export const workoutFormSchema = z.object({
  title: z.string().min(1, "Workout name is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.string().min(1, "Duration is required"),
  difficulty: z.string().min(1, "Difficulty level is required"),
  frequency: z.string().min(1, "Frequency is required"),
  workoutType: z.enum(['strength', 'cardio', 'flexibility', 'hiit']),
  exercises: z.array(exerciseSchema).min(1, "At least one exercise is required")
});

export type Exercise = z.infer<typeof exerciseSchema>;
export type WorkoutFormData = z.infer<typeof workoutFormSchema>;

