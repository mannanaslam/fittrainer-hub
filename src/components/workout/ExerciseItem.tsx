
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, MoveUp, MoveDown, Video } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { WorkoutFormData } from "./types";

interface ExerciseItemProps {
  form: UseFormReturn<WorkoutFormData>;
  index: number;
  totalExercises: number;
  onMove: (index: number, direction: "up" | "down") => void;
  onRemove: () => void;
}

export const ExerciseItem = ({
  form,
  index,
  totalExercises,
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
            onClick={() => onMove(index, "up")}
            disabled={index === 0}
            className="h-8 w-8"
          >
            <MoveUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMove(index, "down")}
            disabled={index === totalExercises - 1}
            className="h-8 w-8"
          >
            <MoveDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            disabled={totalExercises === 1}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`exercises.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exercise Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Barbell Bench Press" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="md:flex md:space-x-4">
          <FormField
            control={form.control}
            name={`exercises.${index}.sets`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Sets</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`exercises.${index}.reps`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Reps</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 10-12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`exercises.${index}.restTime`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Rest</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 60 sec" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name={`exercises.${index}.description`}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Step-by-step instructions on how to perform this exercise..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`exercises.${index}.videoUrl`}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>
                Video URL
                <span className="text-xs text-muted-foreground ml-2">
                  (optional)
                </span>
              </FormLabel>
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Video className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input
                      placeholder="Paste YouTube or direct video URL"
                      className="pl-10"
                      {...field}
                    />
                  </FormControl>
                </div>
                <Button variant="outline" type="button">
                  Upload
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

