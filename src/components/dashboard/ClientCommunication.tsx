
import { useState } from "react";
import { 
  Search, 
  MoreVertical, 
  Send, 
  Paperclip, 
  ChevronRight,
  Plus,
  SmilePlus, 
  Image as ImageIcon,
  Calendar,
  User,
  Check,
  FilePlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Sample messages data
const messages = [
  {
    id: 1,
    sender: "client",
    name: "John Doe",
    avatar: "",
    content: "Hi coach, how's it going? Just wanted to check in about my workout for today.",
    timestamp: "Today, 10:32 AM",
    read: true
  },
  {
    id: 2,
    sender: "trainer",
    name: "You",
    avatar: "",
    content: "Hey John! Doing great. I've been looking at your latest workout logs and I'm impressed with your progress.",
    timestamp: "Today, 10:45 AM",
    read: true
  },
  {
    id: 3,
    sender: "client",
    name: "John Doe",
    avatar: "",
    content: "Thanks! I've been really pushing myself. By the way, is there anything I should focus on for today's session?",
    timestamp: "Today, 10:52 AM",
    read: true
  },
  {
    id: 4,
    sender: "trainer",
    name: "You",
    avatar: "",
    content: "For today, I'd like you to focus on your form for the squat exercises. Your progress is great, but let's make sure we're maintaining perfect form. Also, try to increase your rest intervals between heavy sets to 90 seconds instead of 60.",
    timestamp: "Today, 11:05 AM",
    read: true
  },
  {
    id: 5,
    sender: "client",
    name: "John Doe",
    avatar: "",
    content: "Got it! I'll focus on form and longer rest intervals. Looking forward to it!",
    timestamp: "Today, 11:10 AM",
    read: true
  }
];

// Sample clients data
const clients = [
  { id: 1, name: "John Doe", lastMessage: "Got it! I'll focus on form and longer...", time: "11:10 AM", unread: 0, online: true },
  { id: 2, name: "Sarah Miller", lastMessage: "When is our next session scheduled?", time: "Yesterday", unread: 2, online: false },
  { id: 3, name: "Mike Johnson", lastMessage: "Thanks for the meal plan!", time: "Monday", unread: 0, online: false },
  { id: 4, name: "Emily Williams", lastMessage: "You: How's the new routine working out?", time: "Oct 5", unread: 0, online: true },
  { id: 5, name: "Robert Chen", lastMessage: "You: Don't forget to submit your food log", time: "Oct 3", unread: 0, online: false }
];

// Sample announcements
const announcements = [
  { 
    id: 1, 
    title: "Holiday Schedule Changes", 
    content: "The gym will be operating on reduced hours during the holiday season. Please check the updated schedule.",
    date: "Oct 15, 2023",
    recipients: 24,
    status: "sent"
  },
  { 
    id: 2, 
    title: "New Equipment Available", 
    content: "We've added new equipment to the weight room. Check out the new squat racks and cable machines!",
    date: "Sep 28, 2023",
    recipients: 24,
    status: "sent"
  },
  { 
    id: 3, 
    title: "October Challenge", 
    content: "Join our October fitness challenge! Complete 20 workouts this month to win a prize.",
    date: "Sep 30, 2023",
    recipients: 24,
    status: "draft"
  }
];

export function ClientCommunication() {
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState("messages");
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const { toast } = useToast();
  
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    // In a real app, we would send the message to the API
    toast({
      title: "Message sent",
      description: `Your message to ${selectedClient.name} has been sent.`
    });
    
    setMessageText("");
  };
  
  const handleSelectClient = (client: typeof clients[0]) => {
    setSelectedClient(client);
  };
  
  const handleCreateAnnouncement = () => {
    toast({
      title: "Announcement created",
      description: "Your announcement has been saved as a draft."
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="messages">Direct Messages</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="templates">Message Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages">
          <Card className="h-[calc(100vh-250px)] max-h-[800px]">
            <div className="grid grid-cols-1 md:grid-cols-3 h-full">
              {/* Clients sidebar */}
              <div className="border-r md:col-span-1 overflow-hidden flex flex-col">
                <div className="p-4 border-b">
                  <Input placeholder="Search clients..." className="mb-2" />
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="cursor-pointer">All</Badge>
                    <Badge variant="outline" className="cursor-pointer">Unread</Badge>
                    <Badge variant="outline" className="cursor-pointer">Recent</Badge>
                  </div>
                </div>
                <div className="overflow-y-auto flex-1">
                  {clients.map((client) => (
                    <div 
                      key={client.id}
                      className={`flex items-start p-4 cursor-pointer hover:bg-muted/50 ${selectedClient.id === client.id ? 'bg-muted' : ''}`}
                      onClick={() => handleSelectClient(client)}
                    >
                      <div className="relative mr-3">
                        <Avatar>
                          <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {client.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h4 className="font-medium truncate">{client.name}</h4>
                          <span className="text-xs text-muted-foreground">{client.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{client.lastMessage}</p>
                      </div>
                      {client.unread > 0 && (
                        <div className="ml-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {client.unread}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Message area */}
              <div className="md:col-span-2 flex flex-col h-full">
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center">
                    <Avatar className="mr-2">
                      <AvatarFallback>{selectedClient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedClient.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedClient.online ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                    <Button size="sm" variant="outline">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex ${message.sender === 'trainer' ? 'justify-end' : ''}`}
                    >
                      {message.sender === 'client' && (
                        <Avatar className="mr-2 mt-1">
                          <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div 
                        className={`max-w-[75%] px-4 py-2 rounded-lg ${
                          message.sender === 'trainer' 
                            ? 'bg-primary text-primary-foreground rounded-tr-none' 
                            : 'bg-muted rounded-tl-none'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center mt-1 text-xs ${
                          message.sender === 'trainer' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          <span>{message.timestamp}</span>
                          {message.sender === 'trainer' && message.read && (
                            <Check className="h-3 w-3 ml-1" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t">
                  <div className="flex">
                    <div className="flex-1">
                      <Textarea 
                        placeholder="Type your message..."
                        className="min-h-[80px] resize-none"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                      />
                      <div className="flex mt-2 space-x-2">
                        <Button size="sm" variant="outline">
                          <ImageIcon className="h-4 w-4 mr-1" />
                          Image
                        </Button>
                        <Button size="sm" variant="outline">
                          <FilePlus className="h-4 w-4 mr-1" />
                          File
                        </Button>
                        <Button size="sm" variant="outline">
                          <SmilePlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button 
                      className="self-end ml-4 h-10 w-10 rounded-full p-0" 
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="announcements">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Announcements</CardTitle>
                  <CardDescription>
                    Send updates to all your clients
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Announcement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{announcement.title}</h3>
                        <p className="text-sm text-muted-foreground">{announcement.date}</p>
                      </div>
                      <Badge variant={announcement.status === 'sent' ? 'outline' : 'secondary'}>
                        {announcement.status === 'sent' ? 'Sent' : 'Draft'}
                      </Badge>
                    </div>
                    <p className="text-sm mb-3">{announcement.content}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Sent to {announcement.recipients} clients</span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" className="h-8">View Details</Button>
                        <Button size="sm" variant="outline" className="h-8">
                          {announcement.status === 'sent' ? 'Resend' : 'Send Now'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Create New Announcement</CardTitle>
                  <CardDescription>
                    Create an announcement to send to your clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                      <Input id="title" placeholder="Announcement title" />
                    </div>
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium mb-1">Message</label>
                      <Textarea id="content" placeholder="Type your announcement here..." className="min-h-[120px]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Recipients</label>
                      <div className="flex space-x-2 mb-2">
                        <Badge variant="outline" className="cursor-pointer">All Clients</Badge>
                        <Badge variant="outline" className="cursor-pointer">Active Only</Badge>
                        <Badge variant="outline" className="cursor-pointer">Custom Group</Badge>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Save as Draft</Button>
                      <Button onClick={handleCreateAnnouncement}>Send Announcement</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Message Templates</CardTitle>
                  <CardDescription>
                    Save time with reusable message templates
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-1">Welcome Message</h3>
                  <p className="text-sm mb-3">Welcome to [Gym Name]! I'm excited to be your personal trainer. Feel free to message me with any questions about your fitness journey.</p>
                  <div className="flex justify-end">
                    <Button size="sm" variant="outline">Use Template</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-1">Weekly Check-in</h3>
                  <p className="text-sm mb-3">Hi [Client Name], just checking in on your progress this week. How are you feeling about the workout plan? Are there any exercises you're finding particularly challenging?</p>
                  <div className="flex justify-end">
                    <Button size="sm" variant="outline">Use Template</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-1">Nutrition Reminder</h3>
                  <p className="text-sm mb-3">Hi [Client Name], just a reminder to log your meals for the week. Consistent tracking helps us make better adjustments to your nutrition plan.</p>
                  <div className="flex justify-end">
                    <Button size="sm" variant="outline">Use Template</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-1">Missed Session</h3>
                  <p className="text-sm mb-3">Hi [Client Name], I noticed you missed our scheduled session today. Everything ok? Let's reschedule at your convenience.</p>
                  <div className="flex justify-end">
                    <Button size="sm" variant="outline">Use Template</Button>
                  </div>
                </div>
              </div>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Create New Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="template-name" className="block text-sm font-medium mb-1">Template Name</label>
                      <Input id="template-name" placeholder="E.g., Progress Update" />
                    </div>
                    <div>
                      <label htmlFor="template-content" className="block text-sm font-medium mb-1">Template Content</label>
                      <Textarea 
                        id="template-content" 
                        placeholder="Type your template message here. Use [Client Name] for personalization." 
                        className="min-h-[120px]"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Use placeholders like [Client Name], [Gym Name], etc. for personalization
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <Button>Save Template</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
