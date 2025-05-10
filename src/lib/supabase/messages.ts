
import { supabase } from './client';
import { Message } from '@/types/supabase';

// Get all messages between two users
export async function getMessagesBetweenUsers(
  senderId: string,
  recipientId: string
): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${senderId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${senderId})`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    
    return data as Message[];
  } catch (error) {
    console.error('Error in getMessagesBetweenUsers:', error);
    return [];
  }
}

// Get all recent conversations for a user
export async function getRecentConversations(userId: string): Promise<any[]> {
  try {
    // Since we don't have proper database relations set up yet,
    // we'll implement a simplified version
    const { data: allMessages, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }

    // Process messages into conversations
    const conversationsMap = new Map();
    
    allMessages?.forEach((message: any) => {
      // Determine the other party in the conversation
      const otherPartyId = message.sender_id === userId 
        ? message.recipient_id 
        : message.sender_id;
      
      if (!conversationsMap.has(otherPartyId)) {
        conversationsMap.set(otherPartyId, {
          userId: otherPartyId,
          name: `User ${otherPartyId.substring(0, 4)}`, // Temporary name
          lastMessage: message.content,
          lastMessageTime: message.created_at,
          unread: message.recipient_id === userId && !message.read ? 1 : 0
        });
      } else if (new Date(message.created_at) > new Date(conversationsMap.get(otherPartyId).lastMessageTime)) {
        // Update if this is a more recent message
        const conversation = conversationsMap.get(otherPartyId);
        conversation.lastMessage = message.content;
        conversation.lastMessageTime = message.created_at;
        if (message.recipient_id === userId && !message.read) {
          conversation.unread += 1;
        }
      }
    });
    
    // Convert map to array and sort by most recent message
    return Array.from(conversationsMap.values())
      .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
  } catch (error) {
    console.error('Error in getRecentConversations:', error);
    return [];
  }
}

// Send a new message
export async function sendMessage(
  senderId: string,
  recipientId: string,
  content: string
): Promise<Message | null> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        recipient_id: recipientId,
        content,
        read: false
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error sending message:', error);
      return null;
    }
    
    return data as Message;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return null;
  }
}

// Mark messages as read
export async function markMessagesAsRead(
  recipientId: string,
  senderId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('recipient_id', recipientId)
      .eq('sender_id', senderId)
      .eq('read', false);
    
    if (error) {
      console.error('Error marking messages as read:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in markMessagesAsRead:', error);
    return false;
  }
}
