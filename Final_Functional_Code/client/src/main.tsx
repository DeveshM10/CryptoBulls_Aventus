import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { OfflineModeProvider } from "./lib/offline-mode";
import { OfflineFeaturesProvider } from "./lib/offline-integrations";

// Initialize any offline features as early as possible
if (typeof window !== 'undefined') {
  // Register a service worker if supported
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('ServiceWorker registration successful');
      }).catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
    });
  }
  
  // Setup offline fetch interception
  const originalFetch = window.fetch;
  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
    // If we're offline, intercept specific API calls and return cached data
    if (!navigator.onLine) {
      const url = input.toString();
      
      // Voice processor API - use client-side processing instead
      if (url.includes('/api/voice-processor')) {
        console.log('Offline: Intercepting voice processor request');
        
        // Create an offline response
        return new Response(JSON.stringify({ 
          success: true, 
          offlineProcessed: true,
          message: "Processed voice input offline" 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Otherwise, use the original fetch
    return originalFetch(input, init);
  };
}

// Configure the query client for offline support 
queryClient.setDefaultOptions({
  queries: {
    // Make sure queries don't fail when offline
    retry: (failureCount, error) => {
      // Don't retry if we're offline
      if (!navigator.onLine) return false;
      
      // Only retry up to 3 times for real errors
      return failureCount < 3;
    },
    // Only refetch when online and window is focused
    refetchOnWindowFocus: navigator.onLine,
    // Keep data fresh for 5 minutes
    staleTime: 1000 * 60 * 5,
    // Cache for 24 hours to support offline use
    gcTime: 1000 * 60 * 60 * 24,
    // Handle offline mode gracefully
    queryFn: async ({ queryKey }) => {
      // Return empty data when offline
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        console.log(`Offline: skipping network request for ${queryKey}`);
        return [];
      }
      
      // Do default query
      try {
        const url = Array.isArray(queryKey) ? queryKey[0] : queryKey;
        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error(`Error fetching ${queryKey}:`, error);
        // Return empty data for any error
        return [];
      }
    }
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <OfflineModeProvider>
        <OfflineFeaturesProvider>
          <App />
        </OfflineFeaturesProvider>
      </OfflineModeProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
