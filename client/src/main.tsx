import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { OfflineModeProvider } from "./lib/offline-mode";

// Configure the query client for offline support
const defaultQueryFn = queryClient.defaultQueryOptions({}).queryFn;
queryClient.setDefaultOptions({
  queries: {
    queryFn: async ({ queryKey }) => {
      // If offline, handle gracefully by returning empty data
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        console.log(`Offline mode: skipping network request for ${queryKey}`);
        return [];
      }
      return defaultQueryFn ? defaultQueryFn({ queryKey }) : [];
    },
    retry: false,
    refetchOnWindowFocus: navigator.onLine,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <OfflineModeProvider>
        <App />
      </OfflineModeProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
