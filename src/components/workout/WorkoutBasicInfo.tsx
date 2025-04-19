
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dumbbell, Activity, Zap } from "lucide-react";
import { WorkoutFormData } from "./types";

interface WorkoutBasicInfoProps {
  form: UseFormReturn<WorkoutFormData>;
}

export const WorkoutBasicInfo = ({ form }: WorkoutBasicInfoProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workout Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Upper Body Power Workout" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Duration (minutes)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 45" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty Level</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recommended Frequency</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 2-3 times per week" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the workout, its benefits, and who it's designed for..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="workoutType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Workout Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                <div className="relative">
                  <RadioGroupItem value="strength" id="strength" />
                  <label
                    htmlFor="strength"
                    className="flex flex-col items-center justify-between border rounded-xl p-4 cursor-pointer hover:bg-secondary h-full"
                  >
                    <Dumbbell className="h-8 w-8 mb-2" />
                    <span className="font-medium">Strength</span>
                  </label>
                </div>

                <div className="relative">
                  <RadioGroupItem value="cardio" id="cardio" />
                  <label
                    htmlFor="cardio"
                    className="flex flex-col items-center justify-between border rounded-xl p-4 cursor-pointer hover:bg-secondary h-full"
                  >
                    <Activity className="h-8 w-8 mb-2" />
                    <span className="font-medium">Cardio</span>
                  </label>
                </div>

                <div className="relative">
                  <RadioGroupItem value="flexibility" id="flexibility" />
                  <label
                    htmlFor="flexibility"
                    className="flex flex-col items-center justify-between border rounded-xl p-4 cursor-pointer hover:bg-secondary h-full"
                  >
                    <Activity className="h-8 w-8 mb-2" />
                    <span className="font-medium">Flexibility</span>
                  </label>
                </div>

                <div className="relative">
                  <RadioGroupItem value="hiit" id="hiit" />
                  <label
                    htmlFor="hiit"
                    className="flex flex-col items-center justify-between border rounded-xl p-4 cursor-pointer hover:bg-secondary h-full"
                  >
                    <Zap className="h-8 w-8 mb-2" />
                    <span className="font-medium">HIIT</span>
                  </label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
