/**
 * Offline detector utility
 * 
 * This module provides functions to detect and handle offline status
 * to ensure that FinVault works properly without internet access.
 */

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// Event listeners for online/offline events
export function setupOfflineDetection(callback: (isOnline: boolean) => void) {
  const handleOnlineStatusChange = () => {
    callback(navigator.onLine);
  };

  // Check initial status
  callback(navigator.onLine);

  // Add event listeners
  window.addEventListener('online', handleOnlineStatusChange);
  window.addEventListener('offline', handleOnlineStatusChange);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnlineStatusChange);
    window.removeEventListener('offline', handleOnlineStatusChange);
  };
}

// React hook for using offline status
export function useOfflineDetector(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    return setupOfflineDetection(setIsOnline);
  }, []);

  return !isOnline;
}

// Function to check if a resource can be accessed offline
export async function isResourceAvailableOffline(url: string): Promise<boolean> {
  if (typeof navigator === 'undefined') return true;
  
  if (!navigator.onLine) {
    // Check if resource is in cache
    try {
      const cache = await caches.open('finvault-cache');
      const response = await cache.match(url);
      return !!response;
    } catch (error) {
      console.error('Error checking cache:', error);
      return false;
    }
  }
  
  return true;
}

// Create offline context
interface OfflineContextType {
  isOffline: boolean;
  setOfflineMode: (mode: boolean) => void;
}

export const OfflineContext = createContext<OfflineContextType>({
  isOffline: false,
  setOfflineMode: () => {},
});

interface OfflineProviderProps {
  children: ReactNode;
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({ children }) => {
  const [isUserOffline, setIsUserOffline] = useState(false);
  const isSystemOffline = typeof navigator !== 'undefined' ? !navigator.onLine : false;
  const isOffline = isUserOffline || isSystemOffline;

  useEffect(() => {
    return setupOfflineDetection((online) => {
      if (!online && !isUserOffline) {
        console.log('System went offline');
      }
    });
  }, [isUserOffline]);

  return (
    <OfflineContext.Provider 
      value={{ 
        isOffline, 
        setOfflineMode: setIsUserOffline 
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOfflineMode = () => useContext(OfflineContext);