/**
 * Edge AI Provider
 * 
 * This component initializes the Edge AI system and
 * provides it to the rest of the application.
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { initDataStore, loadAllData } from '../../lib/edge-ai/data-store';
import { loadModels } from '../../lib/edge-ai/models';

interface EdgeAIContextType {
  isInitialized: boolean;
  isOffline: boolean;
}

const EdgeAIContext = createContext<EdgeAIContextType>({
  isInitialized: false,
  isOffline: false
});

interface EdgeAIProviderProps {
  children: React.ReactNode;
}

export function EdgeAIProvider({ children }: EdgeAIProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();
  
  // Initialize Edge AI on component mount
  useEffect(() => {
    const initializeEdgeAI = async () => {
      try {
        // First, detect if we're offline
        const offline = typeof navigator !== 'undefined' && !navigator.onLine;
        setIsOffline(offline);
        
        // Initialize the IndexedDB data store
        await initDataStore();
        
        // Load all data from IndexedDB
        await loadAllData();
        
        // Load AI models
        await loadModels();
        
        // Set as initialized
        setIsInitialized(true);
        
        if (offline) {
          toast({
            title: 'Offline Mode Active',
            description: 'FinVault is running in offline mode. All features will work locally.',
          });
        }
      } catch (error) {
        console.error('Failed to initialize Edge AI:', error);
        toast({
          title: 'Initialization Error',
          description: 'Failed to initialize offline capabilities. Some features may not work.',
          variant: 'destructive'
        });
      }
    };
    
    initializeEdgeAI();
  }, [toast]);
  
  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast({
        title: 'You\'re Back Online',
        description: 'FinVault is now connected to the network.',
      });
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: 'Offline Mode Activated',
        description: 'FinVault is now running in offline mode. All features will continue to work locally.',
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);
  
  return (
    <EdgeAIContext.Provider value={{ isInitialized, isOffline }}>
      {children}
      {isOffline && <OfflineIndicator />}
    </EdgeAIContext.Provider>
  );
}

/**
 * Hook to access Edge AI context
 */
export function useEdgeAI() {
  return useContext(EdgeAIContext);
}

/**
 * Offline status indicator
 */
function OfflineIndicator() {
  return (
    <div className="fixed bottom-4 left-4 z-50 rounded-md bg-yellow-100 border border-yellow-300 p-2 px-3 text-sm flex items-center gap-2 text-yellow-800 shadow-md">
      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
      <span>Offline Mode</span>
    </div>
  );
}