
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Plus, DollarSign, Check, Trash2 } from "lucide-react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const subscriptionFormSchema = z.object({
  name: z.string().min(3, "Plan name must be at least 3 characters"),
  description: z.string().min(10, "Description should be more detailed"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  billingCycle: z.string().min(1, "Please select a billing cycle"),
  hasTrial: z.boolean(),
  trialDays: z.union([
    z.coerce.number().min(1, "Trial period must be at least 1 day"),
    z.undefined()
  ]),
  features: z.array(z.string().min(1, "Feature description is required")),
  accessRights: z.object({
    workoutPlans: z.boolean().optional(),
    mealPlans: z.boolean().optional(),
    videos: z.boolean().optional(),
    personalCoaching: z.boolean().optional()
  })
});

type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

const CreateSubscription = () => {
  const navigate = useNavigate();
  
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 19.99,
      billingCycle: "monthly",
      hasTrial: true,
      trialDays: 7,
      features: ["Access to basic workout plans", "Email support", ""],
      accessRights: {
        workoutPlans: false,
        mealPlans: false,
        videos: false,
        personalCoaching: false
      }
    }
  });
  
  const hasTrial = form.watch("hasTrial");
  const planName = form.watch("name") || "Premium Fitness";
  const planPrice = form.watch("price") || 19.99;
  const features = form.watch("features") || [];
  
  const addFeature = () => {
    const currentFeatures = form.getValues("features");
    form.setValue("features", [...currentFeatures, ""]);
  };
  
  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues("features");
    if (currentFeatures.length > 1) {
      const updatedFeatures = [...currentFeatures];
      updatedFeatures.splice(index, 1);
      form.setValue("features", updatedFeatures);
    }
  };

  const handleSave = (values: SubscriptionFormValues) => {
    console.log("Subscription plan data:", values);
    
    toast({
      title: "Subscription Plan Created",
      description: "Your subscription plan has been created successfully.",
    });
    
    // Navigate back to dashboard after creation
    navigate("/dashboard");
  };

  const handleCancel = () => {
    toast({
      title: "Operation Cancelled",
      description: "Subscription plan creation was cancelled.",
    });
    navigate("/dashboard");
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
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-card border rounded-xl p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Basic Information</h2>
                    
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Plan Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Premium Fitness" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Plan Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe what's included in this subscription plan..." 
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-card border rounded-xl p-6 space-y-6">
                    <h2 className="text-xl font-semibold">Pricing & Billing</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Monthly Price ($)</FormLabel>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <FormControl>
                                <Input 
                                  type="number" 
                                  className="pl-8" 
                                  placeholder="19.99" 
                                  min="0" 
                                  step="0.01" 
                                  {...field} 
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="billingCycle"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Billing Cycle</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              >
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="annually">Annually</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="pt-2">
                      <FormField
                        control={form.control}
                        name="hasTrial"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Free Trial Period</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Allow potential clients to try before subscribing
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      {hasTrial && (
                        <FormField
                          control={form.control}
                          name="trialDays"
                          render={({ field }) => (
                            <FormItem className="mt-4 space-y-2">
                              <FormLabel>Trial Duration (days)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="7" 
                                  className="w-full sm:w-1/3" 
                                  min="1" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
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
                              onChange={(e) => {
                                const newFeatures = [...features];
                                newFeatures[index] = e.target.value;
                                form.setValue("features", newFeatures);
                              }}
                              placeholder="e.g., Access to premium workout plans" 
                            />
                            {form.formState.errors.features?.[index] && (
                              <p className="text-sm font-medium text-destructive mt-1">
                                {String(form.formState.errors.features[index]?.message)}
                              </p>
                            )}
                          </div>
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeFeature(index)}
                            disabled={features.length <= 1}
                            className="mt-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <Button 
                        type="button"
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
                        <FormField
                          control={form.control}
                          name="accessRights.workoutPlans"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange} 
                                  id="workoutPlans" 
                                />
                              </FormControl>
                              <FormLabel htmlFor="workoutPlans" className="cursor-pointer">
                                All Workout Plans
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="accessRights.mealPlans"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange} 
                                  id="mealPlans" 
                                />
                              </FormControl>
                              <FormLabel htmlFor="mealPlans" className="cursor-pointer">
                                All Meal Plans
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="accessRights.videos"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange} 
                                  id="videos" 
                                />
                              </FormControl>
                              <FormLabel htmlFor="videos" className="cursor-pointer">
                                Exercise Videos
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="accessRights.personalCoaching"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox 
                                  checked={field.value} 
                                  onCheckedChange={field.onChange} 
                                  id="personalCoaching" 
                                />
                              </FormControl>
                              <FormLabel htmlFor="personalCoaching" className="cursor-pointer">
                                Personal Coaching Sessions
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit">
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
                          <h3 className="text-xl font-bold">{planName}</h3>
                          <div className="mt-2">
                            <span className="text-3xl font-bold">${planPrice.toFixed(2)}</span>
                            <span className="text-muted-foreground">/month</span>
                          </div>
                          {hasTrial && (
                            <p className="text-sm mt-2 text-muted-foreground">
                              {form.watch("trialDays") || 7}-day free trial
                            </p>
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
            </form>
          </Form>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateSubscription;
