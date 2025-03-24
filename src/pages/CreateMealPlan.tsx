
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Utensils, 
  Clock, 
  Info,
  MoveUp,
  MoveDown,
  Calculator,
  UtensilsCrossed
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { toast } from "@/hooks/use-toast";

interface Meal {
  id: string;
  name: string;
  description: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  ingredients: string;
  instructions: string;
  imageUrl?: string;
}

const CreateMealPlan = () => {
  const [dietType, setDietType] = useState("balanced");
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: "meal1",
      name: "",
      description: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      ingredients: "",
      instructions: "",
    }
  ]);
  
  const addMeal = () => {
    setMeals([
      ...meals,
      {
        id: `meal${meals.length + 1}`,
        name: "",
        description: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        ingredients: "",
        instructions: "",
      }
    ]);
  };
  
  const removeMeal = (id: string) => {
    if (meals.length > 1) {
      setMeals(meals.filter(meal => meal.id !== id));
    }
  };
  
  const moveMeal = (id: string, direction: "up" | "down") => {
    const index = meals.findIndex(meal => meal.id === id);
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === meals.length - 1)
    ) {
      return;
    }
    
    const newMeals = [...meals];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    [newMeals[index], newMeals[targetIndex]] = 
      [newMeals[targetIndex], newMeals[index]];
    
    setMeals(newMeals);
  };
  
  const updateMeal = (id: string, field: keyof Meal, value: string) => {
    setMeals(
      meals.map(meal => 
        meal.id === id ? { ...meal, [field]: value } : meal
      )
    );
  };

  const handleSave = () => {
    toast({
      title: "Meal Plan Saved",
      description: "Your meal plan has been saved successfully.",
    });
  };

  const handlePublish = () => {
    toast({
      title: "Meal Plan Published",
      description: "Your meal plan has been published and is now available to clients.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <Container>
          <div className="mb-6">
            <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Create New Meal Plan</h1>
            <p className="text-muted-foreground">
              Design a nutritional meal plan for your clients with detailed recipes and macro information
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-card border rounded-xl p-6 space-y-6">
              <h2 className="text-xl font-semibold">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Meal Plan Name</Label>
                  <Input id="name" placeholder="e.g., High Protein Weight Loss Plan" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input id="duration" type="number" placeholder="e.g., 7" min="1" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetCalories">Target Daily Calories</Label>
                  <Input id="targetCalories" type="number" placeholder="e.g., 2000" min="500" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Cooking Skill Level</Label>
                  <select
                    id="difficulty"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select skill level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea 
                    id="description" 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                    placeholder="Describe the meal plan, its benefits, and who it's designed for..."
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Diet Type</Label>
                <RadioGroup 
                  value={dietType} 
                  onValueChange={setDietType}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                >
                  <div className="relative">
                    <RadioGroupItem 
                      value="balanced" 
                      id="balanced" 
                      className="absolute right-3 top-3 peer sr-only" 
                    />
                    <Label 
                      htmlFor="balanced" 
                      className="flex flex-col items-center justify-between border rounded-xl p-4 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-secondary h-full"
                    >
                      <Utensils className="h-8 w-8 mb-2" />
                      <span className="font-medium">Balanced</span>
                    </Label>
                  </div>
                  
                  <div className="relative">
                    <RadioGroupItem 
                      value="lowCarb" 
                      id="lowCarb" 
                      className="absolute right-3 top-3 peer sr-only" 
                    />
                    <Label 
                      htmlFor="lowCarb" 
                      className="flex flex-col items-center justify-between border rounded-xl p-4 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-secondary h-full"
                    >
                      <UtensilsCrossed className="h-8 w-8 mb-2" />
                      <span className="font-medium">Low Carb</span>
                    </Label>
                  </div>
                  
                  <div className="relative">
                    <RadioGroupItem 
                      value="highProtein" 
                      id="highProtein" 
                      className="absolute right-3 top-3 peer sr-only" 
                    />
                    <Label 
                      htmlFor="highProtein" 
                      className="flex flex-col items-center justify-between border rounded-xl p-4 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-secondary h-full"
                    >
                      <Calculator className="h-8 w-8 mb-2" />
                      <span className="font-medium">High Protein</span>
                    </Label>
                  </div>
                  
                  <div className="relative">
                    <RadioGroupItem 
                      value="vegan" 
                      id="vegan" 
                      className="absolute right-3 top-3 peer sr-only" 
                    />
                    <Label 
                      htmlFor="vegan" 
                      className="flex flex-col items-center justify-between border rounded-xl p-4 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-secondary h-full"
                    >
                      <Utensils className="h-8 w-8 mb-2" />
                      <span className="font-medium">Vegan</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            <div className="bg-card border rounded-xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Meals</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center cursor-help">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p className="max-w-xs">
                        Add all meals for this plan. Include detailed ingredients, instructions, and nutritional information.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="space-y-6">
                {meals.map((meal, index) => (
                  <div 
                    key={meal.id} 
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Meal {index + 1}</h3>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => moveMeal(meal.id, "up")}
                          disabled={index === 0}
                          className="h-8 w-8"
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => moveMeal(meal.id, "down")}
                          disabled={index === meals.length - 1}
                          className="h-8 w-8"
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeMeal(meal.id)}
                          disabled={meals.length === 1}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${meal.id}`}>Meal Name</Label>
                        <Input 
                          id={`name-${meal.id}`} 
                          placeholder="e.g., Protein-Packed Breakfast Bowl" 
                          value={meal.name}
                          onChange={(e) => updateMeal(meal.id, "name", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`description-${meal.id}`}>Brief Description</Label>
                        <Input 
                          id={`description-${meal.id}`} 
                          placeholder="e.g., A nutrient-rich breakfast with eggs, oats, and berries" 
                          value={meal.description}
                          onChange={(e) => updateMeal(meal.id, "description", e.target.value)}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium mb-3">Nutritional Information</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`calories-${meal.id}`}>Calories</Label>
                            <Input 
                              id={`calories-${meal.id}`} 
                              placeholder="e.g., 450" 
                              value={meal.calories}
                              onChange={(e) => updateMeal(meal.id, "calories", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`protein-${meal.id}`}>Protein (g)</Label>
                            <Input 
                              id={`protein-${meal.id}`} 
                              placeholder="e.g., 30" 
                              value={meal.protein}
                              onChange={(e) => updateMeal(meal.id, "protein", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`carbs-${meal.id}`}>Carbs (g)</Label>
                            <Input 
                              id={`carbs-${meal.id}`} 
                              placeholder="e.g., 45" 
                              value={meal.carbs}
                              onChange={(e) => updateMeal(meal.id, "carbs", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`fat-${meal.id}`}>Fat (g)</Label>
                            <Input 
                              id={`fat-${meal.id}`} 
                              placeholder="e.g., 15" 
                              value={meal.fat}
                              onChange={(e) => updateMeal(meal.id, "fat", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor={`ingredients-${meal.id}`}>Ingredients</Label>
                        <textarea 
                          id={`ingredients-${meal.id}`} 
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                          placeholder="List all ingredients and quantities..."
                          value={meal.ingredients}
                          onChange={(e) => updateMeal(meal.id, "ingredients", e.target.value)}
                        />
                      </div>
                      
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor={`instructions-${meal.id}`}>Cooking Instructions</Label>
                        <textarea 
                          id={`instructions-${meal.id}`} 
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                          placeholder="Step-by-step instructions on how to prepare this meal..."
                          value={meal.instructions}
                          onChange={(e) => updateMeal(meal.id, "instructions", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`image-${meal.id}`}>
                          Image URL
                          <span className="text-xs text-muted-foreground ml-2">(optional)</span>
                        </Label>
                        <div className="flex space-x-2">
                          <div className="flex-1">
                            <Input 
                              id={`image-${meal.id}`} 
                              placeholder="Paste image URL" 
                              value={meal.imageUrl || ""}
                              onChange={(e) => updateMeal(meal.id, "imageUrl", e.target.value)}
                            />
                          </div>
                          <Button variant="outline" type="button">
                            Upload
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  onClick={addMeal} 
                  className="w-full border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Meal
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleSave}>
                Save as Draft
              </Button>
              <Button onClick={handlePublish}>
                Publish Meal Plan
              </Button>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateMealPlan;
