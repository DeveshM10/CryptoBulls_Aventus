/**
 * Finance data store 
 * 
 * A central store for finance data with offline capabilities
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Asset, DailyExpense, Expense, Income, Liability, Transaction } from '../../types/finance';

interface FinanceState {
  // Assets
  assets: Asset[];
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, asset: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;

  // Liabilities
  liabilities: Liability[];
  addLiability: (liability: Liability) => void;
  updateLiability: (id: string, liability: Partial<Liability>) => void;
  deleteLiability: (id: string) => void;

  // Budget
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  incomes: Income[];
  addIncome: (income: Income) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
  deleteIncome: (id: string) => void;

  // Daily expenses
  dailyExpenses: DailyExpense[];
  addDailyExpense: (expense: DailyExpense) => void;
  updateDailyExpense: (id: string, expense: Partial<DailyExpense>) => void;
  deleteDailyExpense: (id: string) => void;

  // Blockchain transactions
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;

  // Financial summary calculations
  getTotalAssets: () => number;
  getTotalLiabilities: () => number;
  getNetWorth: () => number;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getSurplus: () => number;
  getTotalDailyExpenses: () => number;
  
  // Offline sync
  pendingSync: boolean;
  setPendingSync: (pending: boolean) => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      // Assets
      assets: [],
      addAsset: (asset) => set((state) => ({ 
        assets: [...state.assets, asset],
        pendingSync: true
      })),
      updateAsset: (id, asset) => set((state) => ({
        assets: state.assets.map((a) => (a.id === id ? { ...a, ...asset } : a)),
        pendingSync: true
      })),
      deleteAsset: (id) => set((state) => ({
        assets: state.assets.filter((a) => a.id !== id),
        pendingSync: true
      })),

      // Liabilities
      liabilities: [],
      addLiability: (liability) => set((state) => ({ 
        liabilities: [...state.liabilities, liability],
        pendingSync: true
      })),
      updateLiability: (id, liability) => set((state) => ({
        liabilities: state.liabilities.map((l) => (l.id === id ? { ...l, ...liability } : l)),
        pendingSync: true
      })),
      deleteLiability: (id) => set((state) => ({
        liabilities: state.liabilities.filter((l) => l.id !== id),
        pendingSync: true
      })),

      // Budget
      expenses: [],
      addExpense: (expense) => set((state) => ({ 
        expenses: [...state.expenses, expense],
        pendingSync: true
      })),
      updateExpense: (id, expense) => set((state) => ({
        expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...expense } : e)),
        pendingSync: true
      })),
      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
        pendingSync: true
      })),

      // Income
      incomes: [],
      addIncome: (income) => set((state) => ({ 
        incomes: [...state.incomes, income],
        pendingSync: true
      })),
      updateIncome: (id, income) => set((state) => ({
        incomes: state.incomes.map((i) => (i.id === id ? { ...i, ...income } : i)),
        pendingSync: true
      })),
      deleteIncome: (id) => set((state) => ({
        incomes: state.incomes.filter((i) => i.id !== id),
        pendingSync: true
      })),

      // Daily expenses
      dailyExpenses: [],
      addDailyExpense: (expense) => set((state) => ({ 
        dailyExpenses: [...state.dailyExpenses, expense],
        pendingSync: true
      })),
      updateDailyExpense: (id, expense) => set((state) => ({
        dailyExpenses: state.dailyExpenses.map((e) => (e.id === id ? { ...e, ...expense } : e)),
        pendingSync: true
      })),
      deleteDailyExpense: (id) => set((state) => ({
        dailyExpenses: state.dailyExpenses.filter((e) => e.id !== id),
        pendingSync: true
      })),

      // Transactions
      transactions: [],
      addTransaction: (transaction) => set((state) => ({ 
        transactions: [...state.transactions, transaction],
        pendingSync: true
      })),

      // Financial calculations
      getTotalAssets: () => {
        return get().assets.reduce((total, asset) => {
          const value = parseFloat(asset.value.replace(/[^\d.-]/g, ''));
          return total + (isNaN(value) ? 0 : value);
        }, 0);
      },
      
      getTotalLiabilities: () => {
        return get().liabilities.reduce((total, liability) => {
          const amount = parseFloat(liability.amount.replace(/[^\d.-]/g, ''));
          return total + (isNaN(amount) ? 0 : amount);
        }, 0);
      },
      
      getNetWorth: () => {
        return get().getTotalAssets() - get().getTotalLiabilities();
      },
      
      getTotalIncome: () => {
        return get().incomes.reduce((total, income) => {
          const amount = parseFloat(income.amount.replace(/[^\d.-]/g, ''));
          return total + (isNaN(amount) ? 0 : amount);
        }, 0);
      },
      
      getTotalExpenses: () => {
        return get().expenses.reduce((total, expense) => {
          const spent = parseFloat(expense.spent.replace(/[^\d.-]/g, ''));
          return total + (isNaN(spent) ? 0 : spent);
        }, 0);
      },
      
      getSurplus: () => {
        return get().getTotalIncome() - get().getTotalExpenses();
      },
      
      getTotalDailyExpenses: () => {
        return get().dailyExpenses.reduce((total, expense) => {
          const amount = parseFloat(expense.amount.replace(/[^\d.-]/g, ''));
          return total + (isNaN(amount) ? 0 : amount);
        }, 0);
      },
      
      // Offline sync status
      pendingSync: false,
      setPendingSync: (pending) => set({ pendingSync: pending }),
    }),
    {
      name: 'finance-store',
    }
  )
);