
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Dumbbell, 
  Search, 
  Filter, 
  Plus,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Sample exercise data
const exerciseCategories = [
  { id: "strength", name: "Strength" },
  { id: "cardio", name: "Cardio" },
  { id: "flexibility", name: "Flexibility" },
  { id: "balance", name: "Balance" },
];

const exerciseData = [
  {
    id: "1",
    name: "Barbell Bench Press",
    category: "strength",
    muscle: "chest",
    difficulty: "intermediate",
    description: "A compound exercise that primarily targets the chest, shoulders, and triceps.",
    instructions: "Lie on a flat bench, grasp the barbell with hands slightly wider than shoulder-width apart, lower the bar to your chest, and press it back up to the starting position.",
    videoUrl: "#"
  },
  {
    id: "2",
    name: "Barbell Squat",
    category: "strength",
    muscle: "legs",
    difficulty: "intermediate",
    description: "A compound exercise that primarily targets the quadriceps, hamstrings, and glutes.",
    instructions: "Stand with feet shoulder-width apart, rest a barbell on your upper back, bend your knees and hips to lower your body, then push back up to the starting position.",
    videoUrl: "#"
  },
  {
    id: "3",
    name: "Pull-ups",
    category: "strength",
    muscle: "back",
    difficulty: "advanced",
    description: "A compound exercise that primarily targets the back and biceps.",
    instructions: "Hang from a pull-up bar with palms facing away from you, pull your body up until your chin is above the bar, then lower yourself back down with control.",
    videoUrl: "#"
  },
  {
    id: "4",
    name: "Running",
    category: "cardio",
    muscle: "full-body",
    difficulty: "beginner",
    description: "A cardiovascular exercise that improves endurance and burns calories.",
    instructions: "Start with a slow jog to warm up, then increase your speed to a comfortable running pace. Maintain good posture with your head up, shoulders relaxed, and arms swinging naturally.",
    videoUrl: "#"
  },
  {
    id: "5",
    name: "Downward Dog",
    category: "flexibility",
    muscle: "full-body",
    difficulty: "beginner",
    description: "A yoga pose that stretches the hamstrings, calves, and shoulders.",
    instructions: "Start on your hands and knees, then lift your hips up and back to form an inverted V shape with your body. Press your heels toward the floor and your chest toward your thighs.",
    videoUrl: "#"
  }
];

interface ExerciseItemProps {
  exercise: typeof exerciseData[0];
}

const ExerciseItem = ({ exercise }: ExerciseItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Collapsible 
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border rounded-lg overflow-hidden mb-4"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-secondary/50 text-left">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">{exercise.name}</h3>
            <p className="text-sm text-muted-foreground">
              {exercise.muscle.charAt(0).toUpperCase() + exercise.muscle.slice(1)} • {
                exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)
              }
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4 pt-0 border-t">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-sm text-muted-foreground">{exercise.description}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Instructions</h4>
              <p className="text-sm text-muted-foreground">{exercise.instructions}</p>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm">Add to Workout</Button>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const Exercises = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filter exercises based on search query and selected category
  const filteredExercises = exerciseData.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? exercise.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <Container>
          <div className="mb-6">
            <Link to="/dashboard?tab=workouts" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Workouts
            </Link>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Exercise Library</h1>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Exercise
            </Button>
          </div>
          
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search exercises..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {exerciseCategories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )}
                >
                  {category.name}
                </Button>
              ))}
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mb-8">
            {filteredExercises.length > 0 ? (
              filteredExercises.map(exercise => (
                <ExerciseItem key={exercise.id} exercise={exercise} />
              ))
            ) : (
              <div className="glass-card rounded-xl p-6 text-center">
                <p className="text-muted-foreground mb-4">No exercises found matching your criteria.</p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default Exercises;
