
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
    // Get messages where the user is either sender or recipient
    const { data: sentMessages, error: sentError } = await supabase
      .from('messages')
      .select('*, profiles!messages_recipient_id_fkey(*)')
      .eq('sender_id', userId)
      .order('created_at', { ascending: false });
    
    const { data: receivedMessages, error: receivedError } = await supabase
      .from('messages')
      .select('*, profiles!messages_sender_id_fkey(*)')
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false });
    
    if (sentError || receivedError) {
      console.error('Error fetching conversations:', sentError || receivedError);
      return [];
    }

    // Combine and organize by conversation
    const conversationsMap = new Map();
    
    // Process sent messages
    sentMessages?.forEach((message) => {
      const recipientId = message.recipient_id;
      const recipientProfile = message.profiles;
      
      if (!conversationsMap.has(recipientId)) {
        conversationsMap.set(recipientId, {
          userId: recipientId,
          name: recipientProfile?.name || 'Unknown User',
          role: recipientProfile?.role || 'unknown',
          lastMessage: message.content,
          lastMessageTime: message.created_at,
          unread: 0
        });
      }
    });
    
    // Process received messages
    receivedMessages?.forEach((message) => {
      const senderId = message.sender_id;
      const senderProfile = message.profiles;
      const isUnread = !message.read;
      
      if (!conversationsMap.has(senderId)) {
        conversationsMap.set(senderId, {
          userId: senderId,
          name: senderProfile?.name || 'Unknown User',
          role: senderProfile?.role || 'unknown',
          lastMessage: message.content,
          lastMessageTime: message.created_at,
          unread: isUnread ? 1 : 0
        });
      } else if (
        new Date(message.created_at) > 
        new Date(conversationsMap.get(senderId).lastMessageTime)
      ) {
        // Update if this is a more recent message
        const conversation = conversationsMap.get(senderId);
        conversation.lastMessage = message.content;
        conversation.lastMessageTime = message.created_at;
        if (isUnread) conversation.unread += 1;
      }
    });
    
    // Convert map to array and sort by most recent message
    return Array.from(conversationsMap.values())
      .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
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
      .maybeSingle();
    
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
