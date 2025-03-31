
import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
}

function Testimonial({ name, role, content, rating, image }: TestimonialProps) {
  return (
    <div className="glass-card p-6 rounded-xl h-full flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center">
          {image ? (
            <img src={image} alt={name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xl font-bold text-primary">{name.charAt(0)}</span>
          )}
        </div>
        <div>
          <h4 className="font-medium">{name}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
      
      <div className="flex items-center mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "text-amber-500 fill-amber-500" : "text-muted"}`}
          />
        ))}
      </div>
      
      <blockquote className="text-muted-foreground flex-1">
        "{content}"
      </blockquote>
    </div>
  );
}

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Fitness Enthusiast",
      content: "FitTrainer has completely transformed how I manage my clients. The workout builder is intuitive and my clients love the video demonstrations!",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Personal Trainer",
      content: "I've tried many platforms, but none compare to FitTrainer. The client tracking features save me hours every week, and my business has grown by 30%.",
      rating: 5,
    },
    {
      name: "Aisha Williams",
      role: "Nutrition Coach",
      content: "The meal planning tools are exceptional. I can quickly create personalized nutrition plans for all my clients with just a few clicks.",
      rating: 4,
    },
    {
      name: "David Chen",
      role: "Gym Owner",
      content: "We use FitTrainer for all our trainers. The subscription management has simplified our billing, and clients appreciate the professional experience.",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-secondary/50">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-xl text-muted-foreground">
            Hear from trainers who have transformed their fitness business with our platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              content={testimonial.content}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
