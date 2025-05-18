/**
 * Offline Storage System
 * 
 * This module provides a complete offline-first data storage system
 * with automatic synchronization when connection is restored.
 */

// Storage keys for different data types
export const STORAGE_KEYS = {
  ASSETS: 'finvault_assets',
  LIABILITIES: 'finvault_liabilities',
  EXPENSES: 'finvault_expenses',
  DAILY_EXPENSES: 'finvault_daily_expenses',
  INCOME: 'finvault_income',
  TRANSACTIONS: 'finvault_transactions',
  USER: 'finvault_user',
  NETWORK_QUEUE: 'finvault_network_queue'
};

// Generic local storage helpers
export function saveToLocalStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save data to localStorage key: ${key}`, error);
  }
}

export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Failed to get data from localStorage key: ${key}`, error);
    return defaultValue;
  }
}

// Network request queue for offline operations
interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  body?: any;
  timestamp: number;
}

// Queue a request to be sent when online
export function queueRequest(url: string, method: string, body?: any): string {
  const requestId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  const request: QueuedRequest = {
    id: requestId,
    url,
    method,
    body,
    timestamp: Date.now()
  };
  
  const queue = getFromLocalStorage<QueuedRequest[]>(STORAGE_KEYS.NETWORK_QUEUE, []);
  queue.push(request);
  saveToLocalStorage(STORAGE_KEYS.NETWORK_QUEUE, queue);
  
  return requestId;
}

// Process queued requests when online
export async function processQueue(): Promise<void> {
  if (!navigator.onLine) return;
  
  const queue = getFromLocalStorage<QueuedRequest[]>(STORAGE_KEYS.NETWORK_QUEUE, []);
  if (queue.length === 0) return;
  
  console.log(`Processing ${queue.length} queued network requests`);
  
  // Process in order (FIFO)
  const requestsToProcess = [...queue];
  const newQueue: QueuedRequest[] = [];
  
  for (const request of requestsToProcess) {
    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: request.body ? JSON.stringify(request.body) : undefined
      });
      
      if (!response.ok) {
        throw new Error(`Failed request: ${response.status} ${response.statusText}`);
      }
      
      console.log(`Successfully processed queued request to ${request.url}`);
    } catch (error) {
      console.error(`Failed to process queued request:`, error);
      // Keep failed requests in the queue if they are less than 24 hours old
      if (Date.now() - request.timestamp < 24 * 60 * 60 * 1000) {
        newQueue.push(request);
      } else {
        console.warn(`Dropping old request to ${request.url} after 24h retry period`);
      }
    }
  }
  
  // Update the queue with any remaining requests
  saveToLocalStorage(STORAGE_KEYS.NETWORK_QUEUE, newQueue);
}

// Check if we're in offline mode
export function isOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}

// Listen for online status changes
export function setupOfflineListeners(): () => void {
  const handleOnline = () => {
    console.log('Connection restored - processing queued requests');
    processQueue();
  };
  
  window.addEventListener('online', handleOnline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
  };
}

// API wrapper with offline support
export async function fetchWithOfflineSupport<T>(
  url: string,
  options: RequestInit = {},
  storageKey: string,
  defaultValue: T
): Promise<T> {
  // If offline, return cached data
  if (isOffline()) {
    console.log(`Offline: using cached data for ${url}`);
    return getFromLocalStorage<T>(storageKey, defaultValue);
  }
  
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache data for offline use
    saveToLocalStorage(storageKey, data);
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    
    // If there's a network error, use cached data
    return getFromLocalStorage<T>(storageKey, defaultValue);
  }
}

// POST/PUT with offline support
export async function mutateWithOfflineSupport<T>(
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body: any,
  onlineCallback?: (data: any) => void
): Promise<{ success: boolean; data?: T; error?: string; queued?: boolean }> {
  if (isOffline()) {
    // Queue the request for later
    const requestId = queueRequest(url, method, body);
    console.log(`Offline: queued ${method} request to ${url} with ID ${requestId}`);
    
    // For creates/updates, we can optimistically update the UI
    // The actual sync will happen when online
    return { success: true, queued: true };
  }
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (onlineCallback) {
      onlineCallback(data);
    }
    
    return { success: true, data };
  } catch (error) {
    console.error(`Error with ${method} to ${url}:`, error);
    
    // Queue the request for later if it's a network error
    if (error instanceof Error && (
      error.message.includes('network') || 
      error.message.includes('Failed to fetch')
    )) {
      const requestId = queueRequest(url, method, body);
      console.log(`Network error: queued ${method} request to ${url} with ID ${requestId}`);
      return { success: true, queued: true };
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Initialize the offline system
export function initOfflineSystem(): void {
  console.log('Initializing FinVault offline system');
  setupOfflineListeners();
  
  // Process any queued requests if we're online
  if (navigator.onLine) {
    processQueue();
  }
}