
import { 
  User, 
  Mail, 
  Phone, 
  CalendarClock, 
  TrendingUp, 
  Target, 
  MessageCircle,
  Activity,
  Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface ClientProfileProps {
  client: {
    id: string | number;
    name: string;
    email: string;
    phone?: string;
    joinDate: string;
    status: "active" | "inactive";
    goals: string[];
    progress: number;
    nextSession?: string;
    avatar?: string;
    plan: string;
    measurements?: {
      weight: string;
      height: string;
      bodyFat?: string;
    };
    recentWorkouts?: {
      name: string;
      date: string;
      completed: boolean;
    }[];
  };
}

export function ClientProfile({ client }: ClientProfileProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={client.avatar} alt={client.name} />
            <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold">{client.name}</h2>
              <Badge 
                variant={client.status === "active" ? "default" : "secondary"}
                className={client.status === "active" ? "bg-green-500" : ""}
              >
                {client.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-muted-foreground">{client.plan} Plan</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground text-sm mb-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </div>
                  <p>{client.email}</p>
                </div>
                
                {client.phone && (
                  <div className="space-y-1">
                    <div className="flex items-center text-muted-foreground text-sm mb-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Phone
                    </div>
                    <p>{client.phone}</p>
                  </div>
                )}
                
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground text-sm mb-1">
                    <CalendarClock className="h-4 w-4 mr-2" />
                    Member Since
                  </div>
                  <p>{client.joinDate}</p>
                </div>
                
                {client.nextSession && (
                  <div className="space-y-1">
                    <div className="flex items-center text-muted-foreground text-sm mb-1">
                      <CalendarClock className="h-4 w-4 mr-2" />
                      Next Session
                    </div>
                    <p>{client.nextSession}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {client.measurements && (
                  <div className="space-y-1">
                    <div className="flex items-center text-muted-foreground text-sm mb-1">
                      <User className="h-4 w-4 mr-2" />
                      Measurements
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Height:</span> {client.measurements.height}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Weight:</span> {client.measurements.weight}
                      </div>
                      {client.measurements.bodyFat && (
                        <div>
                          <span className="text-muted-foreground">Body Fat:</span> {client.measurements.bodyFat}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground text-sm mb-1">
                    <Target className="h-4 w-4 mr-2" />
                    Goals
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {client.goals.map((goal, index) => (
                      <Badge key={index} variant="secondary">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-medium">Overall Progress</h3>
                </div>
                <span>{client.progress}%</span>
              </div>
              <Progress value={client.progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {client.recentWorkouts && client.recentWorkouts.length > 0 ? (
              <div className="space-y-4">
                {client.recentWorkouts.map((workout, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center ${
                      workout.completed ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      <Activity className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="font-medium">{workout.name}</p>
                      <p className="text-sm text-muted-foreground">{workout.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
