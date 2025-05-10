
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Search, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { getRecentConversations } from "@/lib/supabase";
import { getAllClients } from "@/lib/supabase/profiles";
import { Profile } from "@/types/supabase";

export function MessagesTab() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [allContacts, setAllContacts] = useState<Profile[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // Get recent conversations
        const conversationsData = await getRecentConversations(user.id);
        setConversations(conversationsData);
        
        // Get all potential contacts based on user role
        if (profile?.role === 'trainer') {
          // Trainers can message their clients
          const clients = await getAllClients();
          setAllContacts(clients);
        } else {
          // TODO: Clients would need to see their trainers
          // For now, this is a placeholder
          setAllContacts([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user?.id, profile?.role]);
  
  // Filter contacts based on search term
  const filteredContacts = allContacts.filter(contact => 
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conversation => 
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Count total unread messages
  const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unread || 0), 0);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Messages</h2>
          <p className="text-muted-foreground">
            Communicate with your {profile?.role === 'trainer' ? 'clients' : 'trainers'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="pl-10 w-full sm:w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button onClick={() => navigate('/messaging')}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
            {totalUnread > 0 && (
              <span className="ml-2 bg-background text-xs rounded-full px-2 py-0.5">
                {totalUnread}
              </span>
            )}
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Conversations */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Conversations</h3>
              
              {filteredConversations.length > 0 ? (
                <div className="space-y-4">
                  {filteredConversations.slice(0, 5).map((conversation) => (
                    <div key={conversation.userId} className="group">
                      <button
                        className="w-full text-left hover:bg-muted p-3 rounded-md flex items-center"
                        onClick={() => navigate(`/messaging/${conversation.userId}`)}
                      >
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="font-medium">{conversation.name}</span>
                              {conversation.unread > 0 && (
                                <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                                  {conversation.unread}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(conversation.lastMessageTime).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </button>
                      <Separator className="mt-2" />
                    </div>
                  ))}
                  
                  {filteredConversations.length > 5 && (
                    <Button 
                      variant="link" 
                      className="w-full" 
                      onClick={() => navigate('/messaging')}
                    >
                      See All Messages
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mx-auto opacity-30 mb-2" />
                  <p>No conversations found</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Contacts - For trainers to start new conversations */}
          {profile?.role === 'trainer' && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Your Clients</h3>
                
                {filteredContacts.length > 0 ? (
                  <div className="space-y-4">
                    {filteredContacts.slice(0, 5).map((contact) => (
                      <div key={contact.id} className="group">
                        <button
                          className="w-full text-left hover:bg-muted p-3 rounded-md flex items-center"
                          onClick={() => navigate(`/messaging/${contact.id}`)}
                        >
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src="" />
                            <AvatarFallback>
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <span className="font-medium">{contact.name || 'Unnamed Client'}</span>
                            <p className="text-sm text-muted-foreground">
                              {contact.email}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </button>
                        <Separator className="mt-2" />
                      </div>
                    ))}
                    
                    {filteredContacts.length > 5 && (
                      <Button 
                        variant="link" 
                        className="w-full" 
                        onClick={() => navigate('/clients')}
                      >
                        View All Clients
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <User className="h-10 w-10 mx-auto opacity-30 mb-2" />
                    <p>No clients found</p>
                    <Button 
                      variant="link" 
                      className="mt-2" 
                      onClick={() => navigate('/clients')}
                    >
                      Add New Clients
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
