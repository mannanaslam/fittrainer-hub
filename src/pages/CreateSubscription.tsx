
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Info, Plus, DollarSign, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

const CreateSubscription = () => {
  const [features, setFeatures] = useState<string[]>([
    "Access to basic workout plans",
    "Email support",
    ""
  ]);
  
  const [hasTrial, setHasTrial] = useState(true);
  
  const addFeature = () => {
    setFeatures([...features, ""]);
  };
  
  const updateFeature = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };
  
  const removeFeature = (index: number) => {
    if (features.length > 1) {
      const updatedFeatures = [...features];
      updatedFeatures.splice(index, 1);
      setFeatures(updatedFeatures);
    }
  };

  const handleSave = () => {
    toast({
      title: "Subscription Plan Created",
      description: "Your subscription plan has been created successfully.",
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
            <h1 className="text-2xl font-bold mb-2">Create Subscription Plan</h1>
            <p className="text-muted-foreground">
              Define a new subscription offering for your clients, including pricing and features
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card border rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-semibold">Basic Information</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Plan Name</Label>
                    <Input id="name" placeholder="e.g., Premium Fitness" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Plan Description</Label>
                    <textarea 
                      id="description" 
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                      placeholder="Describe what's included in this subscription plan..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-semibold">Pricing & Billing</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Monthly Price ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="price" type="number" className="pl-8" placeholder="19.99" min="0" step="0.01" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="billingCycle">Billing Cycle</Label>
                    <select
                      id="billingCycle"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="trial">Free Trial Period</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow potential clients to try before subscribing
                      </p>
                    </div>
                    <Switch 
                      id="trial" 
                      checked={hasTrial}
                      onCheckedChange={setHasTrial}
                    />
                  </div>
                  
                  {hasTrial && (
                    <div className="mt-4">
                      <Label htmlFor="trialDays">Trial Duration (days)</Label>
                      <Input id="trialDays" type="number" placeholder="7" className="mt-1 w-full sm:w-1/3" min="1" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Plan Features</h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center cursor-help">
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="max-w-xs">
                          List the features and benefits included in this subscription plan
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex space-x-2">
                      <div className="mt-2 text-green-500">
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <Input 
                          value={feature} 
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder="e.g., Access to premium workout plans" 
                        />
                      </div>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeFeature(index)}
                        disabled={features.length <= 1}
                        className="mt-1"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    onClick={addFeature} 
                    className="w-full border-dashed"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </div>
              
              <div className="bg-card border rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-semibold">Content Access</h2>
                
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Select which content should be included in this subscription plan
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="workoutPlans" className="rounded border-gray-300" />
                      <Label htmlFor="workoutPlans">All Workout Plans</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="mealPlans" className="rounded border-gray-300" />
                      <Label htmlFor="mealPlans">All Meal Plans</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="videos" className="rounded border-gray-300" />
                      <Label htmlFor="videos">Exercise Videos</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="personalCoaching" className="rounded border-gray-300" />
                      <Label htmlFor="personalCoaching">Personal Coaching Sessions</Label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Create Plan
                </Button>
              </div>
            </div>
            
            <div>
              <div className="sticky top-24">
                <div className="bg-card border rounded-xl overflow-hidden">
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-bold mb-1">Plan Preview</h3>
                    <p className="text-sm text-muted-foreground">
                      How your plan will appear to clients
                    </p>
                  </div>
                  
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold">Premium Fitness</h3>
                      <div className="mt-2">
                        <span className="text-3xl font-bold">$19.99</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      {hasTrial && (
                        <p className="text-sm mt-2 text-muted-foreground">7-day free trial</p>
                      )}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-3 mb-6">
                      {features.filter(Boolean).map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <div className="text-green-500 mr-2 mt-0.5">
                            <Check className="h-4 w-4" />
                          </div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full">Subscribe Now</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateSubscription;
