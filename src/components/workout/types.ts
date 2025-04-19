
export type WorkoutType = 'strength' | 'cardio' | 'flexibility' | 'hiit';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: string;
  reps: string;
  restTime: string;
  videoUrl?: string;
}

export interface WorkoutFormData {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  frequency: string;
  workoutType: WorkoutType;
  exercises: Exercise[];
}
