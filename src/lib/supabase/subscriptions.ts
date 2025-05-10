import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/supabase';

export type Subscription = Database['public']['Tables']['subscriptions']['Row'];

// Get all subscriptions with optional filtering by user
export async function getSubscriptions(userId?: string): Promise<Subscription[]> {
  try {
    let query = supabase.from('subscriptions').select('*');
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching subscriptions:', error);
      return [];
    }
    
    return data as Subscription[];
  } catch (error) {
    console.error('Error in getSubscriptions:', error);
    return [];
  }
}

// Create a new subscription
export async function createSubscription(subscription: Omit<Subscription, 'id' | 'created_at'>): Promise<Subscription | null> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscription)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Error creating subscription:', error);
      return null;
    }
    
    return data as Subscription;
  } catch (error) {
    console.error('Error in createSubscription:', error);
    return null;
  }
}

export async function getSubscriptionsWithPlanAndUser() {
  const { data, error } = await supabase
    .from('subscriptions')
    .select(`*, plan:plans(*), user:profiles(*)`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
