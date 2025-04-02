
import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { MealPlan } from "@/types/supabase";
import { Badge } from "@/components/ui/badge";

export function MealsTab() {
  const navigate = useNavigate();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for demonstration
  useEffect(() => {
    const mockMealPlans: MealPlan[] = [
      {
        id: "1",
        created_at: new Date().toISOString(),
        trainer_id: "trainer-1",
        client_id: "client-1",
        title: "Weight Loss Meal Plan",
        description: "Low calorie meal plan focused on fat loss",
        meals: [
          {
            name: "Breakfast",
            time: "8:00 AM",
            calories: 350,
            protein: 25,
            carbs: 30,
            fats: 15,
            notes: "High protein breakfast"
          },
          {
            name: "Lunch",
            time: "12:30 PM",
            calories: 450,
            protein: 35,
            carbs: 40,
            fats: 15,
            notes: "Include green vegetables"
          }
        ]
      },
      {
        id: "2",
        created_at: new Date().toISOString(),
        trainer_id: "trainer-1",
        client_id: "client-2",
        title: "Muscle Building Plan",
        description: "High protein plan for muscle growth",
        meals: [
          {
            name: "Breakfast",
            time: "7:00 AM",
            calories: 500,
            protein: 40,
            carbs: 60,
            fats: 10,
            notes: "Protein shake and oats"
          },
          {
            name: "Mid-morning Snack",
            time: "10:00 AM",
            calories: 250,
            protein: 20,
            carbs: 20,
            fats: 10,
            notes: "Greek yogurt and nuts"
          }
        ]
      }
    ];
    
    setTimeout(() => {
      setMealPlans(mockMealPlans);
      setIsLoading(false);
    }, 500);
  }, []);
  
  const filteredMealPlans = mealPlans.filter(plan => 
    plan.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    plan.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meal Plans</h1>
        <Button onClick={() => navigate("/meal-plan/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Meal Plan
        </Button>
      </div>
      <p className="mb-6 text-muted-foreground">
        Create and manage nutritional plans for your clients.
      </p>
      
      <div className="flex justify-between mb-6">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search meal plans..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm">All Plans</Button>
          <Button variant="outline" size="sm">Recently Added</Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="glass-card rounded-xl p-6 mb-6 flex justify-center">
          <div className="animate-pulse">Loading meal plans...</div>
        </div>
      ) : filteredMealPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredMealPlans.map((plan) => (
            <div key={plan.id} className="glass-card rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-5 border-b border-border/50">
                <h3 className="font-semibold mb-1">{plan.title}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <div className="p-4">
                <div className="flex justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground">Meals: {plan.meals.length}</span>
                  <Badge variant="outline">
                    {new Date(plan.created_at).toLocaleDateString()}
                  </Badge>
                </div>
                <ul className="space-y-2 mb-4">
                  {plan.meals.slice(0, 2).map((meal, index) => (
                    <li key={index} className="text-sm">
                      <span className="font-medium">{meal.name}</span> • {meal.time} • 
                      <span className="text-muted-foreground"> {meal.calories} kcal</span>
                    </li>
                  ))}
                  {plan.meals.length > 2 && (
                    <li className="text-xs text-muted-foreground">+ {plan.meals.length - 2} more meals</li>
                  )}
                </ul>
                <div className="flex space-x-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/meal-plan/${plan.id}`)}>
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">Assign</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-6 mb-6">
          <p className="text-center py-8">
            {searchQuery 
              ? `No meal plans found matching "${searchQuery}"`
              : "No meal plans available. Create your first meal plan by clicking the button above."}
          </p>
        </div>
      )}
    </Container>
  );
}
