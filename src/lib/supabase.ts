
import { createClient } from '@supabase/supabase-js';

// Create a custom Supabase client with better error handling
const supabaseUrl = 'https://njvryfjggmrpiwyhdkmh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qdnJ5ZmpnZ21ycGl3eWhka21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYyNzkzOTksImV4cCI6MjAxMTg1NTM5OX0.IgQ4N4RsWetWyIYE7rDwXbUA8OG_lyYZw2ZV4Iw4QU8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Custom-Header': 'custom-value',
    },
    fetch: (url, options = {}) => {
      // Add CORS headers
      const fetchOptions = {
        ...options,
        headers: {
          ...options.headers,
          'Access-Control-Allow-Origin': '*',
        },
        mode: 'cors' as RequestMode,
      };

      // Add logging for debug purposes
      console.log('Supabase fetch request:', {
        url,
        method: fetchOptions.method || 'GET',
        headers: fetchOptions.headers
      });

      return fetch(url, fetchOptions).then(response => {
        // Log response status
        console.log('Supabase fetch response:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });
        return response;
      }).catch(error => {
        // Log detailed error information
        console.error('Supabase fetch error:', {
          message: error.message,
          name: error.name,
          url,
          options: fetchOptions
        });
        throw error;
      });
    }
  }
});

