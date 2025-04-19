
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExerciseItem } from "./ExerciseItem";
import { WorkoutBasicInfo } from "./WorkoutBasicInfo";
import { Exercise, WorkoutType, WorkoutFormData } from "./types";
import {
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface WorkoutFormProps {
  onSave: (status: 'draft' | 'published') => Promise<void>;
  isSubmitting: boolean;
}

export const WorkoutForm = ({ onSave, isSubmitting }: WorkoutFormProps) => {
  const [workoutType, setWorkoutType] = useState<WorkoutType>("strength");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [workoutDifficulty, setWorkoutDifficulty] = useState("");
  const [workoutFrequency, setWorkoutFrequency] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: "ex1",
      name: "",
      description: "",
      sets: "",
      reps: "",
      restTime: "",
    }
  ]);
  
  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: `ex${exercises.length + 1}`,
        name: "",
        description: "",
        sets: "",
        reps: "",
        restTime: "",
      }
    ]);
  };
  
  const removeExercise = (id: string) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter(ex => ex.id !== id));
    }
  };
  
  const moveExercise = (id: string, direction: "up" | "down") => {
    const index = exercises.findIndex(ex => ex.id === id);
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === exercises.length - 1)
    ) {
      return;
    }
    
    const newExercises = [...exercises];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    [newExercises[index], newExercises[targetIndex]] = 
      [newExercises[targetIndex], newExercises[index]];
    
    setExercises(newExercises);
  };
  
  const updateExercise = (id: string, field: keyof Exercise, value: string) => {
    setExercises(
      exercises.map(ex => 
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    );
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-card border rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        <WorkoutBasicInfo 
          workoutName={workoutName}
          workoutDescription={workoutDescription}
          workoutDuration={workoutDuration}
          workoutDifficulty={workoutDifficulty}
          workoutFrequency={workoutFrequency}
          workoutType={workoutType}
          onWorkoutNameChange={setWorkoutName}
          onWorkoutDescriptionChange={setWorkoutDescription}
          onWorkoutDurationChange={setWorkoutDuration}
          onWorkoutDifficultyChange={setWorkoutDifficulty}
          onWorkoutFrequencyChange={setWorkoutFrequency}
          onWorkoutTypeChange={setWorkoutType}
        />
      </div>
      
      <div className="bg-card border rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Exercises</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center cursor-help">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="max-w-xs">
                  Add all exercises for this workout. Order matters - clients will follow the exercises in the sequence shown here.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-6">
          {exercises.map((exercise, index) => (
            <ExerciseItem
              key={exercise.id}
              exercise={exercise}
              index={index}
              totalExercises={exercises.length}
              onUpdate={updateExercise}
              onMove={moveExercise}
              onRemove={removeExercise}
            />
          ))}
          
          <Button 
            variant="outline" 
            onClick={addExercise} 
            className="w-full border-dashed"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Exercise
          </Button>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button 
          variant="outline" 
          onClick={() => onSave('draft')}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save as Draft'}
        </Button>
        <Button 
          onClick={() => onSave('published')}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Publishing...' : 'Publish Workout'}
        </Button>
      </div>
    </div>
  );
};
