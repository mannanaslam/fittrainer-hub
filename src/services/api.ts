import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiService {
  private static instance: ApiService;
  private client = supabase;

  private constructor() {}

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async get<T = any>(table: string, query?: any) {
    try {
      const { data, error } = await this.client
        .from(table)
        .select(query || '*');

      if (error) throw new ApiError(error.message, error.code);
      return data as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch data');
    }
  }

  async post<T = any>(table: string, body: any) {
    try {
      const { data, error } = await this.client
        .from(table)
        .insert(body)
        .select()
        .single();

      if (error) throw new ApiError(error.message, error.code);
      return data as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create data');
    }
  }

  async update<T = any>(table: string, id: string, body: any) {
    try {
      const { data, error } = await this.client
        .from(table)
        .update(body)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new ApiError(error.message, error.code);
      return data as T;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update data');
    }
  }

  async delete(table: string, id: string) {
    try {
      const { error } = await this.client
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw new ApiError(error.message, error.code);
      return true;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to delete data');
    }
  }
}

export const api = ApiService.getInstance(); 