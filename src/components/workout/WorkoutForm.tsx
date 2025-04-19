
import React from "react";
import { Plus } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ExerciseItem } from "./ExerciseItem";
import { WorkoutBasicInfo } from "./WorkoutBasicInfo";
import { WorkoutFormData, workoutFormSchema } from "./types";
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
  const form = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: "",
      difficulty: "",
      frequency: "",
      workoutType: "strength",
      exercises: [
        {
          id: "ex1",
          name: "",
          description: "",
          sets: "",
          reps: "",
          restTime: "",
          videoUrl: ""
        }
      ]
    }
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "exercises"
  });

  const addExercise = () => {
    append({
      id: `ex${fields.length + 1}`,
      name: "",
      description: "",
      sets: "",
      reps: "",
      restTime: "",
      videoUrl: ""
    });
  };

  const removeExercise = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const moveExercise = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (
      (direction === "up" && index > 0) ||
      (direction === "down" && index < fields.length - 1)
    ) {
      move(index, newIndex);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-8">
        <div className="bg-card border rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          <WorkoutBasicInfo form={form} />
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
            {fields.map((field, index) => (
              <ExerciseItem
                key={field.id}
                form={form}
                index={index}
                onMove={moveExercise}
                onRemove={() => removeExercise(index)}
                totalExercises={fields.length}
              />
            ))}

            <Button
              type="button"
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
            type="button"
            variant="outline"
            onClick={() => onSave('draft')}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save as Draft'}
          </Button>
          <Button
            type="button"
            onClick={() => onSave('published')}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Workout'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

