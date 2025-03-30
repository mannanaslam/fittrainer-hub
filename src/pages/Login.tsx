import { useState, useContext, useEffect } from "react";
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
  
  useEffect(() => {
    navigate("/dashboard");
  }, []);
  
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
      
      toast({
        title: "Demo mode active",
        description: "Authentication is temporarily disabled. Redirecting to dashboard.",
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      
      toast({
        title: "Demo mode active",
        description: "Authentication is temporarily disabled. Redirecting to dashboard.",
      });
      
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };
  
  const tryDemoAccount = async (type: 'trainer' | 'client') => {
    try {
      setIsLoading(true);
      
      const email = type === 'trainer' ? 'trainer@example.com' : 'client@example.com';
      const password = 'password123';
      
      console.log(`Trying demo account: ${email}`);
      form.setValue('email', email);
      form.setValue('password', password);
      
      await signIn(email, password);
      
      toast({
        title: "Demo mode active",
        description: `Logged in as ${type}. Authentication is temporarily disabled.`,
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error("Demo login failed:", error);
      
      toast({
        title: "Demo mode active",
        description: "Authentication is temporarily disabled. Redirecting to dashboard.",
      });
      
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
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
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800 font-medium">Demo Mode Active</p>
                <p className="text-xs text-green-700">Authentication is temporarily disabled.</p>
              </div>
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
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Demo Accounts</h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Trainer:</strong> trainer@example.com / password123</p>
                <p><strong>Client:</strong> client@example.com / password123</p>
              </div>
              <div className="mt-2 flex flex-col space-y-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => tryDemoAccount('trainer')}
                  className="text-xs"
                  disabled={isLoading}
                >
                  Try Trainer Demo
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => tryDemoAccount('client')}
                  className="text-xs"
                  disabled={isLoading}
                >
                  Try Client Demo
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Login;
