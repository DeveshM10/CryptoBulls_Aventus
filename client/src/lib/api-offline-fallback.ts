/**
 * API offline fallback
 * 
 * This module provides fallback mechanisms for API calls
 * when the application is running offline.
 */

import { useFinanceStore } from "../components/finance-ai/finance-store";

// Fallback data storage
const localStorageKeys = {
  assets: 'finvault_offline_assets',
  liabilities: 'finvault_offline_liabilities',
  budget: 'finvault_offline_budget',
  expenses: 'finvault_offline_expenses',
  income: 'finvault_offline_income',
  transactions: 'finvault_offline_transactions',
  user: 'finvault_offline_user'
};

// Get data from local storage with fallback to default data
export function getLocalData<T>(key: string, defaultData: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultData;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultData;
  }
}

// Save data to local storage
export function saveLocalData(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
}

// API request with offline fallback
export async function apiRequestWithFallback<T>(
  url: string, 
  options: RequestInit = {}, 
  fallbackKey: string,
  defaultData: T
): Promise<T> {
  // Check if we're offline
  if (!navigator.onLine) {
    console.log(`Offline mode: using local data for ${url}`);
    return getLocalData<T>(fallbackKey, defaultData);
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Save successful response to local storage for offline use
    saveLocalData(fallbackKey, data);
    
    return data;
  } catch (error) {
    console.error('API request error:', error);
    
    // Fallback to local storage if request fails
    return getLocalData<T>(fallbackKey, defaultData);
  }
}

// Sync local data with store
export function syncOfflineDataWithStore(): void {
  const store = useFinanceStore.getState();
  
  // Save current state to localStorage
  saveLocalData(localStorageKeys.assets, store.assets);
  saveLocalData(localStorageKeys.liabilities, store.liabilities);
  saveLocalData(localStorageKeys.budget, store.expenses);
  saveLocalData(localStorageKeys.expenses, store.dailyExpenses);
  saveLocalData(localStorageKeys.income, store.incomes);
  saveLocalData(localStorageKeys.transactions, store.transactions);
}

// Initialize API fallbacks
export function initializeOfflineFallbacks(): void {
  // Setup a listener for the store to automatically save changes
  const unsubscribe = useFinanceStore.subscribe((state) => {
    // Debounce to prevent excessive writes
    if ((window as any).offlineDataSyncTimeout) {
      clearTimeout((window as any).offlineDataSyncTimeout);
    }
    
    (window as any).offlineDataSyncTimeout = setTimeout(() => {
      syncOfflineDataWithStore();
    }, 1000); // 1-second delay
  });
  
  // Clean up on app unmount (if needed)
  window.addEventListener('beforeunload', () => {
    unsubscribe();
    if ((window as any).offlineDataSyncTimeout) {
      clearTimeout((window as any).offlineDataSyncTimeout);
    }
  });
}

// API endpoints with offline fallback wrappers
export const offlineAPI = {
  getAssets: async () => apiRequestWithFallback('/api/assets', {}, localStorageKeys.assets, []),
  getLiabilities: async () => apiRequestWithFallback('/api/liabilities', {}, localStorageKeys.liabilities, []),
  getBudget: async () => apiRequestWithFallback('/api/budget', {}, localStorageKeys.budget, []),
  getExpenses: async () => apiRequestWithFallback('/api/daily-expenses', {}, localStorageKeys.expenses, []),
  getIncome: async () => apiRequestWithFallback('/api/income', {}, localStorageKeys.income, []),
  getTransactions: async () => apiRequestWithFallback('/api/transactions', {}, localStorageKeys.transactions, []),
  getUserProfile: async () => apiRequestWithFallback('/api/user', {}, localStorageKeys.user, null),
};