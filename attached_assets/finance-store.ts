"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Asset } from "@/components/assets/add-asset-form"
import type { Liability } from "@/components/liabilities/add-liability-form"
import type { Expense } from "@/components/budget/add-expense-form"
import type { Income } from "@/components/budget/add-income-form"

interface FinanceState {
  // Assets
  assets: Asset[]
  addAsset: (asset: Asset) => void
  updateAsset: (id: string, asset: Partial<Asset>) => void
  deleteAsset: (id: string) => void

  // Liabilities
  liabilities: Liability[]
  addLiability: (liability: Liability) => void
  updateLiability: (id: string, liability: Partial<Liability>) => void
  deleteLiability: (id: string) => void

  // Budget
  expenses: Expense[]
  addExpense: (expense: Expense) => void
  updateExpense: (id: string, expense: Partial<Expense>) => void
  deleteExpense: (id: string) => void

  incomes: Income[]
  addIncome: (income: Income) => void
  updateIncome: (id: string, income: Partial<Income>) => void
  deleteIncome: (id: string) => void

  // Daily expenses
  dailyExpenses: DailyExpense[]
  addDailyExpense: (expense: DailyExpense) => void
  updateDailyExpense: (id: string, expense: Partial<DailyExpense>) => void
  deleteDailyExpense: (id: string) => void

  // Financial summary
  getTotalAssets: () => number
  getTotalLiabilities: () => number
  getNetWorth: () => number
  getTotalIncome: () => number
  getTotalExpenses: () => number
  getSurplus: () => number
  getTotalDailyExpenses: () => number

  // Blockchain logs
  transactions: any[]
  addTransaction: (transaction: any) => void
}

export interface DailyExpense {
  id: string
  title: string
  amount: string
  category: string
  date: string
  notes?: string
}

// Initial sample data
const initialAssets: Asset[] = [
  {
    id: "asset_1",
    title: "Primary Home",
    value: "₹42,50,000",
    type: "Property",
    date: "Purchased: Jan 2020",
    change: "+12.5%",
    trend: "up",
  },
  {
    id: "asset_2",
    title: "Stock Portfolio",
    value: "₹8,57,500",
    type: "Investment",
    date: "Last updated: Today",
    change: "+8.3%",
    trend: "up",
  },
  {
    id: "asset_3",
    title: "Savings Account",
    value: "₹3,24,500",
    type: "Cash",
    date: "Last updated: Today",
    change: "+1.2%",
    trend: "up",
  },
  {
    id: "asset_4",
    title: "401(k)",
    value: "₹12,83,000",
    type: "Retirement",
    date: "Last updated: Yesterday",
    change: "+15.7%",
    trend: "up",
  },
  {
    id: "asset_5",
    title: "Vehicle",
    value: "₹1,85,000",
    type: "Personal Property",
    date: "Purchased: Mar 2022",
    change: "-10.5%",
    trend: "down",
  },
]

const initialLiabilities: Liability[] = [
  {
    id: "liability_1",
    title: "Mortgage",
    amount: "₹32,00,000",
    type: "Home Loan",
    interest: "3.25%",
    payment: "₹1,25,000 / month",
    dueDate: "15th of each month",
    status: "current",
  },
  {
    id: "liability_2",
    title: "Auto Loan",
    amount: "₹1,85,000",
    type: "Vehicle Loan",
    interest: "4.5%",
    payment: "₹37,500 / month",
    dueDate: "5th of each month",
    status: "current",
  },
  {
    id: "liability_3",
    title: "Credit Card",
    amount: "₹42,500",
    type: "Revolving Credit",
    interest: "18.99%",
    payment: "₹15,000 / month",
    dueDate: "20th of each month",
    status: "warning",
  },
  {
    id: "liability_4",
    title: "Student Loan",
    amount: "₹2,28,000",
    type: "Education Loan",
    interest: "5.25%",
    payment: "₹32,500 / month",
    dueDate: "10th of each month",
    status: "current",
  },
]

const initialExpenses: Expense[] = [
  {
    id: "expense_1",
    title: "Housing",
    budgeted: "₹1,50,000",
    spent: "₹1,45,000",
    percentage: 96,
    status: "normal",
  },
  {
    id: "expense_2",
    title: "Food & Dining",
    budgeted: "₹60,000",
    spent: "₹58,000",
    percentage: 97,
    status: "warning",
  },
  {
    id: "expense_3",
    title: "Transportation",
    budgeted: "₹40,000",
    spent: "₹32,500",
    percentage: 81,
    status: "normal",
  },
  {
    id: "expense_4",
    title: "Entertainment",
    budgeted: "₹30,000",
    spent: "₹35,000",
    percentage: 117,
    status: "danger",
  },
  {
    id: "expense_5",
    title: "Utilities",
    budgeted: "₹25,000",
    spent: "₹23,500",
    percentage: 94,
    status: "normal",
  },
  {
    id: "expense_6",
    title: "Healthcare",
    budgeted: "₹20,000",
    spent: "₹15,000",
    percentage: 75,
    status: "normal",
  },
]

const initialIncomes: Income[] = [
  {
    id: "income_1",
    title: "Salary",
    amount: "₹4,80,000",
    description: "Monthly salary",
  },
  {
    id: "income_2",
    title: "Freelance",
    amount: "₹45,000",
    description: "Side projects",
  },
]

const initialDailyExpenses: DailyExpense[] = [
  {
    id: "daily_1",
    title: "Grocery Shopping",
    amount: "₹2,500",
    category: "Food & Dining",
    date: "2023-06-15",
    notes: "Weekly grocery shopping",
  },
  {
    id: "daily_2",
    title: "Electricity Bill",
    amount: "₹3,200",
    category: "Utilities",
    date: "2023-06-10",
    notes: "Monthly electricity bill",
  },
  {
    id: "daily_3",
    title: "Movie Tickets",
    amount: "₹800",
    category: "Entertainment",
    date: "2023-06-08",
    notes: "Weekend movie",
  },
  {
    id: "daily_4",
    title: "Fuel",
    amount: "₹1,500",
    category: "Transportation",
    date: "2023-06-05",
    notes: "Car refueling",
  },
]

// Helper to extract numeric value from formatted currency string
const extractNumericValue = (value: string): number => {
  // Remove ₹ and commas, then parse as float
  const numericString = value.replace(/[₹,]/g, "")
  return Number.parseFloat(numericString) || 0
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      // Assets
      assets: initialAssets,
      addAsset: (asset) => set((state) => ({ assets: [...state.assets, asset] })),
      updateAsset: (id, updatedAsset) =>
        set((state) => ({
          assets: state.assets.map((asset) => (asset.id === id ? { ...asset, ...updatedAsset } : asset)),
        })),
      deleteAsset: (id) =>
        set((state) => ({
          assets: state.assets.filter((asset) => asset.id !== id),
        })),

      // Liabilities
      liabilities: initialLiabilities,
      addLiability: (liability) => set((state) => ({ liabilities: [...state.liabilities, liability] })),
      updateLiability: (id, updatedLiability) =>
        set((state) => ({
          liabilities: state.liabilities.map((liability) =>
            liability.id === id ? { ...liability, ...updatedLiability } : liability,
          ),
        })),
      deleteLiability: (id) =>
        set((state) => ({
          liabilities: state.liabilities.filter((liability) => liability.id !== id),
        })),

      // Budget
      expenses: initialExpenses,
      addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, expense] })),
      updateExpense: (id, updatedExpense) =>
        set((state) => ({
          expenses: state.expenses.map((expense) => (expense.id === id ? { ...expense, ...updatedExpense } : expense)),
        })),
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),

      incomes: initialIncomes,
      addIncome: (income) => set((state) => ({ incomes: [...state.incomes, income] })),
      updateIncome: (id, updatedIncome) =>
        set((state) => ({
          incomes: state.incomes.map((income) => (income.id === id ? { ...income, ...updatedIncome } : income)),
        })),
      deleteIncome: (id) =>
        set((state) => ({
          incomes: state.incomes.filter((income) => income.id !== id),
        })),

      // Daily expenses
      dailyExpenses: initialDailyExpenses,
      addDailyExpense: (expense) =>
        set((state) => ({
          dailyExpenses: [expense, ...state.dailyExpenses],
        })),
      updateDailyExpense: (id, updatedExpense) =>
        set((state) => ({
          dailyExpenses: state.dailyExpenses.map((expense) =>
            expense.id === id ? { ...expense, ...updatedExpense } : expense,
          ),
        })),
      deleteDailyExpense: (id) =>
        set((state) => ({
          dailyExpenses: state.dailyExpenses.filter((expense) => expense.id !== id),
        })),

      // Financial summary calculations
      getTotalAssets: () => {
        return get().assets.reduce((total, asset) => total + extractNumericValue(asset.value), 0)
      },

      getTotalLiabilities: () => {
        return get().liabilities.reduce((total, liability) => total + extractNumericValue(liability.amount), 0)
      },

      getNetWorth: () => {
        return get().getTotalAssets() - get().getTotalLiabilities()
      },

      getTotalIncome: () => {
        return get().incomes.reduce((total, income) => total + extractNumericValue(income.amount), 0)
      },

      getTotalExpenses: () => {
        return get().expenses.reduce((total, expense) => total + extractNumericValue(expense.spent), 0)
      },

      getSurplus: () => {
        return get().getTotalIncome() - get().getTotalExpenses()
      },

      getTotalDailyExpenses: () => {
        return get().dailyExpenses.reduce((total, expense) => total + extractNumericValue(expense.amount), 0)
      },

      // Blockchain
      transactions: [],
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),
    }),
    {
      name: "finance-storage", // unique name for localStorage
    },
  ),
)
