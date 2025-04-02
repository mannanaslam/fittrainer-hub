
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, ArrowUpDown, Filter, ChevronDown, Save, Clock, Dumbbell } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Sample exercise categories
const categories = [
  "All",
  "Strength",
  "Cardio",
  "Flexibility",
  "Balance",
  "Plyometric",
  "Functional"
];

// Sample exercise equipment
const equipment = [
  "All",
  "Bodyweight",
  "Dumbbells",
  "Barbell",
  "Kettlebell",
  "Resistance Bands",
  "Cable Machine",
  "Smith Machine",
  "Medicine Ball",
  "TRX",
  "Foam Roller"
];

// Sample muscle groups
const muscleGroups = [
  "All",
  "Chest",
  "Back",
  "Shoulders",
  "Arms",
  "Legs",
  "Core",
  "Glutes",
  "Full Body"
];

// Sample exercises data
const exercises = [
  {
    id: 1,
    name: "Barbell Bench Press",
    category: "Strength",
    equipment: "Barbell",
    muscleGroups: ["Chest", "Shoulders", "Arms"],
    difficulty: "Intermediate",
    description: "Lie on a flat bench with your feet flat on the floor. Grip the barbell slightly wider than shoulder-width apart. Lower the barbell to your chest, then press it back up to the starting position.",
    instructions: "1. Lie on bench with feet flat on floor\n2. Grip barbell wider than shoulder width\n3. Unrack the barbell\n4. Lower to chest with control\n5. Press back up to full extension",
    image: "bench-press.jpg",
    video: "bench-press-video.mp4",
    saved: true,
    created: "Oct 12, 2023"
  },
  {
    id: 2,
    name: "Squat",
    category: "Strength",
    equipment: "Barbell",
    muscleGroups: ["Legs", "Glutes", "Core"],
    difficulty: "Intermediate",
    description: "Stand with feet shoulder-width apart. Lower your body by bending your knees and pushing your hips back, as if sitting in a chair. Keep your chest up and back straight. Return to starting position.",
    instructions: "1. Stand with feet shoulder-width apart\n2. Hold barbell on upper back\n3. Bend knees and push hips back\n4. Lower until thighs are parallel to floor\n5. Push through heels to return to start",
    image: "squat.jpg",
    video: "squat-video.mp4",
    saved: true,
    created: "Oct 10, 2023"
  },
  {
    id: 3,
    name: "Pull-Up",
    category: "Strength",
    equipment: "Bodyweight",
    muscleGroups: ["Back", "Arms"],
    difficulty: "Advanced",
    description: "Hang from a pull-up bar with palms facing away from you. Pull your body up until your chin clears the bar, then lower with control.",
    instructions: "1. Hang from bar with palms facing away\n2. Engage core and pull shoulders down\n3. Pull up until chin clears bar\n4. Lower with control\n5. Repeat",
    image: "pull-up.jpg",
    video: "pull-up-video.mp4",
    saved: false,
    created: "Oct 8, 2023"
  },
  {
    id: 4,
    name: "Dumbbell Shoulder Press",
    category: "Strength",
    equipment: "Dumbbells",
    muscleGroups: ["Shoulders", "Arms"],
    difficulty: "Beginner",
    description: "Sit on a bench with back support. Hold dumbbells at shoulder height with palms facing forward. Press the weights upward until arms are extended overhead, then lower back to starting position.",
    instructions: "1. Sit on bench with back support\n2. Hold dumbbells at shoulder height\n3. Press weights overhead\n4. Extend arms fully at top\n5. Lower back to start",
    image: "shoulder-press.jpg",
    video: "shoulder-press-video.mp4",
    saved: false,
    created: "Oct 5, 2023"
  },
  {
    id: 5,
    name: "Deadlift",
    category: "Strength",
    equipment: "Barbell",
    muscleGroups: ["Back", "Legs", "Glutes"],
    difficulty: "Advanced",
    description: "Stand with feet hip-width apart, barbell over mid-foot. Bend at hips and knees to grip the bar. Keeping back flat, extend hips and knees to stand up with the weight, then return to starting position.",
    instructions: "1. Stand with feet hip-width apart\n2. Barbell over mid-foot\n3. Grip bar outside knees\n4. Flat back, chest up\n5. Stand up by extending hips and knees\n6. Return to start with control",
    image: "deadlift.jpg",
    video: "deadlift-video.mp4",
    saved: true,
    created: "Oct 3, 2023"
  },
  {
    id: 6,
    name: "Plank",
    category: "Strength",
    equipment: "Bodyweight",
    muscleGroups: ["Core", "Shoulders"],
    difficulty: "Beginner",
    description: "Get into a push-up position, but with your weight on your forearms. Keep your body in a straight line from head to heels, engaging your core muscles.",
    instructions: "1. Start in push-up position\n2. Lower onto forearms\n3. Body straight line from head to heels\n4. Engage core muscles\n5. Hold position",
    image: "plank.jpg",
    video: "plank-video.mp4",
    saved: false,
    created: "Oct 1, 2023"
  }
];

const Exercises = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedEquipment, setSelectedEquipment] = useState("All");
  const [selectedMuscle, setSelectedMuscle] = useState("All");
  const [selectedTab, setSelectedTab] = useState("all");
  const [showAddExercise, setShowAddExercise] = useState(false);
  const { toast } = useToast();
  
  // Filter exercises based on search term and filters
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || exercise.category === selectedCategory;
    
    const matchesEquipment = selectedEquipment === "All" || exercise.equipment === selectedEquipment;
    
    const matchesMuscle = selectedMuscle === "All" || 
                          exercise.muscleGroups.some(muscle => muscle === selectedMuscle);
    
    const matchesTab = selectedTab === "all" || 
                       (selectedTab === "saved" && exercise.saved);
    
    return matchesSearch && matchesCategory && matchesEquipment && matchesMuscle && matchesTab;
  });
  
  const handleAddExercise = () => {
    setShowAddExercise(false);
    toast({
      title: "Exercise added",
      description: "The exercise has been added to your library."
    });
  };
  
  return (
    <DashboardLayout>
      <Container>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Exercise Library</h1>
            <p className="text-muted-foreground">Browse, save and assign exercises to your clients</p>
          </div>
          
          <Dialog open={showAddExercise} onOpenChange={setShowAddExercise}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Exercise</DialogTitle>
                <DialogDescription>
                  Create a new exercise for your library
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="exercise-name">Exercise Name</Label>
                    <Input id="exercise-name" placeholder="E.g., Barbell Bench Press" />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((cat) => (
                          <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="equipment">Equipment</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select equipment" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipment.slice(1).map((eq) => (
                          <SelectItem key={eq} value={eq.toLowerCase()}>{eq}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="muscle-group">Primary Muscle Group</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select muscle group" />
                      </SelectTrigger>
                      <SelectContent>
                        {muscleGroups.slice(1).map((muscle) => (
                          <SelectItem key={muscle} value={muscle.toLowerCase()}>{muscle}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Describe the exercise briefly" />
                  </div>
                  
                  <div className="col-span-2">
                    <Label htmlFor="instructions">Step-by-Step Instructions</Label>
                    <Textarea id="instructions" placeholder="Provide detailed instructions (one step per line)" rows={5} />
                  </div>
                  
                  <div>
                    <Label htmlFor="image">Image Upload</Label>
                    <div className="border-2 border-dashed rounded-md p-6 mt-1 text-center">
                      <Dumbbell className="mx-auto h-8 w-8 text-muted-foreground" />
                      <div className="mt-2">
                        <Button type="button" variant="outline" size="sm">Add Image</Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">PNG, JPG or GIF up to 5MB</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="video">Video Upload (Optional)</Label>
                    <div className="border-2 border-dashed rounded-md p-6 mt-1 text-center">
                      <Dumbbell className="mx-auto h-8 w-8 text-muted-foreground" />
                      <div className="mt-2">
                        <Button type="button" variant="outline" size="sm">Add Video</Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">MP4 or MOV up to 50MB</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddExercise(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddExercise}>
                  Add Exercise
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="mb-6">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all">All Exercises</TabsTrigger>
                <TabsTrigger value="saved">Saved Exercises</TabsTrigger>
                <TabsTrigger value="custom">Custom Exercises</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search exercises..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label className="mb-2 block">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="mb-2 block">Equipment</Label>
                  <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipment.map((eq) => (
                        <SelectItem key={eq} value={eq}>{eq}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="mb-2 block">Muscle Group</Label>
                  <Select value={selectedMuscle} onValueChange={setSelectedMuscle}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Muscle Groups" />
                    </SelectTrigger>
                    <SelectContent>
                      {muscleGroups.map((muscle) => (
                        <SelectItem key={muscle} value={muscle}>{muscle}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="mb-2 block">Difficulty</Label>
                  <div className="space-x-2">
                    <Badge variant="outline" className="cursor-pointer">Beginner</Badge>
                    <Badge variant="outline" className="cursor-pointer">Intermediate</Badge>
                    <Badge variant="outline" className="cursor-pointer">Advanced</Badge>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredExercises.length > 0 ? (
                filteredExercises.map((exercise) => (
                  <Card key={exercise.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Dumbbell className="h-12 w-12 text-muted-foreground/40" />
                      </div>
                      <Button 
                        size="icon" 
                        variant={exercise.saved ? "default" : "outline"}
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{exercise.name}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {exercise.created}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className={
                          exercise.difficulty === "Beginner" ? "bg-green-100 text-green-800" :
                          exercise.difficulty === "Intermediate" ? "bg-blue-100 text-blue-800" :
                          "bg-red-100 text-red-800"
                        }>
                          {exercise.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3 line-clamp-2">{exercise.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {exercise.muscleGroups.map((muscle, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{muscle}</Badge>
                        ))}
                      </div>
                      <div className="flex justify-between">
                        <Badge variant="outline" className="flex items-center">
                          <Dumbbell className="h-3 w-3 mr-1" />
                          {exercise.equipment}
                        </Badge>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full p-8 text-center border rounded-xl">
                  <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No exercises found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSelectedEquipment("All");
                    setSelectedMuscle("All");
                  }}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </DashboardLayout>
  );
};

export default Exercises;
