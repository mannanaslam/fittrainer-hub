
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, User } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ScheduleTab() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [addEventOpen, setAddEventOpen] = useState(false);
  
  // Sample events data
  const events = [
    {
      id: 1,
      title: "Client Session - John D.",
      date: new Date(),
      time: "9:00 AM - 10:30 AM",
      type: "session",
      client: "John D."
    },
    {
      id: 2,
      title: "Workout Plan Review - Sarah M.",
      date: new Date(),
      time: "1:00 PM - 2:00 PM",
      type: "review",
      client: "Sarah M."
    },
    {
      id: 3,
      title: "Team Meeting",
      date: new Date(),
      time: "4:00 PM - 5:00 PM",
      type: "meeting",
      client: null
    }
  ];
  
  // Filtered events for the selected date
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return date && 
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear();
  });
  
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 21; hour++) {
      const timeString = hour <= 12 
        ? `${hour}:00 AM` 
        : `${hour - 12}:00 PM`;
        
      slots.push(
        <div key={hour} className="relative">
          <div className="text-xs text-muted-foreground absolute -top-2.5 -left-16 w-14 text-right">
            {timeString}
          </div>
          <div className="w-full h-16 border-t border-border/30"></div>
        </div>
      );
    }
    return slots;
  };
  
  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'session':
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case 'review':
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case 'meeting':
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };
  
  const handleAddEvent = () => {
    setAddEventOpen(false);
    // Would handle adding the event here in a real implementation
  };

  return (
    <Container>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schedule</h1>
        <Dialog open={addEventOpen} onOpenChange={setAddEventOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>
                Create a new event for your schedule
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="event-title">Event Title</Label>
                <Input id="event-title" placeholder="Enter event title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Input type="date" defaultValue={date?.toISOString().split('T')[0]} />
                </div>
                <div className="grid gap-2">
                  <Label>Time</Label>
                  <div className="flex gap-2">
                    <Input type="time" defaultValue="09:00" />
                    <span className="flex items-center">-</span>
                    <Input type="time" defaultValue="10:00" />
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Client</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John D.</SelectItem>
                    <SelectItem value="sarah">Sarah M.</SelectItem>
                    <SelectItem value="mike">Mike R.</SelectItem>
                    <SelectItem value="none">No Client (Personal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Event Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="session">Client Session</SelectItem>
                    <SelectItem value="review">Plan Review</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddEventOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>
                Add Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <p className="mb-6 text-muted-foreground">
        Manage your appointments, client sessions, and personal schedule
      </p>
      
      <Tabs defaultValue="calendar" className="mb-6">
        <TabsList className="mb-6">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="day">Day View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md"
                />
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {date ? date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'No Date Selected'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredEvents.length > 0 ? (
                  <div className="space-y-4">
                    {filteredEvents.map(event => (
                      <div key={event.id} className="flex p-3 rounded-lg border hover:shadow-md transition-shadow duration-200">
                        <div className="mr-4 flex flex-col items-center justify-center">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Clock className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{event.title}</h3>
                              <p className="text-sm text-muted-foreground">{event.time}</p>
                            </div>
                            <Badge className={getEventBadgeColor(event.type)} variant="outline">
                              {event.type === 'session' ? 'Client Session' : 
                                event.type === 'review' ? 'Plan Review' : 'Meeting'}
                            </Badge>
                          </div>
                          {event.client && (
                            <div className="mt-2 flex items-center">
                              <User className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{event.client}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No events scheduled for this day</p>
                    <Button className="mt-4" variant="outline" size="sm" onClick={() => setAddEventOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="day">
          <Card>
            <CardHeader>
              <CardTitle>Day View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-20 pr-4 pb-8">
                {getTimeSlots()}
                
                <div className="absolute top-5 left-24 w-2/3 h-16 bg-green-100 rounded-lg p-2 border border-green-200">
                  <h4 className="text-sm font-medium">Client Session - John D.</h4>
                  <p className="text-xs text-muted-foreground">9:00 AM - 10:30 AM</p>
                </div>
                
                <div className="absolute top-[180px] left-24 w-2/3 h-12 bg-blue-100 rounded-lg p-2 border border-blue-200">
                  <h4 className="text-sm font-medium">Workout Plan Review</h4>
                  <p className="text-xs text-muted-foreground">1:00 PM - 2:00 PM</p>
                </div>
                
                <div className="absolute top-[340px] left-24 w-1/2 h-12 bg-purple-100 rounded-lg p-2 border border-purple-200">
                  <h4 className="text-sm font-medium">Team Meeting</h4>
                  <p className="text-xs text-muted-foreground">4:00 PM - 5:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event, index) => (
                  <div key={index} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                    <div className="mr-4 p-3 bg-primary/10 rounded-lg">
                      <div className="text-center">
                        <div className="text-xl font-bold">
                          {event.date.getDate()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {event.date.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge className={getEventBadgeColor(event.type)} variant="outline">
                          {event.type === 'session' ? 'Client Session' : 
                            event.type === 'review' ? 'Plan Review' : 'Meeting'}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{event.time}</span>
                      </div>
                      {event.client && (
                        <div className="flex items-center mt-1">
                          <User className="h-3 w-3 mr-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{event.client}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
