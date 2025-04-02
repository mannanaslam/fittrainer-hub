
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";
import { useAuth } from "@/hooks/useAuth";

export function Hero() {
  const { user } = useAuth();
  
  return (
    <div className="relative pt-28 pb-20 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>
      
      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6 animate-fade-in">
            Revolutionizing fitness management
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in [animation-delay:200ms]">
            Manage Your Fitness Business <span className="text-primary">Effortlessly</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in [animation-delay:400ms]">
            Create, deliver, and monetize personalized workout and diet plans — all in one beautiful platform. Elevate your client's fitness journey.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:600ms]">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
            )}
            <Link to="/#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Preview Image */}
        <div className="mt-16 animate-fade-in [animation-delay:800ms]">
          <div className="relative mx-auto max-w-5xl">
            <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[16/9] bg-muted p-2">
                <div className="w-full h-full bg-secondary rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Dashboard Preview</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 -left-4 h-24 bg-gradient-to-t from-background to-transparent z-10"></div>
          </div>
        </div>
      </Container>
    </div>
  );
}
