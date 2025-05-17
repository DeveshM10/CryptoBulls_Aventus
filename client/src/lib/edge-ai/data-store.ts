/**
 * Edge AI Data Store
 * 
 * A reactive data store that provides real-time updates to the UI
 * when data changes, all processed locally with zero server dependencies.
 */

import { initDatabase, getAllItems, addItem, updateItem, deleteItem } from './indexed-db';
import { EVENTS, STORES } from './constants';
import { Asset, Liability, Expense, Income, DailyExpense, Transaction } from '../../types/finance';

// Event system for notifying UI of data changes
type EventCallback = (data: any) => void;
const eventListeners: Record<string, EventCallback[]> = {};

/**
 * Initialize the data store
 */
export async function initDataStore(): Promise<boolean> {
  try {
    // Initialize IndexedDB
    await initDatabase();
    
    // Cache initial data
    await loadAllData();
    
    return true;
  } catch (error) {
    console.error('Failed to initialize data store:', error);
    return false;
  }
}

// In-memory cache for faster access
let dataCache: {
  assets: Asset[];
  liabilities: Liability[];
  expenses: Expense[];
  dailyExpenses: DailyExpense[];
  income: Income[];
  transactions: Transaction[];
} = {
  assets: [],
  liabilities: [],
  expenses: [],
  dailyExpenses: [],
  income: [],
  transactions: []
};

/**
 * Load all data from IndexedDB
 */
export async function loadAllData(): Promise<void> {
  try {
    // Load all data types in parallel
    const [assets, liabilities, expenses, dailyExpenses, income, transactions] = await Promise.all([
      getAllItems<Asset>(STORES.ASSETS),
      getAllItems<Liability>(STORES.LIABILITIES),
      getAllItems<Expense>(STORES.EXPENSES),
      getAllItems<DailyExpense>(STORES.DAILY_EXPENSES),
      getAllItems<Income>(STORES.INCOME),
      getAllItems<Transaction>(STORES.TRANSACTIONS)
    ]);
    
    // Update cache
    dataCache = {
      assets: assets || [],
      liabilities: liabilities || [],
      expenses: expenses || [],
      dailyExpenses: dailyExpenses || [],
      income: income || [],
      transactions: transactions || []
    };
    
    // Notify listeners that data has been updated
    emitEvent(EVENTS.DATA_UPDATED, dataCache);
  } catch (error) {
    console.error('Failed to load data:', error);
  }
}

/**
 * Get all assets
 */
export function getAssets(): Asset[] {
  return [...dataCache.assets];
}

/**
 * Get all liabilities
 */
export function getLiabilities(): Liability[] {
  return [...dataCache.liabilities];
}

/**
 * Get all expenses
 */
export function getExpenses(): Expense[] {
  return [...dataCache.expenses];
}

/**
 * Get all daily expenses
 */
export function getDailyExpenses(): DailyExpense[] {
  return [...dataCache.dailyExpenses];
}

/**
 * Get all income
 */
export function getIncome(): Income[] {
  return [...dataCache.income];
}

/**
 * Get all transactions
 */
export function getTransactions(): Transaction[] {
  return [...dataCache.transactions];
}

/**
 * Add a new asset
 */
export async function addAsset(asset: Asset): Promise<Asset> {
  try {
    // Add to IndexedDB
    const savedAsset = await addItem<Asset>(STORES.ASSETS, asset);
    
    // Update in-memory cache immediately
    dataCache.assets.push(savedAsset);
    
    // Notify listeners
    emitEvent(EVENTS.ASSET_ADDED, savedAsset);
    emitEvent(EVENTS.DATA_UPDATED, dataCache);
    
    return savedAsset;
  } catch (error) {
    console.error('Failed to add asset:', error);
    throw error;
  }
}

/**
 * Add a new liability
 */
export async function addLiability(liability: Liability): Promise<Liability> {
  try {
    // Add to IndexedDB
    const savedLiability = await addItem<Liability>(STORES.LIABILITIES, liability);
    
    // Update in-memory cache immediately
    dataCache.liabilities.push(savedLiability);
    
    // Notify listeners
    emitEvent(EVENTS.LIABILITY_ADDED, savedLiability);
    emitEvent(EVENTS.DATA_UPDATED, dataCache);
    
    return savedLiability;
  } catch (error) {
    console.error('Failed to add liability:', error);
    throw error;
  }
}

/**
 * Add a new expense
 */
export async function addExpense(expense: Expense): Promise<Expense> {
  try {
    // Add to IndexedDB
    const savedExpense = await addItem<Expense>(STORES.EXPENSES, expense);
    
    // Update in-memory cache immediately
    dataCache.expenses.push(savedExpense);
    
    // Notify listeners
    emitEvent(EVENTS.EXPENSE_ADDED, savedExpense);
    emitEvent(EVENTS.DATA_UPDATED, dataCache);
    
    return savedExpense;
  } catch (error) {
    console.error('Failed to add expense:', error);
    throw error;
  }
}

/**
 * Add a new daily expense
 */
export async function addDailyExpense(expense: DailyExpense): Promise<DailyExpense> {
  try {
    // Add to IndexedDB
    const savedExpense = await addItem<DailyExpense>(STORES.DAILY_EXPENSES, expense);
    
    // Update in-memory cache immediately
    dataCache.dailyExpenses.push(savedExpense);
    
    // Notify listeners
    emitEvent(EVENTS.DAILY_EXPENSE_ADDED, savedExpense);
    emitEvent(EVENTS.DATA_UPDATED, dataCache);
    
    return savedExpense;
  } catch (error) {
    console.error('Failed to add daily expense:', error);
    throw error;
  }
}

/**
 * Add new income
 */
export async function addIncome(income: Income): Promise<Income> {
  try {
    // Add to IndexedDB
    const savedIncome = await addItem<Income>(STORES.INCOME, income);
    
    // Update in-memory cache immediately
    dataCache.income.push(savedIncome);
    
    // Notify listeners
    emitEvent(EVENTS.INCOME_ADDED, savedIncome);
    emitEvent(EVENTS.DATA_UPDATED, dataCache);
    
    return savedIncome;
  } catch (error) {
    console.error('Failed to add income:', error);
    throw error;
  }
}

/**
 * Add a new transaction
 */
export async function addTransaction(transaction: Transaction): Promise<Transaction> {
  try {
    // Add to IndexedDB
    const savedTransaction = await addItem<Transaction>(STORES.TRANSACTIONS, transaction);
    
    // Update in-memory cache immediately
    dataCache.transactions.push(savedTransaction);
    
    // Notify listeners
    emitEvent(EVENTS.TRANSACTION_ADDED, savedTransaction);
    emitEvent(EVENTS.DATA_UPDATED, dataCache);
    
    return savedTransaction;
  } catch (error) {
    console.error('Failed to add transaction:', error);
    throw error;
  }
}

/**
 * Calculate summary financial data
 */
export function getFinancialSummary() {
  // Calculate total assets
  const totalAssets = dataCache.assets.reduce((total, asset) => {
    const value = parseFloat(asset.value.replace(/[^\d.-]/g, '')) || 0;
    return total + value;
  }, 0);
  
  // Calculate total liabilities
  const totalLiabilities = dataCache.liabilities.reduce((total, liability) => {
    const amount = parseFloat(liability.amount.replace(/[^\d.-]/g, '')) || 0;
    return total + amount;
  }, 0);
  
  // Calculate net worth
  const netWorth = totalAssets - totalLiabilities;
  
  // Calculate total income
  const totalIncome = dataCache.income.reduce((total, income) => {
    const amount = parseFloat(income.amount.replace(/[^\d.-]/g, '')) || 0;
    return total + amount;
  }, 0);
  
  // Calculate total expenses
  const totalExpenses = dataCache.expenses.reduce((total, expense) => {
    const spent = parseFloat(expense.spent.replace(/[^\d.-]/g, '')) || 0;
    return total + spent;
  }, 0);
  
  // Calculate surplus/deficit
  const cashFlow = totalIncome - totalExpenses;
  
  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    totalIncome,
    totalExpenses,
    cashFlow
  };
}

/**
 * Event system
 */

/**
 * Subscribe to an event
 */
export function subscribe(eventName: string, callback: EventCallback): () => void {
  if (!eventListeners[eventName]) {
    eventListeners[eventName] = [];
  }
  
  eventListeners[eventName].push(callback);
  
  // Return unsubscribe function
  return () => {
    eventListeners[eventName] = eventListeners[eventName].filter(cb => cb !== callback);
  };
}

/**
 * Emit an event
 */
function emitEvent(eventName: string, data: any): void {
  if (!eventListeners[eventName]) {
    return;
  }
  
  // Clone the listeners array to avoid issues with new subscribers during event iteration
  const listeners = [...eventListeners[eventName]];
  
  // Call all listeners
  listeners.forEach(callback => {
    try {
      callback(data);
    } catch (error) {
      console.error(`Error in ${eventName} event listener:`, error);
    }
  });
}