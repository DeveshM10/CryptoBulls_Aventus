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
import { setupSyncListener, hasPendingSyncItems, checkForUnsyncedData } from '../../lib/edge-ai/sync-manager';

interface EdgeAIContextType {
  isInitialized: boolean;
  isOffline: boolean;
  hasPendingSync: boolean;
  triggerSync: () => Promise<void>;
}

const EdgeAIContext = createContext<EdgeAIContextType>({
  isInitialized: false,
  isOffline: false,
  hasPendingSync: false,
  triggerSync: async () => {}
});

interface EdgeAIProviderProps {
  children: React.ReactNode;
}

export function EdgeAIProvider({ children }: EdgeAIProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [hasPendingSync, setHasPendingSync] = useState(false);
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
  
  // Listen for online/offline events and setup sync
  useEffect(() => {
    // Check for pending sync items
    const checkSyncStatus = () => {
      const hasPending = hasPendingSyncItems();
      setHasPendingSync(hasPending);
      return hasPending;
    };
    
    // Run initial check
    checkSyncStatus();
    
    // Handle coming back online
    const handleOnline = async () => {
      setIsOffline(false);
      
      // Check if we have pending sync items
      if (checkSyncStatus()) {
        toast({
          title: 'You\'re Back Online',
          description: 'FinVault is syncing your offline changes to the server.',
        });
        
        // Sync will happen automatically through the sync listener
      } else {
        toast({
          title: 'You\'re Back Online',
          description: 'FinVault is now connected to the network.',
        });
      }
    };
    
    // Handle going offline
    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: 'Offline Mode Activated',
        description: 'Your changes will be saved locally and synced when you reconnect.',
      });
    };
    
    // Set up sync listener (this automatically syncs when coming online)
    const cleanupSyncListener = setupSyncListener();
    
    // Check for unsynced data periodically
    const syncInterval = setInterval(() => {
      if (navigator.onLine) {
        checkForUnsyncedData().then(() => {
          checkSyncStatus();
        });
      }
    }, 60000); // Check every minute
    
    // Set up event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      cleanupSyncListener();
      clearInterval(syncInterval);
    };
  }, [toast]);
  
  // Function to manually trigger sync
  const triggerSync = async () => {
    if (!navigator.onLine) {
      toast({
        title: 'Cannot Sync',
        description: 'You are currently offline. Changes will be synced automatically when you reconnect.',
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: 'Syncing Data...',
      description: 'Uploading your local changes to the server.'
    });
    
    try {
      const result = await checkForUnsyncedData();
      setHasPendingSync(hasPendingSyncItems());
      
      toast({
        title: 'Sync Complete',
        description: 'Your changes have been uploaded to the server.'
      });
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: 'Sync Failed',
        description: 'There was a problem syncing your data. Will retry automatically.',
        variant: 'destructive'
      });
    }
  };

  return (
    <EdgeAIContext.Provider value={{ 
      isInitialized, 
      isOffline, 
      hasPendingSync, 
      triggerSync 
    }}>
      {children}
      {isOffline && <OfflineIndicator hasPendingChanges={hasPendingSync} />}
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
function OfflineIndicator({ hasPendingChanges = false }: { hasPendingChanges?: boolean }) {
  return (
    <div className="fixed bottom-4 left-4 z-50 rounded-md bg-yellow-100 border border-yellow-300 p-2 px-3 text-sm flex items-center gap-2 text-yellow-800 shadow-md">
      <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
      <span>
        Offline Mode
        {hasPendingChanges && (
          <span className="ml-1 text-xs opacity-80">• Changes will sync when online</span>
        )}
      </span>
    </div>
  );
}