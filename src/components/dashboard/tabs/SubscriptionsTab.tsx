
import { Plus, CheckCircle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { useNavigate } from "react-router-dom";

export function SubscriptionsTab() {
  const navigate = useNavigate();
  
  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
        <Button onClick={() => navigate("/subscription/create")}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Plan
        </Button>
      </div>
      <p className="mb-6 text-muted-foreground">
        Manage your subscription offerings, pricing, and monitor subscriber metrics.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border rounded-xl p-6 flex flex-col">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold">Basic Plan</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">$9.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </div>
          <div className="space-y-2 flex-1 mb-6">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>Access to basic workout plans</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>Diet plan recommendations</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>Email support</span>
            </div>
          </div>
          <Button variant="outline" className="w-full">Edit Plan</Button>
        </div>
        
        <div className="border rounded-xl p-6 flex flex-col bg-primary/5 border-primary/30 relative">
          <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold">Premium Plan</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">$19.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </div>
          <div className="space-y-2 flex-1 mb-6">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>All basic features</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>Advanced workout plans</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>Video demonstrations</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>Priority support</span>
            </div>
          </div>
          <Button className="w-full">Edit Plan</Button>
        </div>
        
        <div className="border rounded-xl p-6 flex flex-col">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold">Elite Plan</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">$29.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </div>
          <div className="space-y-2 flex-1 mb-6">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>All premium features</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>1-on-1 virtual sessions</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>Personalized meal plans</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <span>Progress analytics</span>
            </div>
          </div>
          <Button variant="outline" className="w-full">Edit Plan</Button>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Subscriber Analytics</h2>
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="h-60 flex items-center justify-center">
          <div className="text-center">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">Subscription analytics will be displayed here</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
