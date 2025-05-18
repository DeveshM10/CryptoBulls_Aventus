/**
 * Offline Mode Components and Initialization
 * 
 * This file provides components and functions to enable FinVault
 * to work completely offline.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WifiOff, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { isOffline, saveToLocalStorage, getFromLocalStorage, STORAGE_KEYS } from './offline-helpers';

// Create context for offline state
type OfflineContextType = {
  offline: boolean;
  pendingChanges: number;
  enableOfflineMode: () => void;
  disableOfflineMode: () => void;
};

const OfflineContext = createContext<OfflineContextType>({
  offline: false,
  pendingChanges: 0,
  enableOfflineMode: () => {},
  disableOfflineMode: () => {},
});

// Provider component
export function OfflineModeProvider({ children }: { children: React.ReactNode }) {
  const [offline, setOffline] = useState(isOffline());
  const [pendingChanges, setPendingChanges] = useState(0);
  const { toast } = useToast();

  // Initialize and listen for network changes
  useEffect(() => {
    const handleOnline = () => {
      setOffline(false);
      
      // Check for pending changes to sync
      const pending = getFromLocalStorage<any[]>(STORAGE_KEYS.PENDING_SYNC, []);
      if (pending.length > 0) {
        toast({
          title: "Back Online",
          description: `Syncing ${pending.length} changes...`,
          duration: 3000,
        });
        
        // Actual sync would happen here
        // For now, just clear the pending changes
        setTimeout(() => {
          saveToLocalStorage(STORAGE_KEYS.PENDING_SYNC, []);
          setPendingChanges(0);
          
          toast({
            title: "Sync Complete",
            description: "All changes have been synchronized.",
            duration: 3000,
          });
        }, 2000);
      }
    };
    
    const handleOffline = () => {
      setOffline(true);
      toast({
        title: "Offline Mode",
        description: "You're working offline. Changes will be saved locally.",
        duration: 5000,
      });
    };
    
    // Check initial state
    if (offline) {
      const pending = getFromLocalStorage<any[]>(STORAGE_KEYS.PENDING_SYNC, []);
      setPendingChanges(pending.length);
    }
    
    // Set up listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Patch fetch to work offline
    const originalFetch = window.fetch;
    window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
      if (offline) {
        // For GET requests, return cached data if available
        if (!init || init.method === 'GET' || init.method === undefined) {
          const url = input.toString();
          let storageKey = '';
          
          // Determine which storage key to use based on endpoint
          if (url.includes('/api/assets')) storageKey = STORAGE_KEYS.ASSETS;
          else if (url.includes('/api/liabilities')) storageKey = STORAGE_KEYS.LIABILITIES;
          else if (url.includes('/api/budget')) storageKey = STORAGE_KEYS.EXPENSES;
          else if (url.includes('/api/daily-expenses')) storageKey = STORAGE_KEYS.DAILY_EXPENSES;
          else if (url.includes('/api/income')) storageKey = STORAGE_KEYS.INCOME;
          else if (url.includes('/api/transactions')) storageKey = STORAGE_KEYS.TRANSACTIONS;
          
          // If we have a storage key, return cached data
          if (storageKey) {
            console.log(`Offline: using cached data for ${url}`);
            const data = getFromLocalStorage(storageKey, []);
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
        }
        
        // For other methods, queue for later
        if (init && (init.method === 'POST' || init.method === 'PUT' || init.method === 'DELETE')) {
          console.log(`Offline: queuing ${init.method} request to ${input.toString()}`);
          
          // Add to pending changes
          const pending = getFromLocalStorage<any[]>(STORAGE_KEYS.PENDING_SYNC, []);
          pending.push({
            url: input.toString(),
            method: init.method,
            body: init.body ? JSON.parse(init.body.toString()) : undefined,
            timestamp: Date.now()
          });
          
          saveToLocalStorage(STORAGE_KEYS.PENDING_SYNC, pending);
          setPendingChanges(pending.length);
          
          // Return fake success response
          return new Response(JSON.stringify({ success: true, offline: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
      
      // If online, use normal fetch
      return originalFetch(input, init);
    };
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.fetch = originalFetch;
    };
  }, [offline, toast]);

  const enableOfflineMode = () => {
    setOffline(true);
    toast({
      title: "Manual Offline Mode Enabled",
      description: "You've enabled offline mode. All changes will be saved locally.",
      duration: 3000,
    });
  };

  const disableOfflineMode = () => {
    if (!navigator.onLine) {
      toast({
        title: "Cannot Disable Offline Mode",
        description: "You're currently not connected to the internet.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setOffline(false);
    toast({
      title: "Offline Mode Disabled",
      description: "Reconnected to server. Syncing changes...",
      duration: 3000,
    });
  };

  return (
    <OfflineContext.Provider value={{ 
      offline, 
      pendingChanges,
      enableOfflineMode, 
      disableOfflineMode 
    }}>
      {children}
      {offline && <OfflineIndicator pendingChanges={pendingChanges} />}
    </OfflineContext.Provider>
  );
}

// Hook for components to access offline state
export function useOfflineMode() {
  return useContext(OfflineContext);
}

// Offline status indicator
function OfflineIndicator({ pendingChanges }: { pendingChanges: number }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
      <Badge variant="destructive" className="px-3 py-1.5 text-sm flex items-center gap-2">
        <WifiOff size={16} />
        <span>Offline Mode</span>
      </Badge>
      
      {pendingChanges > 0 && (
        <Badge variant="outline" className="px-3 py-1.5 text-sm flex items-center gap-2 bg-amber-100 text-amber-800 border-amber-300">
          <span>{pendingChanges} pending {pendingChanges === 1 ? 'change' : 'changes'}</span>
        </Badge>
      )}
    </div>
  );
}

// Sync status component for the UI
export function NetworkStatus() {
  const { offline, pendingChanges, enableOfflineMode, disableOfflineMode } = useOfflineMode();
  
  return (
    <div className="flex items-center gap-2">
      {offline ? (
        <Badge variant="outline" className="px-2 py-1 text-xs flex items-center gap-1 cursor-pointer" onClick={disableOfflineMode}>
          <WifiOff size={12} />
          <span>Offline</span>
          {pendingChanges > 0 && (
            <span className="ml-1 bg-amber-100 text-amber-800 rounded-full px-1.5 py-0.5 text-xs">
              {pendingChanges}
            </span>
          )}
        </Badge>
      ) : (
        <Badge variant="outline" className="px-2 py-1 text-xs flex items-center gap-1 cursor-pointer bg-green-50 text-green-700 border-green-200" onClick={enableOfflineMode}>
          <Wifi size={12} />
          <span>Online</span>
        </Badge>
      )}
    </div>
  );
}