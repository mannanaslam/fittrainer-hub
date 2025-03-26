
import { createClient } from '@supabase/supabase-js';

// Create a custom Supabase client with better error handling
const supabaseUrl = 'https://njvryfjggmrpiwyhdkmh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qdnJ5ZmpnZ21ycGl3eWhka21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYyNzkzOTksImV4cCI6MjAxMTg1NTM5OX0.IgQ4N4RsWetWyIYE7rDwXbUA8OG_lyYZw2ZV4Iw4QU8';

// Configure with offline support and network resilience
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
    fetch: (url: string, options: RequestInit = {}) => {
      // Create properly typed fetch options with CORS configuration
      const fetchOptions: RequestInit = {
        ...options,
        headers: {
          ...options.headers,
          'Access-Control-Allow-Origin': '*',
        },
        mode: 'cors',
        // Add cache settings to prevent caching issues
        cache: 'no-cache',
        // Add credentials mode for improved auth handling
        credentials: 'same-origin'
      };

      // Add logging for debug purposes
      console.log('Supabase fetch request:', {
        url,
        method: fetchOptions.method || 'GET',
        headers: fetchOptions.headers
      });

      // Use a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      fetchOptions.signal = controller.signal;

      return fetch(url, fetchOptions)
        .then(response => {
          clearTimeout(timeoutId);
          
          // Log response status
          console.log('Supabase fetch response:', {
            status: response.status,
            statusText: response.statusText,
            url: response.url
          });
          
          return response;
        })
        .catch(error => {
          clearTimeout(timeoutId);
          
          // Log detailed error information
          console.error('Supabase fetch error:', {
            message: error.message,
            name: error.name,
            url,
            options: {
              method: fetchOptions.method,
              headers: fetchOptions.headers,
              mode: fetchOptions.mode
            }
          });
          
          throw error;
        });
    }
  }
});
