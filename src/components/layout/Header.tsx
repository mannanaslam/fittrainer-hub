import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dumbbell, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { mainNavItems } from "./navigation";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        isScrolled ? "bg-white shadow-md" : "bg-white/95"
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold">FitTrainer</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {mainNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.path && "text-primary"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="animate-pulse bg-secondary h-10 w-20 rounded"></div>
            ) : user ? (
              <Link to="/dashboard">
                <Button className="bg-primary text-white hover:bg-primary/90">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary/10">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-primary text-white hover:bg-primary/90">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </Container>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="bg-white mt-4 mx-4 rounded-xl overflow-hidden shadow-lg border">
            <div className="py-4 px-2">
              <nav className="flex flex-col space-y-4">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                      location.pathname === item.path 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-secondary"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="border-t border-border my-2" />
                <div className="flex flex-col space-y-2 px-4 pt-2">
                  {loading ? (
                    <div className="animate-pulse bg-secondary h-10 rounded"></div>
                  ) : user ? (
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-primary text-white hover:bg-primary/90">
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary/10">
                          Log in
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full bg-primary text-white hover:bg-primary/90">
                          Sign up
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
