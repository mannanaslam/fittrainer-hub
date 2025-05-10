
import { z } from "zod";

// Exercise schema
const exerciseSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Exercise name is required" }),
  description: z.string().optional(),
  sets: z.string().min(1, { message: "Sets is required" }),
  reps: z.string().min(1, { message: "Reps is required" }),
  weight: z.string().optional(),
  duration: z.string().optional(),
  restTime: z.string().optional(),
  videoUrl: z.string().optional(),
  notes: z.string().optional(),
});

// Workout schema
export const workoutFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  duration: z.string().optional(),
  difficulty: z.string().optional(),
  frequency: z.string().optional(),
  workoutType: z.string().optional(),
  clientId: z.string().optional(),
  exercises: z.array(exerciseSchema).min(1, { message: "At least one exercise is required" }),
});

// Exercise type
export type ExerciseFormData = z.infer<typeof exerciseSchema>;

// Workout type
export type WorkoutFormData = z.infer<typeof workoutFormSchema>;
