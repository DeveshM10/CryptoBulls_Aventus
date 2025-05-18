import { create } from "zustand";

interface FinanceState {
  // Financial data
  assets: number;
  liabilities: number;
  income: number;
  expenses: number;
  
  // Getter functions
  getTotalAssets: () => number;
  getTotalLiabilities: () => number;
  getNetWorth: () => number;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getSurplus: () => number;
  
  // Actions
  updateAssets: (value: number) => void;
  updateLiabilities: (value: number) => void;
  updateIncome: (value: number) => void;
  updateExpenses: (value: number) => void;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  // Initial state
  assets: 690000,
  liabilities: 245000,
  income: 75000,
  expenses: 45000,
  
  // Getter functions
  getTotalAssets: () => get().assets,
  getTotalLiabilities: () => get().liabilities,
  getNetWorth: () => get().assets - get().liabilities,
  getTotalIncome: () => get().income,
  getTotalExpenses: () => get().expenses,
  getSurplus: () => get().income - get().expenses,
  
  // Actions
  updateAssets: (value) => set({ assets: value }),
  updateLiabilities: (value) => set({ liabilities: value }),
  updateIncome: (value) => set({ income: value }),
  updateExpenses: (value) => set({ expenses: value }),
}));
