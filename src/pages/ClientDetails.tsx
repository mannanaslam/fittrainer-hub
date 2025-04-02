
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Container } from "@/components/ui/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientProgress } from "@/components/dashboard/ClientProgress";
import { ClientCommunication } from "@/components/dashboard/ClientCommunication";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CalendarDays, FileText, MessageSquare, Star, UserRound } from "lucide-react";

const ClientDetails = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock client data
  const client = {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    joinDate: "October 5, 2023",
    subscription: "Premium",
    goals: ["Weight Loss", "Muscle Tone", "Improved Mobility"],
    nextSession: "October 18, 2023 at 10:00 AM"
  };
  
  return (
    <DashboardLayout>
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">{client.name}</h1>
            <p className="text-muted-foreground">{client.email} • Joined {client.joinDate}</p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline">
              <CalendarDays className="h-4 w-4 mr-2" />
              Schedule Session
            </Button>
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserRound className="h-5 w-5 mr-2" />
                    Client Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Subscription</h3>
                        <p>{client.subscription}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Next Session</h3>
                        <p>{client.nextSession}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Goals</h3>
                      <div className="flex flex-wrap gap-2">
                        {client.goals.map((goal, index) => (
                          <div key={index} className="bg-muted px-3 py-1 rounded-full text-sm">
                            {goal}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Personal Notes</h3>
                      <p className="text-sm">
                        John is highly motivated but needs consistent guidance. He has a previous knee injury so we've modified his leg exercises. He prefers morning workouts and responds well to positive reinforcement.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-2 border-muted pl-4 py-1">
                      <p className="text-sm">Completed workout: Upper Body Strength</p>
                      <p className="text-xs text-muted-foreground">Yesterday at 9:30 AM</p>
                    </div>
                    <div className="border-l-2 border-muted pl-4 py-1">
                      <p className="text-sm">Skipped workout: Cardio Session</p>
                      <p className="text-xs text-muted-foreground">October 10 at 6:00 PM</p>
                    </div>
                    <div className="border-l-2 border-muted pl-4 py-1">
                      <p className="text-sm">Updated weight: 178 lbs (-2 lbs)</p>
                      <p className="text-xs text-muted-foreground">October 8 at 8:15 AM</p>
                    </div>
                    <div className="border-l-2 border-muted pl-4 py-1">
                      <p className="text-sm">Completed workout: Lower Body Focus</p>
                      <p className="text-xs text-muted-foreground">October 7 at 10:00 AM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Active Programs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">12-Week Weight Loss Program</h3>
                          <p className="text-sm text-muted-foreground">Started: Sep 15, 2023</p>
                        </div>
                        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          In Progress
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>Week 4 of 12</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "33%" }}></div>
                          </div>
                        </div>
                        <p className="text-sm">Focus: Progressive strength training with caloric deficit</p>
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm">View Program</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">Nutrition Plan: Balanced Diet</h3>
                          <p className="text-sm text-muted-foreground">Started: Sep 15, 2023</p>
                        </div>
                        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Active
                        </div>
                      </div>
                      <p className="text-sm mb-3">Balanced macronutrient distribution with 1,800 daily calories target</p>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center">
                          <div className="text-sm font-medium">Protein</div>
                          <div className="text-lg">30%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">Carbs</div>
                          <div className="text-lg">45%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">Fats</div>
                          <div className="text-lg">25%</div>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">View Plan</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-800">
                        <Star className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium">5 Workouts Streak</h3>
                        <p className="text-sm text-muted-foreground">Completed 5 consecutive workouts</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800">
                        <Star className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium">Weight Goal</h3>
                        <p className="text-sm text-muted-foreground">Lost first 5 pounds</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-800">
                        <Star className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium">Strength Milestone</h3>
                        <p className="text-sm text-muted-foreground">Increased bench press by 20%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2" />
                    Upcoming Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs font-medium">OCT</span>
                        <span className="text-sm font-bold">18</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Personal Training Session</h3>
                        <p className="text-sm text-muted-foreground">10:00 AM - 11:00 AM</p>
                      </div>
                      <Button variant="outline" size="sm">Reschedule</Button>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs font-medium">OCT</span>
                        <span className="text-sm font-bold">21</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Progress Review</h3>
                        <p className="text-sm text-muted-foreground">2:00 PM - 2:30 PM</p>
                      </div>
                      <Button variant="outline" size="sm">Reschedule</Button>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs font-medium">OCT</span>
                        <span className="text-sm font-bold">25</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Personal Training Session</h3>
                        <p className="text-sm text-muted-foreground">10:00 AM - 11:00 AM</p>
                      </div>
                      <Button variant="outline" size="sm">Reschedule</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="progress">
            <ClientProgress />
          </TabsContent>
          
          <TabsContent value="workouts">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Workout Plans</CardTitle>
                    <CardDescription>Manage client's workout plans</CardDescription>
                  </div>
                  <Button>
                    Create New Plan
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="h-40 bg-muted flex items-center justify-center">
                      <Activity className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-1">Upper Body Strength</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Focus on chest, shoulders, and arms
                      </p>
                      <div className="flex justify-between text-sm mb-4">
                        <span>6 exercises</span>
                        <span>45 min</span>
                      </div>
                      <Button variant="outline" className="w-full">View Plan</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="h-40 bg-muted flex items-center justify-center">
                      <Activity className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-1">Lower Body Focus</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Strengthen legs and improve mobility
                      </p>
                      <div className="flex justify-between text-sm mb-4">
                        <span>5 exercises</span>
                        <span>40 min</span>
                      </div>
                      <Button variant="outline" className="w-full">View Plan</Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="h-40 bg-muted flex items-center justify-center">
                      <Activity className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-1">Cardio & HIIT</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        High intensity intervals for fat burning
                      </p>
                      <div className="flex justify-between text-sm mb-4">
                        <span>8 exercises</span>
                        <span>30 min</span>
                      </div>
                      <Button variant="outline" className="w-full">View Plan</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="nutrition">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Nutrition</CardTitle>
                    <CardDescription>Manage meal plans and nutrition goals</CardDescription>
                  </div>
                  <Button>
                    Create Meal Plan
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8">
                  Nutrition tracking will be enhanced in future updates.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages">
            <ClientCommunication />
          </TabsContent>
          
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Session Notes</CardTitle>
                    <CardDescription>Track client progress and session outcomes</CardDescription>
                  </div>
                  <Button>
                    Add Note
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8">
                  Session notes feature will be enhanced in future updates.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
};

export default ClientDetails;
