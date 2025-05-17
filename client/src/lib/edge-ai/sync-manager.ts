/**
 * Edge AI Sync Manager
 * 
 * Handles the synchronization of offline data to the MongoDB database
 * when internet connection is restored.
 */

import { STORES } from './constants';
import { Asset, Liability, Expense, Income } from '../../types/finance';
import { toast } from '@/hooks/use-toast';

// Track items that need to be synced
interface SyncItem {
  id: string;
  type: string;
  data: any;
  createdAt: number;
}

// API endpoints for each data type
const API_ENDPOINTS = {
  [STORES.ASSETS]: '/api/assets',
  [STORES.LIABILITIES]: '/api/liabilities',
  [STORES.EXPENSES]: '/api/budget/expenses',
  [STORES.INCOME]: '/api/budget/income'
};

// LocalStorage key for pending sync items
const SYNC_QUEUE_KEY = 'edgeai_sync_queue';

/**
 * Add an item to the sync queue
 */
export function addToSyncQueue(type: string, data: any): void {
  try {
    // Get existing queue
    const queue = getSyncQueue();
    
    // Create sync item
    const syncItem: SyncItem = {
      id: data.id,
      type,
      data,
      createdAt: Date.now()
    };
    
    // Add to queue
    queue.push(syncItem);
    
    // Save back to localStorage
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    
    console.log(`Item added to sync queue: ${type}`, data);
  } catch (err) {
    console.error('Failed to add item to sync queue:', err);
  }
}

/**
 * Get the current sync queue
 */
export function getSyncQueue(): SyncItem[] {
  try {
    const queueStr = localStorage.getItem(SYNC_QUEUE_KEY);
    return queueStr ? JSON.parse(queueStr) : [];
  } catch (err) {
    console.error('Failed to get sync queue:', err);
    return [];
  }
}

/**
 * Clear the sync queue
 */
export function clearSyncQueue(): void {
  localStorage.removeItem(SYNC_QUEUE_KEY);
}

/**
 * Check if there are items pending sync
 */
export function hasPendingSyncItems(): boolean {
  return getSyncQueue().length > 0;
}

/**
 * Process the sync queue
 */
export async function processSyncQueue(): Promise<{ success: number; failed: number }> {
  // Get the queue
  const queue = getSyncQueue();
  
  if (queue.length === 0) {
    return { success: 0, failed: 0 };
  }
  
  console.log(`Processing sync queue: ${queue.length} items`);
  
  let success = 0;
  let failed = 0;
  const remainingItems: SyncItem[] = [];
  
  // Process each item
  for (const item of queue) {
    try {
      // Skip if no API endpoint is defined for this type
      if (!API_ENDPOINTS[item.type]) {
        console.warn(`No API endpoint defined for ${item.type}, skipping`);
        remainingItems.push(item);
        failed++;
        continue;
      }
      
      // Send to server
      const response = await fetch(API_ENDPOINTS[item.type], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item.data)
      });
      
      if (response.ok) {
        success++;
      } else {
        console.error(`Failed to sync item: ${item.type}`, await response.text());
        remainingItems.push(item);
        failed++;
      }
    } catch (err) {
      console.error(`Error syncing item: ${item.type}`, err);
      remainingItems.push(item);
      failed++;
    }
  }
  
  // Update the queue with remaining items
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(remainingItems));
  
  return { success, failed };
}

/**
 * Set up a listener for online events to sync data automatically
 */
export function setupSyncListener(): () => void {
  const handleOnline = async () => {
    if (hasPendingSyncItems()) {
      console.log('Internet connection restored, syncing offline data...');
      
      // Create a toast notification
      toast({
        title: 'Syncing offline data...',
        description: 'Your offline changes are being uploaded to the server.',
      });
      
      // Process the sync queue
      const { success, failed } = await processSyncQueue();
      
      // Show result
      if (success > 0) {
        toast({
          title: 'Sync complete',
          description: `Successfully synced ${success} items${failed > 0 ? `, ${failed} failed` : ''}`,
          variant: failed > 0 ? 'default' : 'default'
        });
      } else if (failed > 0) {
        toast({
          title: 'Sync failed',
          description: `Failed to sync ${failed} items. Will retry automatically.`,
          variant: 'destructive'
        });
      }
    }
  };
  
  // Add event listener
  window.addEventListener('online', handleOnline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
  };
}

/**
 * Check for unsynchronized data
 */
export async function checkForUnsyncedData(): Promise<void> {
  if (navigator.onLine && hasPendingSyncItems()) {
    const { success, failed } = await processSyncQueue();
    console.log(`Sync check complete: ${success} synced, ${failed} failed`);
  }
}