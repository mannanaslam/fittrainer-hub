
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Pricing() {
  const plans = [
    {
      name: "Basic",
      price: 29,
      description: "Perfect for independent trainers just getting started",
      features: [
        "Up to 10 clients",
        "Workout plan creation",
        "Client progress tracking",
        "Email support",
      ],
      limitations: [
        "No meal plan creation",
        "No custom branding",
        "No API access",
      ],
      popular: false,
      ctaText: "Get Started",
    },
    {
      name: "Professional",
      price: 79,
      description: "For growing fitness businesses with more clients",
      features: [
        "Up to 50 clients",
        "Workout plan creation",
        "Meal plan creation",
        "Client progress tracking",
        "Custom branding",
        "Priority support",
      ],
      limitations: ["No API access"],
      popular: true,
      ctaText: "Start Free Trial",
    },
    {
      name: "Enterprise",
      price: 199,
      description: "For established fitness studios and gym chains",
      features: [
        "Unlimited clients",
        "Workout plan creation",
        "Meal plan creation",
        "Client progress tracking",
        "Custom branding",
        "API access",
        "Dedicated account manager",
        "Advanced analytics",
      ],
      limitations: [],
      popular: false,
      ctaText: "Contact Sales",
    },
  ];

  return (
    <section id="pricing" className="py-20">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your fitness business. No hidden fees,
            no contracts, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl overflow-hidden border bg-background shadow-sm transition-all duration-300 hover:shadow-md ${
                plan.popular
                  ? "ring-2 ring-primary relative shadow-md"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 uppercase tracking-wider rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground text-sm mb-6">
                  {plan.description}
                </p>
                <Link to="/signup">
                  <Button 
                    className="w-full mb-6" 
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.ctaText}
                  </Button>
                </Link>
                
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.map((limitation) => (
                    <div key={limitation} className="flex items-start text-muted-foreground">
                      <span className="h-5 w-5 flex items-center justify-center shrink-0 mr-2">-</span>
                      <span className="text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
