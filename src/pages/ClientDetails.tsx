import { Link } from "react-router-dom";
import { ArrowLeft, BarChart3, Dumbbell, Calendar, MessageCircle, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientProfile } from "@/components/dashboard/ClientProfile";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Sample client data
const client = {
  id: "1",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  joinDate: "June 15, 2023",
  status: "active" as const,
  goals: ["Weight Loss", "Strength", "Endurance"],
  progress: 68,
  nextSession: "Wednesday, 2pm",
  plan: "Premium",
  measurements: {
    weight: "175 lbs",
    height: "5'10\"",
    bodyFat: "18%"
  },
  recentWorkouts: [
    {
      name: "Full Body Strength",
      date: "Yesterday",
      completed: true
    },
    {
      name: "HIIT Cardio",
      date: "3 days ago",
      completed: true
    },
    {
      name: "Upper Body Focus",
      date: "1 week ago",
      completed: false
    }
  ]
};

// Sample workout plans
const workoutPlans = [
  {
    id: 1,
    name: "Full Body Strength",
    type: "Strength",
    frequency: "3x per week",
    duration: "45 min",
    progress: 70
  },
  {
    id: 2,
    name: "HIIT Cardio",
    type: "Cardio",
    frequency: "2x per week",
    duration: "30 min",
    progress: 50
  },
  {
    id: 3,
    name: "Recovery & Mobility",
    type: "Recovery",
    frequency: "2x per week",
    duration: "20 min",
    progress: 25
  }
];

// Sample appointments
const appointments = [
  {
    id: 1,
    date: "Oct 24, 2023",
    time: "2:00 PM",
    type: "1-on-1 Training",
    status: "Upcoming"
  },
  {
    id: 2,
    date: "Oct 31, 2023",
    time: "2:00 PM",
    type: "1-on-1 Training",
    status: "Upcoming"
  },
  {
    id: 3,
    date: "Oct 17, 2023",
    time: "2:00 PM",
    type: "1-on-1 Training",
    status: "Completed"
  }
];

// Sample progress data
const progressData = [
  {
    metric: "Weight",
    current: "175 lbs",
    initial: "190 lbs",
    goal: "165 lbs",
    progress: 60
  },
  {
    metric: "Body Fat",
    current: "18%",
    initial: "22%",
    goal: "15%",
    progress: 57
  },
  {
    metric: "Bench Press",
    current: "185 lbs",
    initial: "155 lbs",
    goal: "225 lbs",
    progress: 43
  },
  {
    metric: "5K Time",
    current: "26 min",
    initial: "30 min",
    goal: "24 min",
    progress: 67
  }
];

const ClientDetails = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <Container>
          <div className="mb-6">
            <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          
          <ClientProfile client={client} />
          
          <div className="mt-8">
            <Tabs defaultValue="workouts">
              <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
                <TabsTrigger value="workouts" className="flex gap-2 items-center">
                  <Dumbbell className="h-4 w-4" />
                  <span className="hidden sm:inline">Workouts</span>
                </TabsTrigger>
                <TabsTrigger value="progress" className="flex gap-2 items-center">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Progress</span>
                </TabsTrigger>
                <TabsTrigger value="schedule" className="flex gap-2 items-center">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Schedule</span>
                </TabsTrigger>
                <TabsTrigger value="messages" className="flex gap-2 items-center">
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Messages</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="workouts" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workoutPlans.map((plan) => (
                    <div key={plan.id} className="border rounded-lg p-4 hover:border-primary hover:bg-primary/5 cursor-pointer">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground">{plan.type}</p>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {plan.progress}%
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{plan.frequency}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{plan.duration}</span>
                        </div>
                      </div>
                      <Progress value={plan.progress} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="progress" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {progressData.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">{item.metric}</h3>
                      <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                        <div>
                          <p className="text-muted-foreground mb-1">Starting</p>
                          <p className="font-medium">{item.initial}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Current</p>
                          <p className="font-medium text-primary">{item.current}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Goal</p>
                          <p className="font-medium">{item.goal}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Progress toward goal</span>
                          <span className="text-sm font-medium">{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-6">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-4">
                    <h3 className="font-medium">Upcoming Sessions</h3>
                  </div>
                  <div className="divide-y">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{appointment.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.date} at {appointment.time}
                          </p>
                        </div>
                        <div>
                          <Badge 
                            variant={appointment.status === "Upcoming" ? "default" : "secondary"}
                            className={appointment.status === "Upcoming" ? "bg-blue-500" : ""}
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="messages" className="space-y-6">
                <div className="border rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center max-w-md space-y-3">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                    <h3 className="text-lg font-medium">Your messages with Alex will appear here</h3>
                    <p className="text-muted-foreground">
                      Send workout updates, nutrition advice, or answer any questions they might have.
                    </p>
                    <Button>Start Conversation</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default ClientDetails;
