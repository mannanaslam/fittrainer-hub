
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell, Mail, Lock, Eye, EyeOff, WifiOff } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { AuthContext } from "@/App";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  
  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      setConnectionError(false);
      
      // Log attempt for debugging
      console.log(`Attempting login for email: ${values.email}`);
      
      const { data, error } = await signIn(values.email, values.password);
      
      if (error) {
        console.error("Login error:", error);
        
        // Check if it's a network/connection error
        if (error.message?.includes('fetch') || error.status === 0) {
          setConnectionError(true);
          throw new Error("Connection error. Please check your internet connection and try again.");
        }
        
        throw error;
      }
      
      console.log("Login successful:", data);
      
      toast({
        title: "Login successful",
        description: "Welcome back to FitTrainer",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      
      toast({
        title: "Login failed",
        description: error instanceof Error 
          ? error.message 
          : "Connection error. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Try the demo accounts if there's a connection error
  const tryDemoAccount = async (type: 'trainer' | 'client') => {
    const email = type === 'trainer' ? 'trainer@example.com' : 'client@example.com';
    form.setValue('email', email);
    form.setValue('password', 'password123');
    await onSubmit({ email, password: 'password123' });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Container className="max-w-md">
          <div className="flex justify-center mb-8">
            <Link to="/" className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold">FitTrainer</span>
            </Link>
          </div>
          
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground">Sign in to your account to continue</p>
            </div>
            
            {connectionError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <WifiOff className="h-5 w-5 text-yellow-500" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Connection error</p>
                    <p>There seems to be an issue connecting to our servers. Please check your internet connection and try again.</p>
                  </div>
                </div>
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Email</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input 
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
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link to="/reset-password" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            className="pl-10" 
                            {...field} 
                          />
                        </FormControl>
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3"
                        >
                          {showPassword ? 
                            <EyeOff className="h-4 w-4 text-muted-foreground" /> : 
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          }
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
            
            {/* Demo accounts for testing */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Demo Accounts</h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Trainer:</strong> trainer@example.com / password123</p>
                <p><strong>Client:</strong> client@example.com / password123</p>
              </div>
              {connectionError && (
                <div className="mt-2 flex flex-col space-y-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => tryDemoAccount('trainer')}
                    className="text-xs"
                  >
                    Try Trainer Demo
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => tryDemoAccount('client')}
                    className="text-xs"
                  >
                    Try Client Demo
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Login;
