
import { supabase } from './client';
import { MealPlan } from '@/types/supabase';

// Get all meal plans with optional filtering by trainer or client
export async function getMealPlans(options?: { trainerId?: string; clientId?: string }): Promise<MealPlan[]> {
  try {
    let query = supabase.from('meal_plans').select('*');
    
    if (options?.trainerId) {
      query = query.eq('trainer_id', options.trainerId);
    }
    
    if (options?.clientId) {
      query = query.eq('client_id', options.clientId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching meal plans:', error);
      return [];
    }
    
    return data as MealPlan[];
  } catch (error) {
    console.error('Error in getMealPlans:', error);
    return [];
  }
}

// Get a specific meal plan by ID
export async function getMealPlanById(mealPlanId: string): Promise<MealPlan | null> {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('id', mealPlanId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching meal plan by ID:', error);
      return null;
    }
    
    return data as MealPlan;
  } catch (error) {
    console.error('Error in getMealPlanById:', error);
    return null;
  }
}

// Create a new meal plan
export async function createMealPlan(mealPlan: Omit<MealPlan, 'id' | 'created_at'>): Promise<MealPlan | null> {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .insert(mealPlan)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Error creating meal plan:', error);
      return null;
    }
    
    return data as MealPlan;
  } catch (error) {
    console.error('Error in createMealPlan:', error);
    return null;
  }
}

// Update an existing meal plan
export async function updateMealPlan(
  mealPlanId: string, 
  updates: Partial<Omit<MealPlan, 'id' | 'created_at'>>
): Promise<MealPlan | null> {
  try {
    const { data, error } = await supabase
      .from('meal_plans')
      .update(updates)
      .eq('id', mealPlanId)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Error updating meal plan:', error);
      return null;
    }
    
    return data as MealPlan;
  } catch (error) {
    console.error('Error in updateMealPlan:', error);
    return null;
  }
}

// Delete a meal plan
export async function deleteMealPlan(mealPlanId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('meal_plans')
      .delete()
      .eq('id', mealPlanId);
    
    if (error) {
      console.error('Error deleting meal plan:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteMealPlan:', error);
    return false;
  }
}
