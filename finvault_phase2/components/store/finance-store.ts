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

  // Liabilities
  liabilities: Liability[]
  addLiability: (liability: Liability) => void

  // Budget
  expenses: Expense[]
  addExpense: (expense: Expense) => void

  incomes: Income[]
  addIncome: (income: Income) => void

  // Financial summary
  getTotalAssets: () => number
  getTotalLiabilities: () => number
  getNetWorth: () => number
  getTotalIncome: () => number
  getTotalExpenses: () => number
  getSurplus: () => number

  // Blockchain logs
  transactions: any[]
  addTransaction: (transaction: any) => void
}

// Initial sample data
const initialAssets: Asset[] = [
  {
    id: "asset_1",
    title: "Primary Home",
    value: "$425,000",
    type: "Property",
    date: "Purchased: Jan 2020",
    change: "+12.5%",
    trend: "up",
  },
  {
    id: "asset_2",
    title: "Stock Portfolio",
    value: "$85,750",
    type: "Investment",
    date: "Last updated: Today",
    change: "+8.3%",
    trend: "up",
  },
  {
    id: "asset_3",
    title: "Savings Account",
    value: "$32,450",
    type: "Cash",
    date: "Last updated: Today",
    change: "+1.2%",
    trend: "up",
  },
  {
    id: "asset_4",
    title: "401(k)",
    value: "$128,300",
    type: "Retirement",
    date: "Last updated: Yesterday",
    change: "+15.7%",
    trend: "up",
  },
  {
    id: "asset_5",
    title: "Vehicle",
    value: "$18,500",
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
    amount: "$320,000",
    type: "Home Loan",
    interest: "3.25%",
    payment: "$1,250 / month",
    dueDate: "15th of each month",
    status: "current",
  },
  {
    id: "liability_2",
    title: "Auto Loan",
    amount: "$18,500",
    type: "Vehicle Loan",
    interest: "4.5%",
    payment: "$375 / month",
    dueDate: "5th of each month",
    status: "current",
  },
  {
    id: "liability_3",
    title: "Credit Card",
    amount: "$4,250",
    type: "Revolving Credit",
    interest: "18.99%",
    payment: "$150 / month",
    dueDate: "20th of each month",
    status: "warning",
  },
  {
    id: "liability_4",
    title: "Student Loan",
    amount: "$22,800",
    type: "Education Loan",
    interest: "5.25%",
    payment: "$325 / month",
    dueDate: "10th of each month",
    status: "current",
  },
]

const initialExpenses: Expense[] = [
  {
    id: "expense_1",
    title: "Housing",
    budgeted: "$1,500.00",
    spent: "$1,450.00",
    percentage: 96,
    status: "normal",
  },
  {
    id: "expense_2",
    title: "Food & Dining",
    budgeted: "$600.00",
    spent: "$580.00",
    percentage: 97,
    status: "warning",
  },
  {
    id: "expense_3",
    title: "Transportation",
    budgeted: "$400.00",
    spent: "$325.00",
    percentage: 81,
    status: "normal",
  },
  {
    id: "expense_4",
    title: "Entertainment",
    budgeted: "$300.00",
    spent: "$350.00",
    percentage: 117,
    status: "danger",
  },
  {
    id: "expense_5",
    title: "Utilities",
    budgeted: "$250.00",
    spent: "$235.00",
    percentage: 94,
    status: "normal",
  },
  {
    id: "expense_6",
    title: "Healthcare",
    budgeted: "$200.00",
    spent: "$150.00",
    percentage: 75,
    status: "normal",
  },
]

const initialIncomes: Income[] = [
  {
    id: "income_1",
    title: "Salary",
    amount: "$4,800.00",
    description: "Monthly salary",
  },
  {
    id: "income_2",
    title: "Freelance",
    amount: "$450.00",
    description: "Side projects",
  },
]

// Helper to extract numeric value from formatted currency string
const extractNumericValue = (value: string): number => {
  // Remove $ and commas, then parse as float
  const numericString = value.replace(/[$,]/g, "")
  return Number.parseFloat(numericString) || 0
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      // Assets
      assets: initialAssets,
      addAsset: (asset) => set((state) => ({ assets: [...state.assets, asset] })),

      // Liabilities
      liabilities: initialLiabilities,
      addLiability: (liability) => set((state) => ({ liabilities: [...state.liabilities, liability] })),

      // Budget
      expenses: initialExpenses,
      addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, expense] })),

      incomes: initialIncomes,
      addIncome: (income) => set((state) => ({ incomes: [...state.incomes, income] })),

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
