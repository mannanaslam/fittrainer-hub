import { useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { WorkoutFormData } from "./types";
import { useAuth } from "@/hooks/useAuth";
import { getAllClients } from "@/lib/supabase/profiles";
import { Profile } from "@/types/supabase";

interface WorkoutBasicInfoProps {
  form: UseFormReturn<WorkoutFormData>;
}

export const WorkoutBasicInfo = ({ form }: WorkoutBasicInfoProps) => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ((useAuth() as any).profile?.role === 'trainer') {
      const fetchClients = async () => {
        setIsLoading(true);
        try {
          const clientsList = await getAllClients();
          setClients(clientsList);
        } catch (error) {
          console.error("Error fetching clients:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchClients();
    }
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Workout Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Upper Body Strength" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="workoutType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Workout Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select workout type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="strength">Strength Training</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="hiit">HIIT</SelectItem>
                <SelectItem value="flexibility">Flexibility</SelectItem>
                <SelectItem value="balance">Balance</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
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
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration (minutes)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="e.g., 45" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="frequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Frequency (days per week)</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">1 day per week</SelectItem>
                <SelectItem value="2">2 days per week</SelectItem>
                <SelectItem value="3">3 days per week</SelectItem>
                <SelectItem value="4">4 days per week</SelectItem>
                <SelectItem value="5">5 days per week</SelectItem>
                <SelectItem value="6">6 days per week</SelectItem>
                <SelectItem value="7">7 days per week</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {(useAuth() as any).profile?.role === 'trainer' && (
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign to Client (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client or leave empty for template" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="" disabled>Loading clients...</SelectItem>
                  ) : clients.length > 0 ? (
                    clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name || client.email}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>No clients available</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

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
  );
};
