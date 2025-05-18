import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface Asset {
  id: string;
  title: string;
  value: string;
  type: string;
  date: string;
  change: string;
  trend: 'up' | 'down';
}

export interface Liability {
  id: string;
  title: string;
  amount: string;
  type: string;
  interest: string;
  payment: string;
  dueDate: string;
  status: 'current' | 'warning' | 'late';
}

export interface Expense {
  id: string;
  title: string;
  budgeted: string;
  spent: string;
  percentage: number;
  status: 'normal' | 'warning' | 'danger';
}

export interface Income {
  id: string;
  title: string;
  amount: string;
  description: string;
}

export interface DailyExpense {
  id: string;
  title: string;
  amount: string;
  category: string;
  date: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: string;
  type: string;
  timestamp: string;
  status: 'verified' | 'pending' | 'rejected';
  confirmations: number;
}

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

  // Income
  incomes: Income[];
  addIncome: (income: Income) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
  deleteIncome: (id: string) => void;

  // Daily expenses
  dailyExpenses: DailyExpense[];
  addDailyExpense: (expense: DailyExpense) => void;
  updateDailyExpense: (id: string, expense: Partial<DailyExpense>) => void;
  deleteDailyExpense: (id: string) => void;

  // Blockchain logs
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;

  // Financial summary
  getTotalAssets: () => number;
  getTotalLiabilities: () => number;
  getNetWorth: () => number;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getSurplus: () => number;
  getTotalDailyExpenses: () => number;
}

// Sample data
const sampleAssets: Asset[] = [
  {
    id: uuidv4(),
    title: 'Cash Reserve',
    value: '15000',
    type: 'Cash',
    date: '2025-04-20',
    change: '1200',
    trend: 'up'
  },
  {
    id: uuidv4(),
    title: 'Stock Portfolio',
    value: '42000',
    type: 'Stocks',
    date: '2025-04-22',
    change: '3200',
    trend: 'up'
  },
  {
    id: uuidv4(),
    title: 'Retirement Account',
    value: '78000',
    type: 'Retirement',
    date: '2025-04-15',
    change: '5000',
    trend: 'up'
  },
  {
    id: uuidv4(),
    title: 'Real Estate Property',
    value: '350000',
    type: 'Real Estate',
    date: '2025-01-10',
    change: '12000',
    trend: 'up'
  }
];

const sampleLiabilities: Liability[] = [
  {
    id: uuidv4(),
    title: 'Mortgage',
    amount: '245000',
    type: 'Secured',
    interest: '4.5',
    payment: '1850',
    dueDate: '2025-05-10',
    status: 'current'
  },
  {
    id: uuidv4(),
    title: 'Car Loan',
    amount: '18500',
    type: 'Secured',
    interest: '3.9',
    payment: '450',
    dueDate: '2025-05-15',
    status: 'current'
  },
  {
    id: uuidv4(),
    title: 'Credit Card',
    amount: '3200',
    type: 'Unsecured',
    interest: '18.99',
    payment: '200',
    dueDate: '2025-05-05',
    status: 'warning'
  }
];

const sampleExpenses: Expense[] = [
  {
    id: uuidv4(),
    title: 'Housing',
    budgeted: '2000',
    spent: '1950',
    percentage: 97,
    status: 'normal'
  },
  {
    id: uuidv4(),
    title: 'Food',
    budgeted: '600',
    spent: '630',
    percentage: 105,
    status: 'warning'
  },
  {
    id: uuidv4(),
    title: 'Transportation',
    budgeted: '400',
    spent: '380',
    percentage: 95,
    status: 'normal'
  },
  {
    id: uuidv4(),
    title: 'Entertainment',
    budgeted: '300',
    spent: '350',
    percentage: 116,
    status: 'danger'
  },
  {
    id: uuidv4(),
    title: 'Utilities',
    budgeted: '250',
    spent: '235',
    percentage: 94,
    status: 'normal'
  }
];

const sampleIncomes: Income[] = [
  {
    id: uuidv4(),
    title: 'Salary',
    amount: '5500',
    description: 'Monthly net salary'
  },
  {
    id: uuidv4(),
    title: 'Freelance Work',
    amount: '1200',
    description: 'Web development projects'
  },
  {
    id: uuidv4(),
    title: 'Dividends',
    amount: '320',
    description: 'Quarterly stock dividends'
  }
];

const sampleDailyExpenses: DailyExpense[] = [
  {
    id: uuidv4(),
    title: 'Grocery Shopping',
    amount: '125.50',
    category: 'Groceries',
    date: '2025-05-12',
    notes: 'Weekly groceries at Whole Foods'
  },
  {
    id: uuidv4(),
    title: 'Dinner with friends',
    amount: '78.25',
    category: 'Dining',
    date: '2025-05-13',
    notes: 'Italian restaurant'
  },
  {
    id: uuidv4(),
    title: 'Gas',
    amount: '45.00',
    category: 'Transportation',
    date: '2025-05-14'
  },
  {
    id: uuidv4(),
    title: 'Netflix Subscription',
    amount: '15.99',
    category: 'Entertainment',
    date: '2025-05-10'
  },
  {
    id: uuidv4(),
    title: 'Coffee shop',
    amount: '5.75',
    category: 'Dining',
    date: '2025-05-15'
  },
  {
    id: uuidv4(),
    title: 'Pharmacy',
    amount: '28.50',
    category: 'Health',
    date: '2025-05-11'
  },
  {
    id: uuidv4(),
    title: 'Online shopping',
    amount: '67.30',
    category: 'Shopping',
    date: '2025-05-09'
  },
  {
    id: uuidv4(),
    title: 'Electric bill',
    amount: '95.40',
    category: 'Utilities',
    date: '2025-05-08'
  }
];

const sampleTransactions: Transaction[] = [
  {
    id: uuidv4(),
    hash: '0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    from: '0xYourWallet',
    to: '0xMerchant1',
    amount: '0.05',
    type: 'payment',
    timestamp: '2025-05-15T10:23:45',
    status: 'verified',
    confirmations: 12
  },
  {
    id: uuidv4(),
    hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    from: '0xExchange',
    to: '0xYourWallet',
    amount: '1.25',
    type: 'deposit',
    timestamp: '2025-05-14T08:12:30',
    status: 'verified',
    confirmations: 35
  },
  {
    id: uuidv4(),
    hash: '0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
    from: '0xYourWallet',
    to: '0xMerchant2',
    amount: '0.12',
    type: 'payment',
    timestamp: '2025-05-13T16:45:12',
    status: 'verified',
    confirmations: 56
  },
  {
    id: uuidv4(),
    hash: '0x2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d',
    from: '0xYourWallet',
    to: '0xContract',
    amount: '0.08',
    type: 'contract',
    timestamp: '2025-05-15T14:30:00',
    status: 'pending',
    confirmations: 2
  }
];

export const useFinanceStore = create<FinanceState>()((set, get) => ({
  // Assets
  assets: sampleAssets,
  addAsset: (asset) => set((state) => ({ assets: [...state.assets, asset] })),
  updateAsset: (id, asset) => set((state) => ({
    assets: state.assets.map((a) => a.id === id ? { ...a, ...asset } : a)
  })),
  deleteAsset: (id) => set((state) => ({
    assets: state.assets.filter((a) => a.id !== id)
  })),

  // Liabilities
  liabilities: sampleLiabilities,
  addLiability: (liability) => set((state) => ({ liabilities: [...state.liabilities, liability] })),
  updateLiability: (id, liability) => set((state) => ({
    liabilities: state.liabilities.map((l) => l.id === id ? { ...l, ...liability } : l)
  })),
  deleteLiability: (id) => set((state) => ({
    liabilities: state.liabilities.filter((l) => l.id !== id)
  })),

  // Budget
  expenses: sampleExpenses,
  addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, expense] })),
  updateExpense: (id, expense) => set((state) => ({
    expenses: state.expenses.map((e) => e.id === id ? { ...e, ...expense } : e)
  })),
  deleteExpense: (id) => set((state) => ({
    expenses: state.expenses.filter((e) => e.id !== id)
  })),

  // Income
  incomes: sampleIncomes,
  addIncome: (income) => set((state) => ({ incomes: [...state.incomes, income] })),
  updateIncome: (id, income) => set((state) => ({
    incomes: state.incomes.map((i) => i.id === id ? { ...i, ...income } : i)
  })),
  deleteIncome: (id) => set((state) => ({
    incomes: state.incomes.filter((i) => i.id !== id)
  })),

  // Daily expenses
  dailyExpenses: sampleDailyExpenses,
  addDailyExpense: (expense) => set((state) => ({ dailyExpenses: [...state.dailyExpenses, expense] })),
  updateDailyExpense: (id, expense) => set((state) => ({
    dailyExpenses: state.dailyExpenses.map((e) => e.id === id ? { ...e, ...expense } : e)
  })),
  deleteDailyExpense: (id) => set((state) => ({
    dailyExpenses: state.dailyExpenses.filter((e) => e.id !== id)
  })),

  // Blockchain logs
  transactions: sampleTransactions,
  addTransaction: (transaction) => set((state) => ({ transactions: [...state.transactions, transaction] })),

  // Financial summary calculations
  getTotalAssets: () => {
    return get().assets.reduce((sum, asset) => sum + parseFloat(asset.value), 0);
  },
  getTotalLiabilities: () => {
    return get().liabilities.reduce((sum, liability) => sum + parseFloat(liability.amount), 0);
  },
  getNetWorth: () => {
    return get().getTotalAssets() - get().getTotalLiabilities();
  },
  getTotalIncome: () => {
    return get().incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
  },
  getTotalExpenses: () => {
    return get().expenses.reduce((sum, expense) => sum + parseFloat(expense.spent), 0);
  },
  getSurplus: () => {
    return get().getTotalIncome() - get().getTotalExpenses();
  },
  getTotalDailyExpenses: () => {
    return get().dailyExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  }
}));