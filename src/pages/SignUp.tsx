import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Mail, User, Lock, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
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
import { useAuth } from "@/hooks/useAuth";

const stepOneSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  userType: z.enum(["client", "trainer"])
});

const trainerStepTwoSchema = z.object({
  specialization: z.string().min(3, "Please specify your specialization"),
  experience: z.number().min(0, "Experience cannot be negative"),
  bio: z.string().min(20, "Bio should be at least 20 characters")
});

const clientStepTwoSchema = z.object({
  goals: z.array(z.string()).min(1, "Please select at least one goal"),
  experienceLevel: z.string().min(1, "Please select your experience level"),
  activityLevel: z.number().min(0, "Activity level cannot be negative").max(7, "Activity level cannot exceed 7 days")
});

const stepThreeSchema = z.object({
  plan: z.string().min(1, "Please select a subscription plan")
});

const SignUp = () => {
  const [userType, setUserType] = useState<"client" | "trainer">("client");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>("free");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();
  
  const stepOneForm = useForm<z.infer<typeof stepOneSchema>>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      userType: "client"
    }
  });

  const trainerStepTwoForm = useForm<z.infer<typeof trainerStepTwoSchema>>({
    resolver: zodResolver(trainerStepTwoSchema),
    defaultValues: {
      specialization: "",
      experience: 0,
      bio: ""
    }
  });

  const clientStepTwoForm = useForm<z.infer<typeof clientStepTwoSchema>>({
    resolver: zodResolver(clientStepTwoSchema),
    defaultValues: {
      goals: [],
      experienceLevel: "",
      activityLevel: 0
    }
  });

  const stepThreeForm = useForm<z.infer<typeof stepThreeSchema>>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: {
      plan: "free"
    }
  });
  
  const handleContinue = async () => {
    if (step === 1) {
      const valid = await stepOneForm.trigger();
      if (valid) {
        const values = stepOneForm.getValues();
        setUserType(values.userType);
        setStep(2);
      }
    } else if (step === 2) {
      if (userType === "trainer") {
        const valid = await trainerStepTwoForm.trigger();
        if (valid) {
          setStep(3);
        }
      } else {
        const valid = await clientStepTwoForm.trigger();
        if (valid) {
          setStep(3);
        }
      }
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleToggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
      clientStepTwoForm.setValue("goals", selectedGoals.filter(g => g !== goal));
    } else {
      const newGoals = [...selectedGoals, goal];
      setSelectedGoals(newGoals);
      clientStepTwoForm.setValue("goals", newGoals);
    }
  };

  const handlePlanSelection = (plan: string) => {
    setSelectedPlan(plan);
    stepThreeForm.setValue("plan", plan);
  };

  const handleCompleteSignUp = async () => {
    const valid = await stepThreeForm.trigger();
    if (!valid) return;

    const stepOneData = stepOneForm.getValues();
    const { userType } = stepOneData;
    
    const stepTwoData = userType === "trainer" 
      ? trainerStepTwoForm.getValues() 
      : clientStepTwoForm.getValues();
    
    const stepThreeData = stepThreeForm.getValues();
    
    const userData = {
      ...stepOneData,
      plan: stepThreeData.plan
    };
    
    console.log("User data to be saved:", userData);
    
    setIsSubmitting(true);
    
    try {
      const { name, email, password } = userData;
      
      const additionalData = userType === "trainer" 
        ? {
            specialization: (stepTwoData as typeof trainerStepTwoForm["_formValues"]).specialization,
            experience: (stepTwoData as typeof trainerStepTwoForm["_formValues"]).experience,
            bio: (stepTwoData as typeof trainerStepTwoForm["_formValues"]).bio,
          } 
        : {
            goals: (stepTwoData as typeof clientStepTwoForm["_formValues"]).goals,
            experienceLevel: (stepTwoData as typeof clientStepTwoForm["_formValues"]).experienceLevel,
            activityLevel: (stepTwoData as typeof clientStepTwoForm["_formValues"]).activityLevel,
          };
      
      const { data, error } = await signUp(email, password, {
        name,
        userType,
        ...additionalData,
        plan: userData.plan
      });
      
      if (error) {
        console.error("Sign up error:", error);
        toast({
          title: "Sign up failed",
          description: error.message || "There was a problem creating your account",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Sign up successful:", data);
      
      toast({
        title: "Sign up successful!",
        description: "Please check your email to confirm your account.",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Error during sign up:", error);
      toast({
        title: "Sign up failed",
        description: "There was a problem creating your account",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goals = ["Weight Loss", "Muscle Gain", "Endurance", "Flexibility"];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Container className="max-w-md">
          <div className="flex justify-center mb-6">
            <Link to="/" className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold">FitTrainer</span>
            </Link>
          </div>
          
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground">Join FitTrainer and start your fitness journey</p>
              </div>
              
              <Form {...stepOneForm}>
                <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-4">
                  <FormField
                    control={stepOneForm.control}
                    name="userType"
                    render={({ field }) => (
                      <FormItem>
                        <RadioGroup 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setUserType(value as "client" | "trainer");
                          }}
                          value={field.value} 
                          className="grid grid-cols-2 gap-4"
                        >
                          <div className="relative">
                            <RadioGroupItem 
                              value="client" 
                              id="client" 
                              className="absolute right-3 top-3 peer sr-only" 
                            />
                            <Label 
                              htmlFor="client" 
                              className="flex flex-col items-center justify-between border rounded-xl p-4 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-secondary h-full"
                            >
                              <User className="h-8 w-8 mb-2" />
                              <span className="font-medium">Client</span>
                              <span className="text-xs text-muted-foreground mt-1">Looking for a trainer</span>
                            </Label>
                          </div>
                          
                          <div className="relative">
                            <RadioGroupItem 
                              value="trainer" 
                              id="trainer" 
                              className="absolute right-3 top-3 peer sr-only" 
                            />
                            <Label 
                              htmlFor="trainer" 
                              className="flex flex-col items-center justify-between border rounded-xl p-4 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-secondary h-full"
                            >
                              <Dumbbell className="h-8 w-8 mb-2" />
                              <span className="font-medium">Trainer</span>
                              <span className="text-xs text-muted-foreground mt-1">Offering services</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={stepOneForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Full Name</FormLabel>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input 
                              placeholder="John Doe" 
                              className="pl-10" 
                              {...field} 
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={stepOneForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Email</FormLabel>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="you@example.com" 
                              className="pl-10" 
                              {...field} 
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={stepOneForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Password</FormLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <FormControl>
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Create a password" 
                              className="pl-10" 
                              {...field} 
                            />
                          </FormControl>
                          <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">
                    Continue
                  </Button>
                </form>
              </Form>
              
              <div className="text-center space-y-2">
                <div className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Log in
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && userType === "trainer" && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Professional Details</h1>
                <p className="text-muted-foreground">Help us personalize your experience</p>
              </div>
              
              <Form {...trainerStepTwoForm}>
                <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-4">
                  <FormField
                    control={trainerStepTwoForm.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Specialization</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Strength Training, Yoga, etc." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={trainerStepTwoForm.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Experience (years)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            placeholder="Years of experience" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={trainerStepTwoForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about yourself and your training philosophy" 
                            className="min-h-[100px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex space-x-3">
                    <Button variant="outline" type="button" className="flex-1" onClick={handleBack}>
                      Back
                    </Button>
                    <Button type="submit" className="flex-1">
                      Continue
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
          
          {step === 2 && userType === "client" && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Your Fitness Goals</h1>
                <p className="text-muted-foreground">Help us personalize your experience</p>
              </div>
              
              <Form {...clientStepTwoForm}>
                <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-4">
                  <FormField
                    control={clientStepTwoForm.control}
                    name="goals"
                    render={() => (
                      <FormItem className="space-y-2">
                        <FormLabel>What are your primary fitness goals?</FormLabel>
                        <div className="grid grid-cols-2 gap-3">
                          {goals.map((goal) => (
                            <div 
                              key={goal} 
                              className={`flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-primary hover:bg-primary/5 ${selectedGoals.includes(goal) ? 'border-primary bg-primary/5' : ''}`}
                              onClick={() => handleToggleGoal(goal)}
                            >
                              <CheckCircle className={`h-4 w-4 ${selectedGoals.includes(goal) ? 'text-primary' : 'text-muted-foreground'}`} />
                              <span className="text-sm">{goal}</span>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={clientStepTwoForm.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Experience Level</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="">Select your experience level</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={clientStepTwoForm.control}
                    name="activityLevel"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Current Activity Level (days per week)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="7" 
                            placeholder="0-7 days" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex space-x-3">
                    <Button variant="outline" type="button" className="flex-1" onClick={handleBack}>
                      Back
                    </Button>
                    <Button type="submit" className="flex-1">
                      Continue
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Final Step</h1>
                <p className="text-muted-foreground">Choose your subscription plan</p>
              </div>
              
              <Form {...stepThreeForm}>
                <form onSubmit={(e) => { e.preventDefault(); handleCompleteSignUp(); }} className="space-y-4">
                  <FormField
                    control={stepThreeForm.control}
                    name="plan"
                    render={() => (
                      <FormItem className="space-y-4">
                        <div 
                          className={`border rounded-xl p-4 space-y-3 hover:border-primary hover:bg-primary/5 cursor-pointer ${selectedPlan === 'free' ? 'border-primary bg-primary/5' : ''}`}
                          onClick={() => handlePlanSelection('free')}
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold">Free Plan</h3>
                            <span className="text-lg font-bold">$0</span>
                          </div>
                          <Separator />
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-primary mr-2" />
                              <span>Basic workout templates</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-primary mr-2" />
                              <span>Community forum access</span>
                            </li>
                            <li className="flex items-center opacity-50">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              <span>Limited video resources</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div 
                          className={`border rounded-xl p-4 space-y-3 hover:border-primary hover:bg-primary/5 cursor-pointer ${selectedPlan === 'premium' ? 'border-primary bg-primary/5' : ''}`}
                          onClick={() => handlePlanSelection('premium')}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">Premium Plan</h3>
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Most Popular</span>
                            </div>
                            <span className="text-lg font-bold">$9.99<span className="text-sm font-normal">/mo</span></span>
                          </div>
                          <Separator />
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-primary mr-2" />
                              <span>All features from Free Plan</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-primary mr-2" />
                              <span>Unlimited workout plans</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-primary mr-2" />
                              <span>Full video library access</span>
                            </li>
                            <li className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-primary mr-2" />
                              <span>Nutrition tracking & meal plans</span>
                            </li>
                          </ul>
                        </div>
                        
                        {userType === "trainer" && (
                          <div 
                            className={`border rounded-xl p-4 space-y-3 hover:border-primary hover:bg-primary/5 cursor-pointer ${selectedPlan === 'pro' ? 'border-primary bg-primary/5' : ''}`}
                            onClick={() => handlePlanSelection('pro')}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-semibold">Pro Trainer Plan</h3>
                                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">For Trainers</span>
                              </div>
                              <span className="text-lg font-bold">$29.99<span className="text-sm font-normal">/mo</span></span>
                            </div>
                            <Separator />
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                <span>Client management tools</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                <span>Workout plan creation</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                <span>Video upload capabilities</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                <span>Payment processing</span>
                              </li>
                              <li className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                                <span>Analytics dashboard</span>
                              </li>
                            </ul>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex space-x-3">
                    <Button variant="outline" type="button" className="flex-1" onClick={handleBack} disabled={isSubmitting}>
                      Back
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                      {isSubmitting ? "Creating Account..." : "Complete Sign Up"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};

export default SignUp;
