
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio-group";
import { Dumbbell, Activity, Zap } from "lucide-react";
import { WorkoutType } from "./types";

interface WorkoutBasicInfoProps {
  workoutName: string;
  workoutDescription: string;
  workoutDuration: string;
  workoutDifficulty: string;
  workoutFrequency: string;
  workoutType: WorkoutType;
  onWorkoutNameChange: (value: string) => void;
  onWorkoutDescriptionChange: (value: string) => void;
  onWorkoutDurationChange: (value: string) => void;
  onWorkoutDifficultyChange: (value: string) => void;
  onWorkoutFrequencyChange: (value: string) => void;
  onWorkoutTypeChange: (value: WorkoutType) => void;
}

export const WorkoutBasicInfo = ({
  workoutName,
  workoutDescription,
  workoutDuration,
  workoutDifficulty,
  workoutFrequency,
  workoutType,
  onWorkoutNameChange,
  onWorkoutDescriptionChange,
  onWorkoutDurationChange,
  onWorkoutDifficultyChange,
  onWorkoutFrequencyChange,
  onWorkoutTypeChange,
}: WorkoutBasicInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Workout Name</Label>
          <Input 
            id="name" 
            placeholder="e.g., Upper Body Power Workout" 
            value={workoutName}
            onChange={(e) => onWorkoutNameChange(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Estimated Duration (minutes)</Label>
          <Input 
            id="duration" 
            type="number" 
            placeholder="e.g., 45" 
            min="1"
            value={workoutDuration}
            onChange={(e) => onWorkoutDurationChange(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <select
            id="difficulty"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={workoutDifficulty}
            onChange={(e) => onWorkoutDifficultyChange(e.target.value)}
          >
            <option value="">Select difficulty level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="frequency">Recommended Frequency</Label>
          <Input 
            id="frequency" 
            placeholder="e.g., 2-3 times per week"
            value={workoutFrequency}
            onChange={(e) => onWorkoutFrequencyChange(e.target.value)}
          />
        </div>
        
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea 
            id="description" 
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
            placeholder="Describe the workout, its benefits, and who it's designed for..."
            value={workoutDescription}
            onChange={(e) => onWorkoutDescriptionChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-3">
        <Label>Workout Type</Label>
        <RadioGroup 
          value={workoutType} 
          onValueChange={onWorkoutTypeChange}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          <div className="relative">
            <RadioGroup.Item 
              value="strength" 
              id="strength" 
              className="absolute right-3 top-3 peer sr-only" 
            />
            <Label 
              htmlFor="strength" 
              className="flex flex-col items-center justify-between border rounded-xl p-4 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-secondary h-full"
            >
              <Dumbbell className="h-8 w-8 mb-2" />
              <span className="font-medium">Strength</span>
            </Label>
          </div>
          
          <div className="relative">
            <RadioGroup.Item 
              value="cardio" 
              id="cardio" 
              className="absolute right-3 top-3 peer sr-only" 
            />
            <Label 
              htmlFor="cardio" 
              className="flex flex-col items-center justify-between border rounded-xl p-4 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-secondary h-full"
            >
              <Activity className="h-8 w-8 mb-2" />
              <span className="font-medium">Cardio</span>
            </Label>
          </div>
          
          <div className="relative">
            <RadioGroup.Item 
              value="flexibility" 
              id="flexibility" 
              className="absolute right-3 top-3 peer sr-only" 
            />
            <Label 
              htmlFor="flexibility" 
              className="flex flex-col items-center justify-between border rounded-xl p-4 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-secondary h-full"
            >
              <Activity className="h-8 w-8 mb-2" />
              <span className="font-medium">Flexibility</span>
            </Label>
          </div>
          
          <div className="relative">
            <RadioGroup.Item 
              value="hiit" 
              id="hiit" 
              className="absolute right-3 top-3 peer sr-only" 
            />
            <Label 
              htmlFor="hiit" 
              className="flex flex-col items-center justify-between border rounded-xl p-4 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-secondary h-full"
            >
              <Zap className="h-8 w-8 mb-2" />
              <span className="font-medium">HIIT</span>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};
