/**
 * Edge AI Constants
 * 
 * Shared constants for the edge AI system
 */

// Database store names
export const STORES = {
  ASSETS: 'assets',
  LIABILITIES: 'liabilities',
  EXPENSES: 'expenses',
  DAILY_EXPENSES: 'daily-expenses',
  INCOME: 'income',
  TRANSACTIONS: 'transactions',
  BUDGETS: 'budgets',
  SETTINGS: 'settings'
};

// Event names for pub/sub
export const EVENTS = {
  DATA_UPDATED: 'data-updated',
  ASSET_ADDED: 'asset-added',
  ASSET_UPDATED: 'asset-updated',
  LIABILITY_ADDED: 'liability-added',
  LIABILITY_UPDATED: 'liability-updated',
  EXPENSE_ADDED: 'expense-added',
  EXPENSE_UPDATED: 'expense-updated',
  DAILY_EXPENSE_ADDED: 'daily-expense-added',
  DAILY_EXPENSE_UPDATED: 'daily-expense-updated',
  INCOME_ADDED: 'income-added',
  INCOME_UPDATED: 'income-updated',
  TRANSACTION_ADDED: 'transaction-added',
  OFFLINE_STATUS_CHANGED: 'offline-status-changed'
};