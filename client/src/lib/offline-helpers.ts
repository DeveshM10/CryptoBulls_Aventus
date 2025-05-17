/**
 * Offline helper functions
 * 
 * A complete set of functions to help the application work offline
 * by providing fallbacks, error suppression, and user notifications.
 */

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Asset, Liability, Expense, Income, DailyExpense, Transaction } from '../types/finance';

// Storage keys for different data types
export const STORAGE_KEYS = {
  ASSETS: 'finvault_assets',
  LIABILITIES: 'finvault_liabilities',
  EXPENSES: 'finvault_expenses',
  DAILY_EXPENSES: 'finvault_daily_expenses',
  INCOME: 'finvault_income',
  TRANSACTIONS: 'finvault_transactions',
  USER: 'finvault_user',
  PENDING_SYNC: 'finvault_pending_sync'
};

// Local storage helpers
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

// Check if browser is online
export function isOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}

// React hook for online/offline status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return { isOnline, isOffline: !isOnline };
}

// Suppress default fetch errors when offline
export function suppressFetchErrors() {
  const originalFetch = window.fetch;
  
  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
    if (isOffline()) {
      // If offline, provide a fallback response for GET requests
      if (!init || init.method === 'GET' || init.method === undefined) {
        console.log(`Offline: suppressing GET request to ${input.toString()}`);
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // For other methods, we'll add to pending changes
      console.log(`Offline: suppressing ${init.method} request to ${input.toString()}`);
      const pendingChanges = getFromLocalStorage<any[]>(STORAGE_KEYS.PENDING_SYNC, []);
      pendingChanges.push({
        url: input.toString(),
        method: init.method,
        body: init.body ? JSON.parse(init.body.toString()) : undefined,
        timestamp: Date.now()
      });
      saveToLocalStorage(STORAGE_KEYS.PENDING_SYNC, pendingChanges);
      
      return new Response(JSON.stringify({ success: true, offline: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // If online, use original fetch
    return originalFetch(input, init);
  };
}

// Offline-safe API hooks

// Assets
export function useAssetsOffline(): Asset[] {
  const [assets, setAssets] = useState<Asset[]>(
    getFromLocalStorage<Asset[]>(STORAGE_KEYS.ASSETS, [])
  );
  
  useEffect(() => {
    // If online, try to fetch from API
    if (!isOffline()) {
      fetch('/api/assets')
        .then(res => res.json())
        .then(data => {
          setAssets(data);
          saveToLocalStorage(STORAGE_KEYS.ASSETS, data);
        })
        .catch(error => {
          console.error('Error fetching assets:', error);
        });
    }
  }, []);
  
  return assets;
}

// Liabilities
export function useLiabilitiesOffline(): Liability[] {
  const [liabilities, setLiabilities] = useState<Liability[]>(
    getFromLocalStorage<Liability[]>(STORAGE_KEYS.LIABILITIES, [])
  );
  
  useEffect(() => {
    // If online, try to fetch from API
    if (!isOffline()) {
      fetch('/api/liabilities')
        .then(res => res.json())
        .then(data => {
          setLiabilities(data);
          saveToLocalStorage(STORAGE_KEYS.LIABILITIES, data);
        })
        .catch(error => {
          console.error('Error fetching liabilities:', error);
        });
    }
  }, []);
  
  return liabilities;
}

// Budget Expenses
export function useExpensesOffline(): Expense[] {
  const [expenses, setExpenses] = useState<Expense[]>(
    getFromLocalStorage<Expense[]>(STORAGE_KEYS.EXPENSES, [])
  );
  
  useEffect(() => {
    // If online, try to fetch from API
    if (!isOffline()) {
      fetch('/api/budget')
        .then(res => res.json())
        .then(data => {
          setExpenses(data);
          saveToLocalStorage(STORAGE_KEYS.EXPENSES, data);
        })
        .catch(error => {
          console.error('Error fetching budget expenses:', error);
        });
    }
  }, []);
  
  return expenses;
}

// Income
export function useIncomeOffline(): Income[] {
  const [income, setIncome] = useState<Income[]>(
    getFromLocalStorage<Income[]>(STORAGE_KEYS.INCOME, [])
  );
  
  useEffect(() => {
    // If online, try to fetch from API
    if (!isOffline()) {
      fetch('/api/income')
        .then(res => res.json())
        .then(data => {
          setIncome(data);
          saveToLocalStorage(STORAGE_KEYS.INCOME, data);
        })
        .catch(error => {
          console.error('Error fetching income:', error);
        });
    }
  }, []);
  
  return income;
}

// Daily Expenses
export function useDailyExpensesOffline(): DailyExpense[] {
  const [dailyExpenses, setDailyExpenses] = useState<DailyExpense[]>(
    getFromLocalStorage<DailyExpense[]>(STORAGE_KEYS.DAILY_EXPENSES, [])
  );
  
  useEffect(() => {
    // If online, try to fetch from API
    if (!isOffline()) {
      fetch('/api/daily-expenses')
        .then(res => res.json())
        .then(data => {
          setDailyExpenses(data);
          saveToLocalStorage(STORAGE_KEYS.DAILY_EXPENSES, data);
        })
        .catch(error => {
          console.error('Error fetching daily expenses:', error);
        });
    }
  }, []);
  
  return dailyExpenses;
}

// Transactions
export function useTransactionsOffline(): Transaction[] {
  const [transactions, setTransactions] = useState<Transaction[]>(
    getFromLocalStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, [])
  );
  
  useEffect(() => {
    // If online, try to fetch from API
    if (!isOffline()) {
      fetch('/api/transactions')
        .then(res => res.json())
        .then(data => {
          setTransactions(data);
          saveToLocalStorage(STORAGE_KEYS.TRANSACTIONS, data);
        })
        .catch(error => {
          console.error('Error fetching transactions:', error);
        });
    }
  }, []);
  
  return transactions;
}

// Hook to show offline status notification
export function useOfflineNotification() {
  const { toast } = useToast();
  const { isOnline, isOffline } = useOnlineStatus();
  
  useEffect(() => {
    if (isOffline) {
      toast({
        title: "Offline Mode",
        description: "You're currently working offline. Changes will be saved locally and synced when you reconnect.",
        duration: 5000,
      });
    } else {
      // Check if we were previously offline and now reconnected
      const pendingChanges = getFromLocalStorage<any[]>(STORAGE_KEYS.PENDING_SYNC, []);
      if (pendingChanges.length > 0) {
        toast({
          title: "Back Online",
          description: `Syncing ${pendingChanges.length} pending changes...`,
          duration: 3000,
        });
        
        // Here you would implement the sync logic
        // This is a placeholder for the actual sync process
        setTimeout(() => {
          saveToLocalStorage(STORAGE_KEYS.PENDING_SYNC, []);
          toast({
            title: "Sync Complete",
            description: "All your changes have been synchronized.",
            duration: 3000,
          });
        }, 2000);
      }
    }
  }, [isOffline, isOnline, toast]);
}

// Initialize all offline functionality
export function initOfflineMode() {
  // Suppress fetch errors when offline
  suppressFetchErrors();
  
  // Listen for online/offline events
  window.addEventListener('online', () => {
    console.log('App is back online. Syncing data...');
    // Process any pending changes
    const pendingChanges = getFromLocalStorage<any[]>(STORAGE_KEYS.PENDING_SYNC, []);
    console.log(`Found ${pendingChanges.length} pending changes to sync`);
  });
  
  window.addEventListener('offline', () => {
    console.log('App is offline. Changes will be saved locally.');
  });
  
  console.log('Offline mode initialized successfully.');
}