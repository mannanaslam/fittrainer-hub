
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

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
  const location = useLocation();
  const { signIn, user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (user && !loading) {
      const from = location.state?.from?.pathname || "/dashboard";
      console.log("User already authenticated, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);
  
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
      
      console.log(`Attempting login for email: ${values.email}`);
      
      const { data, error } = await signIn(values.email, values.password);
      
      if (error) {
        console.error("Login error:", error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
      } else if (data?.session) {
        const from = location.state?.from?.pathname || "/dashboard";
        console.log("Login successful, redirecting to:", from);
        
        toast({
          title: "Login successful",
          description: "You have been successfully logged in.",
        });
        
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login failed:", error);
      setConnectionError(true);
      
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Don't render the login form if the user is already authenticated
  // This prevents flashing of the login form before redirect
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }
  
  if (user) {
    return null; // Will be redirected by the useEffect
  }
  
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
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Login;
