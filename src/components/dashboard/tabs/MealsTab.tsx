
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { useNavigate } from "react-router-dom";

export function MealsTab() {
  const navigate = useNavigate();
  
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
      
      <div className="glass-card rounded-xl p-6 mb-6">
        <p className="text-center py-12">
          This is where your meal plans will appear. 
          <br />Create your first meal plan by clicking the button above.
        </p>
      </div>
    </Container>
  );
}
