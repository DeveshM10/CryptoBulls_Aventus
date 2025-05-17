/**
 * Offline Integrations
 * 
 * This module provides integration hooks and components
 * to make all FinVault features work offline.
 */

import React, { useEffect, useState, createContext, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { saveToLocalStorage, getFromLocalStorage, isOffline } from './offline-helpers';
import { useFinanceStore } from '../components/finance-ai/finance-store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

// Storage keys for keeping ML models and other assets in cache
const OFFLINE_STORAGE_KEYS = {
  VOICE_FEATURES_ENABLED: 'finvault_voice_features_enabled',
  MICROPHONE_ACCESS_GRANTED: 'finvault_microphone_access_granted',
  AI_ASSISTANT_ENABLED: 'finvault_ai_assistant_enabled'
};

// Context for offline features
interface OfflineFeaturesContextType {
  isOffline: boolean;
  voiceFeaturesAvailable: boolean;
  aiAssistantAvailable: boolean;
  microphoneAccessGranted: boolean;
  checkMicrophoneAccess: () => Promise<boolean>;
}

const OfflineFeaturesContext = createContext<OfflineFeaturesContextType>({
  isOffline: false,
  voiceFeaturesAvailable: false,
  aiAssistantAvailable: false,
  microphoneAccessGranted: false,
  checkMicrophoneAccess: async () => false
});

// Provider component for offline features
export function OfflineFeaturesProvider({ children }: { children: React.ReactNode }) {
  const [appIsOffline, setAppIsOffline] = useState(isOffline());
  const [voiceFeaturesAvailable, setVoiceFeaturesAvailable] = useState(
    getFromLocalStorage(OFFLINE_STORAGE_KEYS.VOICE_FEATURES_ENABLED, false)
  );
  const [aiAssistantAvailable, setAiAssistantAvailable] = useState(
    getFromLocalStorage(OFFLINE_STORAGE_KEYS.AI_ASSISTANT_ENABLED, false)
  );
  const [microphoneAccessGranted, setMicrophoneAccessGranted] = useState(
    getFromLocalStorage(OFFLINE_STORAGE_KEYS.MICROPHONE_ACCESS_GRANTED, false)
  );
  
  const { toast } = useToast();
  
  // Update offline status
  useEffect(() => {
    const handleOnline = () => {
      setAppIsOffline(false);
      toast({
        title: "Back Online",
        description: "Your connection has been restored. Changes will be synchronized."
      });
    };
    
    const handleOffline = () => {
      setAppIsOffline(true);
      toast({
        title: "Working Offline",
        description: "You're now working offline. All features will continue to work locally."
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial check
    setAppIsOffline(isOffline());
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);
  
  // Check if microphone is accessible
  const checkMicrophoneAccess = async (): Promise<boolean> => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        title: "Speech Recognition Unavailable",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
      setMicrophoneAccessGranted(false);
      saveToLocalStorage(OFFLINE_STORAGE_KEYS.MICROPHONE_ACCESS_GRANTED, false);
      return false;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately
      stream.getTracks().forEach(track => track.stop());
      
      setMicrophoneAccessGranted(true);
      saveToLocalStorage(OFFLINE_STORAGE_KEYS.MICROPHONE_ACCESS_GRANTED, true);
      
      // Also check for SpeechRecognition
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setVoiceFeaturesAvailable(true);
        saveToLocalStorage(OFFLINE_STORAGE_KEYS.VOICE_FEATURES_ENABLED, true);
      } else {
        toast({
          title: "Speech Recognition Unavailable",
          description: "Your browser doesn't support the required speech recognition features.",
          variant: "destructive"
        });
        setVoiceFeaturesAvailable(false);
        saveToLocalStorage(OFFLINE_STORAGE_KEYS.VOICE_FEATURES_ENABLED, false);
      }
      
      return true;
    } catch (error) {
      console.error("Error accessing microphone:", error);
      
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to use voice features.",
        variant: "destructive"
      });
      
      setMicrophoneAccessGranted(false);
      saveToLocalStorage(OFFLINE_STORAGE_KEYS.MICROPHONE_ACCESS_GRANTED, false);
      
      return false;
    }
  };
  
  // Enable offline AI assistant
  useEffect(() => {
    // This is where we'd load any required ML models for offline use
    // For now, we'll just enable the AI assistant since it uses client-side processing
    setAiAssistantAvailable(true);
    saveToLocalStorage(OFFLINE_STORAGE_KEYS.AI_ASSISTANT_ENABLED, true);
  }, []);
  
  const contextValue = {
    isOffline: appIsOffline,
    voiceFeaturesAvailable,
    aiAssistantAvailable,
    microphoneAccessGranted,
    checkMicrophoneAccess
  };
  
  return (
    <OfflineFeaturesContext.Provider value={contextValue}>
      {children}
      {appIsOffline && <OfflineAlert />}
    </OfflineFeaturesContext.Provider>
  );
}

// Hook for components to access offline features
export function useOfflineFeatures() {
  return useContext(OfflineFeaturesContext);
}

// Alert component to show when offline
function OfflineAlert() {
  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Offline Mode</AlertTitle>
        <AlertDescription className="flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span>Working offline. Changes will be synced when you reconnect.</span>
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Hook to fetch data with offline fallback
export function useFetchWithOfflineFallback<T>(
  url: string, 
  storageKey: string, 
  defaultValue: T
): { data: T; isLoading: boolean; error: Error | null } {
  const [data, setData] = useState<T>(getFromLocalStorage(storageKey, defaultValue));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { isOffline } = useOfflineFeatures();
  
  useEffect(() => {
    // If offline, use cached data
    if (isOffline) {
      return;
    }
    
    // If online, fetch data
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        
        const fetchedData = await response.json();
        setData(fetchedData);
        
        // Cache data for offline use
        saveToLocalStorage(storageKey, fetchedData);
      } catch (err) {
        console.error(`Error fetching ${url}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        
        // Use cached data if available
        const cachedData = getFromLocalStorage<T>(storageKey, defaultValue);
        if (cachedData) {
          setData(cachedData);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [url, storageKey, defaultValue, isOffline]);
  
  return { data, isLoading, error };
}

// Wrapper for async operations that need to work offline
export async function executeWithOfflineFallback<T>(
  onlineOperation: () => Promise<T>,
  offlineOperation: () => T,
  errorHandler?: (error: any) => T
): Promise<T> {
  if (isOffline()) {
    console.log('Executing in offline mode');
    return offlineOperation();
  }
  
  try {
    return await onlineOperation();
  } catch (error) {
    console.error('Error in online operation:', error);
    
    if (error instanceof Error && 
        (error.message.includes('network') || 
         error.message.includes('Failed to fetch'))) {
      // Network related error, use offline operation
      return offlineOperation();
    }
    
    // Other error, use error handler if provided
    if (errorHandler) {
      return errorHandler(error);
    }
    
    throw error;
  }
}