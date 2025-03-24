
import { 
  Dumbbell, 
  Users, 
  VideoIcon, 
  CreditCard, 
  BarChart, 
  MessageSquare 
} from "lucide-react";
import { Container } from "@/components/ui/Container";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="group relative">
      <div className="glass-card rounded-xl p-6 transition-all duration-300 group-hover:translate-y-[-2px] group-hover:shadow-lg h-full">
        <div className="mb-4 text-primary bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function Features() {
  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Client Management",
      description: "Manage all your clients in one place. Add notes, track progress, and keep everyone organized."
    },
    {
      icon: <Dumbbell className="h-6 w-6" />,
      title: "Custom Workout Plans",
      description: "Create detailed plans with exercises, sets, reps, and rest periods tailored to each client."
    },
    {
      icon: <VideoIcon className="h-6 w-6" />,
      title: "Video Demonstrations",
      description: "Upload exercise videos to demonstrate proper form and technique for your clients."
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Subscription Management",
      description: "Offer free and premium content with seamless payment processing and subscription handling."
    },
    {
      icon: <BarChart className="h-6 w-6" />,
      title: "Progress Tracking",
      description: "Help clients visualize their fitness journey with intuitive progress charts and metrics."
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Client Communication",
      description: "Stay connected with your clients through integrated messaging and notifications."
    }
  ];

  return (
    <section id="features" className="py-20">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-xl text-muted-foreground">
            Powerful tools designed specifically for fitness professionals to deliver exceptional experiences.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
