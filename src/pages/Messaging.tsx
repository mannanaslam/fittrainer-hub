import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Send, User } from "lucide-react";
import { getMessagesBetweenUsers, sendMessage, markMessagesAsRead, getRecentConversations } from "@/lib/supabase";
import { getUserProfileById } from "@/lib/supabase/profiles";
import { Profile, Message } from "@/types/supabase";
import { supabase } from "@/integrations/supabase/client"; // Add this import

const Messaging = () => {
  const { contactId } = useParams<{ contactId?: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [contactProfile, setContactProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations (recent message exchanges)
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.id) return;
      
      try {
        const conversationData = await getRecentConversations(user.id);
        setConversations(conversationData);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast({
          title: "Error",
          description: "Unable to load your conversations",
          variant: "destructive"
        });
      }
    };
    
    fetchConversations();
    
    // Set up real-time subscription for new messages
    if (user?.id) {
      const subscription = supabase
        .channel('messages-channel')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        }, (payload) => {
          // Refresh conversations if a new message arrives
          fetchConversations();
          
          // Update current messages if in the active conversation
          if (contactId && payload.new && 
              (payload.new.sender_id === contactId || 
               payload.new.recipient_id === contactId)) {
            fetchMessages(contactId);
          }
        })
        .subscribe();
        
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user?.id]);

  // Fetch messages for selected contact
  useEffect(() => {
    if (!contactId || !user?.id) return;
    
    const fetchContactProfile = async () => {
      if (!contactId) return;
      
      try {
        const profile = await getUserProfileById(contactId);
        setContactProfile(profile);
      } catch (error) {
        console.error("Error fetching contact profile:", error);
      }
    };
    
    fetchContactProfile();
    fetchMessages(contactId);
    
    // Mark messages as read when conversation is opened
    markMessagesAsRead(user.id, contactId);
  }, [contactId, user?.id]);

  const fetchMessages = async (contactId: string) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const messagesData = await getMessagesBetweenUsers(user.id, contactId);
      setMessages(messagesData.reverse()); // Oldest first
      
      // Mark messages as read
      markMessagesAsRead(user.id, contactId);
      
      // Refresh conversations list to update unread count
      const conversationsData = await getRecentConversations(user.id);
      setConversations(conversationsData);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Unable to load messages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id || !contactId || !newMessage.trim()) return;
    
    try {
      await sendMessage(user.id, contactId, newMessage.trim());
      setNewMessage("");
      
      // Refetch messages to include the new one
      fetchMessages(contactId);
      
      // Also update conversations
      const conversationsData = await getRecentConversations(user.id);
      setConversations(conversationsData);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // If no active conversation is selected, show only the conversations list on mobile
  const showConversationsOnly = !contactId;

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
          
          <h1 className="text-2xl font-bold mb-6">Messages</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List - Always visible on desktop, conditionally on mobile */}
            <div className={`${!showConversationsOnly && 'hidden'} lg:block lg:col-span-1`}>
              <Card>
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold mb-4">Conversations</h2>
                  <div className="space-y-1">
                    {conversations.length > 0 ? (
                      conversations.map((conversation) => (
                        <div key={conversation.userId}>
                          <button
                            className={`w-full text-left p-3 rounded-md hover:bg-muted flex items-center ${
                              contactId === conversation.userId ? 'bg-muted' : ''
                            }`}
                            onClick={() => navigate(`/messaging/${conversation.userId}`)}
                          >
                            <div className="flex items-center flex-1">
                              <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src="" />
                                <AvatarFallback>
                                  <User className="h-5 w-5" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center">
                                  <span className="font-medium">{conversation.name}</span>
                                  {conversation.unread > 0 && (
                                    <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                                      {conversation.unread}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">{conversation.role}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">{conversation.lastMessage}</p>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(conversation.lastMessageTime).toLocaleDateString()}
                            </div>
                          </button>
                          <Separator />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No conversations yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Messages Panel - Visible when a conversation is selected */}
            {contactId && (
              <div className="col-span-1 lg:col-span-2">
                <Card className="flex flex-col h-full">
                  <CardContent className="p-4 flex flex-col h-[70vh]">
                    {/* Contact Header */}
                    <div className="flex items-center pb-3 border-b">
                      <button 
                        onClick={() => navigate('/messaging')}
                        className="mr-2 p-1 rounded-full hover:bg-muted lg:hidden"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src="" />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{contactProfile?.name || 'Loading...'}</h3>
                        <p className="text-xs text-muted-foreground">{contactProfile?.role || ''}</p>
                      </div>
                    </div>
                    
                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        </div>
                      ) : messages.length > 0 ? (
                        messages.map((message) => (
                          <div 
                            key={message.id}
                            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[75%] rounded-lg p-3 ${
                                message.sender_id === user?.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className={`text-xs ${
                                message.sender_id === user?.id
                                  ? 'text-primary-foreground/70'
                                  : 'text-muted-foreground'
                              } mt-1`}>
                                {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    
                    {/* Message Input */}
                    <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                      />
                      <Button type="submit" disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default Messaging;
