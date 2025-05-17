/**
 * IndexedDB Storage System
 * 
 * A complete client-side database system for storing all financial data
 * locally with real-time updates.
 */

// Database name and version
const DB_NAME = 'finvault-local';
const DB_VERSION = 1;

// Store names
const STORES = {
  ASSETS: 'assets',
  LIABILITIES: 'liabilities',
  EXPENSES: 'expenses',
  DAILY_EXPENSES: 'daily-expenses',
  INCOME: 'income',
  TRANSACTIONS: 'transactions',
  BUDGETS: 'budgets',
  SETTINGS: 'settings'
};

// Database connection
let db: IDBDatabase | null = null;

/**
 * Initialize the database and create object stores
 */
export function initDatabase(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      console.error('IndexedDB not supported');
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', (event.target as any).error);
      reject((event.target as any).error);
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      console.log('Database initialized successfully');
      resolve(true);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create object stores for all data types
      if (!database.objectStoreNames.contains(STORES.ASSETS)) {
        database.createObjectStore(STORES.ASSETS, { keyPath: 'id' });
      }

      if (!database.objectStoreNames.contains(STORES.LIABILITIES)) {
        database.createObjectStore(STORES.LIABILITIES, { keyPath: 'id' });
      }

      if (!database.objectStoreNames.contains(STORES.EXPENSES)) {
        database.createObjectStore(STORES.EXPENSES, { keyPath: 'id' });
      }

      if (!database.objectStoreNames.contains(STORES.DAILY_EXPENSES)) {
        database.createObjectStore(STORES.DAILY_EXPENSES, { keyPath: 'id' });
      }

      if (!database.objectStoreNames.contains(STORES.INCOME)) {
        database.createObjectStore(STORES.INCOME, { keyPath: 'id' });
      }

      if (!database.objectStoreNames.contains(STORES.TRANSACTIONS)) {
        database.createObjectStore(STORES.TRANSACTIONS, { keyPath: 'id' });
      }

      if (!database.objectStoreNames.contains(STORES.BUDGETS)) {
        database.createObjectStore(STORES.BUDGETS, { keyPath: 'id' });
      }

      if (!database.objectStoreNames.contains(STORES.SETTINGS)) {
        database.createObjectStore(STORES.SETTINGS, { keyPath: 'id' });
      }
    };
  });
}

/**
 * Add an item to a store
 */
export function addItem<T extends { id: string }>(storeName: string, item: T): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    try {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      // If id is not provided, generate one
      if (!item.id) {
        item.id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      const request = store.add(item);

      request.onsuccess = () => {
        resolve(item);
      };

      request.onerror = (event) => {
        reject((event.target as any).error);
      };
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Get all items from a store
 */
export function getAllItems<T>(storeName: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    try {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result as T[]);
      };

      request.onerror = (event) => {
        reject((event.target as any).error);
      };
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Get an item by id
 */
export function getItemById<T>(storeName: string, id: string): Promise<T | null> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    try {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result as T || null);
      };

      request.onerror = (event) => {
        reject((event.target as any).error);
      };
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Update an item
 */
export function updateItem<T extends { id: string }>(storeName: string, item: T): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    try {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);

      request.onsuccess = () => {
        resolve(item);
      };

      request.onerror = (event) => {
        reject((event.target as any).error);
      };
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Delete an item
 */
export function deleteItem(storeName: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    try {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject((event.target as any).error);
      };
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Clear all data in a store
 */
export function clearStore(storeName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }

    try {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject((event.target as any).error);
      };
    } catch (error) {
      reject(error);
    }
  });
}