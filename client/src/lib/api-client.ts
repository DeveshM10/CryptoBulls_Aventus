/**
 * API Client with offline support
 * 
 * This module provides an API client that works offline by
 * falling back to local storage when no network is available.
 */

import { useFinanceStore } from '../components/finance-ai/finance-store';
import { STORAGE_KEYS, saveToLocalStorage, getFromLocalStorage } from './offline-storage';
import { Asset, DailyExpense, Expense, Income, Liability, Transaction } from '../types/finance';

// Default API options
const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
};

// Network error detection
function isNetworkError(error: any): boolean {
  return (
    error instanceof TypeError && 
    (error.message.includes('Network') || 
     error.message.includes('Failed to fetch'))
  );
}

// Check if we're offline
export function isOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}

// Add pending operation to queue
function addToSyncQueue(endpoint: string, method: string, data?: any): void {
  const queue = getFromLocalStorage<Array<{endpoint: string, method: string, data: any}>>(
    STORAGE_KEYS.NETWORK_QUEUE, 
    []
  );
  
  queue.push({ endpoint, method, data });
  saveToLocalStorage(STORAGE_KEYS.NETWORK_QUEUE, queue);
}

// Process sync queue when back online
async function processSyncQueue() {
  const queue = getFromLocalStorage<Array<{endpoint: string, method: string, data: any}>>(
    STORAGE_KEYS.NETWORK_QUEUE, 
    []
  );
  
  if (queue.length === 0) return;
  
  console.log(`Processing ${queue.length} queued operations`);
  
  const newQueue = [];
  for (const operation of queue) {
    try {
      await fetch(operation.endpoint, {
        method: operation.method,
        headers: { 'Content-Type': 'application/json' },
        body: operation.data ? JSON.stringify(operation.data) : undefined,
      });
      console.log(`Successfully processed: ${operation.method} ${operation.endpoint}`);
    } catch (error) {
      console.error(`Failed to process: ${operation.method} ${operation.endpoint}`, error);
      newQueue.push(operation);
    }
  }
  
  saveToLocalStorage(STORAGE_KEYS.NETWORK_QUEUE, newQueue);
}

// Set up offline/online handlers
export function setupNetworkHandlers(): () => void {
  const handleOnline = () => {
    console.log('Network connection restored - syncing data');
    processSyncQueue();
  };
  
  window.addEventListener('online', handleOnline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
  };
}

// API client with offline support
class APIClient {
  // GET with offline fallback
  async get<T>(endpoint: string, storageKey: string, defaultValue: T): Promise<T> {
    // Return cached data if offline
    if (isOffline()) {
      console.log(`Offline: using cached data for ${endpoint}`);
      return getFromLocalStorage<T>(storageKey, defaultValue);
    }
    
    try {
      const response = await fetch(endpoint, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache successful response
      saveToLocalStorage(storageKey, data);
      
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      
      // Use cached data for network errors
      if (isNetworkError(error)) {
        return getFromLocalStorage<T>(storageKey, defaultValue);
      }
      
      throw error;
    }
  }
  
  // POST with offline queue
  async post<T>(endpoint: string, data: any): Promise<T> {
    if (isOffline()) {
      console.log(`Offline: queuing POST to ${endpoint}`);
      addToSyncQueue(endpoint, 'POST', data);
      
      // Return optimistic response
      return { success: true, queued: true } as unknown as T;
    }
    
    try {
      const response = await fetch(endpoint, {
        ...defaultOptions,
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      
      // Queue request if network error
      if (isNetworkError(error)) {
        addToSyncQueue(endpoint, 'POST', data);
        return { success: true, queued: true } as unknown as T;
      }
      
      throw error;
    }
  }
  
  // PUT with offline queue
  async put<T>(endpoint: string, data: any): Promise<T> {
    if (isOffline()) {
      console.log(`Offline: queuing PUT to ${endpoint}`);
      addToSyncQueue(endpoint, 'PUT', data);
      
      // Return optimistic response
      return { success: true, queued: true } as unknown as T;
    }
    
    try {
      const response = await fetch(endpoint, {
        ...defaultOptions,
        method: 'PUT',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error putting to ${endpoint}:`, error);
      
      // Queue request if network error
      if (isNetworkError(error)) {
        addToSyncQueue(endpoint, 'PUT', data);
        return { success: true, queued: true } as unknown as T;
      }
      
      throw error;
    }
  }
  
  // DELETE with offline queue
  async delete<T>(endpoint: string): Promise<T> {
    if (isOffline()) {
      console.log(`Offline: queuing DELETE to ${endpoint}`);
      addToSyncQueue(endpoint, 'DELETE');
      
      // Return optimistic response
      return { success: true, queued: true } as unknown as T;
    }
    
    try {
      const response = await fetch(endpoint, {
        ...defaultOptions,
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error deleting ${endpoint}:`, error);
      
      // Queue request if network error
      if (isNetworkError(error)) {
        addToSyncQueue(endpoint, 'DELETE');
        return { success: true, queued: true } as unknown as T;
      }
      
      throw error;
    }
  }
  
  // Convenience methods for different data types
  async getAssets(): Promise<Asset[]> {
    const assets = await this.get<Asset[]>('/api/assets', STORAGE_KEYS.ASSETS, []);
    // Update store with data
    const store = useFinanceStore.getState();
    store.assets = assets;
    return assets;
  }
  
  async getLiabilities(): Promise<Liability[]> {
    const liabilities = await this.get<Liability[]>('/api/liabilities', STORAGE_KEYS.LIABILITIES, []);
    // Update store with data
    const store = useFinanceStore.getState();
    store.liabilities = liabilities;
    return liabilities;
  }
  
  async getBudget(): Promise<Expense[]> {
    const budget = await this.get<Expense[]>('/api/budget', STORAGE_KEYS.BUDGET, []);
    // Update store with data
    const store = useFinanceStore.getState();
    store.expenses = budget;
    return budget;
  }
  
  async getIncome(): Promise<Income[]> {
    const income = await this.get<Income[]>('/api/income', STORAGE_KEYS.INCOME, []);
    // Update store with data
    const store = useFinanceStore.getState();
    store.incomes = income;
    return income;
  }
  
  async getDailyExpenses(): Promise<DailyExpense[]> {
    const expenses = await this.get<DailyExpense[]>('/api/daily-expenses', STORAGE_KEYS.DAILY_EXPENSES, []);
    // Update store with data
    const store = useFinanceStore.getState();
    store.dailyExpenses = expenses;
    return expenses;
  }
  
  async getTransactions(): Promise<Transaction[]> {
    const transactions = await this.get<Transaction[]>('/api/transactions', STORAGE_KEYS.TRANSACTIONS, []);
    // Update store with data
    const store = useFinanceStore.getState();
    store.transactions = transactions;
    return transactions;
  }
}

// Export singleton instance
export const api = new APIClient();

// Initialize on app load
export function initAPIClient(): void {
  setupNetworkHandlers();
  
  // If we're online, process any queued operations
  if (!isOffline()) {
    processSyncQueue();
  }
}