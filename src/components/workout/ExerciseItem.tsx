
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, MoveUp, MoveDown, Video } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: string;
  reps: string;
  restTime: string;
  videoUrl?: string;
}

interface ExerciseItemProps {
  exercise: Exercise;
  index: number;
  totalExercises: number;
  onUpdate: (id: string, field: keyof Exercise, value: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onRemove: (id: string) => void;
}

export const ExerciseItem = ({
  exercise,
  index,
  totalExercises,
  onUpdate,
  onMove,
  onRemove,
}: ExerciseItemProps) => {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Exercise {index + 1}</h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onMove(exercise.id, "up")}
            disabled={index === 0}
            className="h-8 w-8"
          >
            <MoveUp className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onMove(exercise.id, "down")}
            disabled={index === totalExercises - 1}
            className="h-8 w-8"
          >
            <MoveDown className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onRemove(exercise.id)}
            disabled={totalExercises === 1}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`name-${exercise.id}`}>Exercise Name</Label>
          <Input 
            id={`name-${exercise.id}`} 
            placeholder="e.g., Barbell Bench Press" 
            value={exercise.name}
            onChange={(e) => onUpdate(exercise.id, "name", e.target.value)}
          />
        </div>
        
        <div className="md:flex md:space-x-4">
          <div className="space-y-2 flex-1 mb-4 md:mb-0">
            <Label htmlFor={`sets-${exercise.id}`}>Sets</Label>
            <Input 
              id={`sets-${exercise.id}`} 
              placeholder="e.g., 3" 
              value={exercise.sets}
              onChange={(e) => onUpdate(exercise.id, "sets", e.target.value)}
            />
          </div>
          <div className="space-y-2 flex-1 mb-4 md:mb-0">
            <Label htmlFor={`reps-${exercise.id}`}>Reps</Label>
            <Input 
              id={`reps-${exercise.id}`} 
              placeholder="e.g., 10-12" 
              value={exercise.reps}
              onChange={(e) => onUpdate(exercise.id, "reps", e.target.value)}
            />
          </div>
          <div className="space-y-2 flex-1">
            <Label htmlFor={`rest-${exercise.id}`}>Rest</Label>
            <Input 
              id={`rest-${exercise.id}`} 
              placeholder="e.g., 60 sec" 
              value={exercise.restTime}
              onChange={(e) => onUpdate(exercise.id, "restTime", e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor={`description-${exercise.id}`}>Instructions</Label>
          <textarea 
            id={`description-${exercise.id}`} 
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
            placeholder="Step-by-step instructions on how to perform this exercise..."
            value={exercise.description}
            onChange={(e) => onUpdate(exercise.id, "description", e.target.value)}
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor={`video-${exercise.id}`}>
            Video URL
            <span className="text-xs text-muted-foreground ml-2">(optional)</span>
          </Label>
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Video className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                id={`video-${exercise.id}`} 
                placeholder="Paste YouTube or direct video URL" 
                className="pl-10"
                value={exercise.videoUrl || ""}
                onChange={(e) => onUpdate(exercise.id, "videoUrl", e.target.value)}
              />
            </div>
            <Button variant="outline" type="button">
              Upload
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
