
import { Plus, Search, ArrowUpRight, Dumbbell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Workout } from "@/types/supabase";

// Sample workout data (can be replaced with actual data from Supabase)
const sampleWorkouts = [
  {
    id: "1",
    title: "Upper Body Power",
    description: "Focus on chest, shoulders and triceps",
    type: "strength",
    difficulty: "intermediate",
    duration: "45 min",
    exercises: [
      { name: "Bench Press", sets: 4, reps: "8-10" },
      { name: "Incline Dumbbell Press", sets: 3, reps: "10-12" },
      { name: "Tricep Pushdowns", sets: 3, reps: "12-15" }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "Lower Body Strength",
    description: "Focus on quads, hamstrings and glutes",
    type: "strength",
    difficulty: "intermediate",
    duration: "50 min",
    exercises: [
      { name: "Barbell Squats", sets: 4, reps: "6-8" },
      { name: "Romanian Deadlifts", sets: 3, reps: "8-10" },
      { name: "Walking Lunges", sets: 3, reps: "12 each" }
    ],
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "3",
    title: "HIIT Cardio",
    description: "High intensity interval training for fat loss",
    type: "cardio",
    difficulty: "advanced",
    duration: "30 min",
    exercises: [
      { name: "Burpees", sets: 4, reps: "30 sec" },
      { name: "Mountain Climbers", sets: 4, reps: "30 sec" },
      { name: "Jump Squats", sets: 4, reps: "30 sec" }
    ],
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

interface WorkoutCardProps {
  workout: {
    id: string;
    title: string;
    description: string;
    type: string;
    difficulty: string;
    duration: string;
    exercises: { name: string; sets: number; reps: string }[];
    created_at: string;
  };
}

const WorkoutCard = ({ workout }: WorkoutCardProps) => {
  const navigate = useNavigate();
  const exerciseCount = workout.exercises.length;
  
  return (
    <div 
      className="glass-card rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
      onClick={() => navigate(`/workout-plan/${workout.id}`)}
    >
      <div className="aspect-video bg-muted relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Dumbbell className="h-10 w-10 text-muted-foreground/50" />
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
            {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(workout.created_at).toLocaleDateString()}
          </span>
        </div>
        <h3 className="font-medium mb-1">{workout.title}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{workout.description}</p>
        <div className="flex justify-between text-sm">
          <span>{exerciseCount} exercises • {workout.duration}</span>
          <span className="text-xs px-2 py-1 bg-secondary rounded-full">
            {workout.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
};

export function WorkoutTab() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [workouts, setWorkouts] = useState(sampleWorkouts);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter workouts based on search query
  const filteredWorkouts = workouts.filter(workout => 
    workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workout.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Workout Plans</h1>
        <Button onClick={() => navigate("/workout-plan/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Workout
        </Button>
      </div>
      
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground max-w-2xl">
          Create and manage workout plans for your clients. Track their progress and adjust as needed.
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search workouts..."
            className="pl-9 py-2 pr-4 rounded-lg border bg-background text-sm w-full max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <p>Loading workouts...</p>
          ) : filteredWorkouts.length > 0 ? (
            filteredWorkouts.map(workout => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))
          ) : (
            <div className="col-span-full glass-card rounded-xl p-6 text-center">
              <p className="text-muted-foreground mb-4">No workout plans found. Create your first workout plan to get started.</p>
              <Button onClick={() => navigate("/workout-plan/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Workout
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="glass-card rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Exercise Library</h2>
          <Button variant="outline" size="sm" onClick={() => navigate("/exercises")}>
            View All
            <ArrowUpRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
        <p className="text-muted-foreground mb-4">
          Access our comprehensive library of exercises to build effective workout plans for your clients.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <Dumbbell className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium">Strength</h3>
              <p className="text-sm text-muted-foreground">125 exercises</p>
            </div>
          </div>
          <div className="border rounded-lg p-4 flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium">Cardio</h3>
              <p className="text-sm text-muted-foreground">64 exercises</p>
            </div>
          </div>
          <div className="border rounded-lg p-4 flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <Dumbbell className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium">Flexibility</h3>
              <p className="text-sm text-muted-foreground">48 exercises</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
