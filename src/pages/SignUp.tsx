
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Mail, User, Lock, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

const SignUp = () => {
  const [userType, setUserType] = useState<"client" | "trainer">("client");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCompleteSignUp = () => {
    toast({
      title: "Sign up successful!",
      description: "Welcome to FitTrainer. Your account has been created.",
    });
    
    // Redirect based on user type
    if (userType === "trainer") {
      navigate("/dashboard");
    } else {
      navigate("/"); // Redirect clients to home page
    }
  };

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
              
              <RadioGroup 
                value={userType} 
                onValueChange={(value) => setUserType(value as "client" | "trainer")}
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
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="name" placeholder="John Doe" className="pl-10" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="you@example.com" className="pl-10" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Create a password" 
                      className="pl-10"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
                </div>
                
                <Button className="w-full" onClick={handleContinue}>
                  Continue
                </Button>
              </div>
              
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
          
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">{userType === "trainer" ? "Professional Details" : "Your Fitness Goals"}</h1>
                <p className="text-muted-foreground">Help us personalize your experience</p>
              </div>
              
              {userType === "trainer" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input id="specialization" placeholder="e.g., Strength Training, Yoga, etc." />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (years)</Label>
                    <Input id="experience" type="number" min="0" placeholder="Years of experience" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea 
                      id="bio" 
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                      placeholder="Tell us about yourself and your training philosophy"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>What are your primary fitness goals?</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Weight Loss", "Muscle Gain", "Endurance", "Flexibility"].map((goal) => (
                        <div key={goal} className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:border-primary hover:bg-primary/5">
                          <CheckCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience-level">Experience Level</Label>
                    <select
                      id="experience-level"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select your experience level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="activity-level">Current Activity Level (days per week)</Label>
                    <Input id="activity-level" type="number" min="0" max="7" placeholder="0-7 days" />
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1" onClick={handleBack}>
                  Back
                </Button>
                <Button className="flex-1" onClick={handleContinue}>
                  Continue
                </Button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold">Final Step</h1>
                <p className="text-muted-foreground">Choose your subscription plan</p>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-xl p-4 space-y-3 hover:border-primary hover:bg-primary/5 cursor-pointer">
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
                
                <div className="border rounded-xl p-4 space-y-3 border-primary bg-primary/5 cursor-pointer">
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
                  <div className="border rounded-xl p-4 space-y-3 hover:border-primary hover:bg-primary/5 cursor-pointer">
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
              </div>
              
              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1" onClick={handleBack}>
                  Back
                </Button>
                <Button className="flex-1" onClick={handleCompleteSignUp}>
                  Complete Sign Up
                </Button>
              </div>
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};

export default SignUp;
