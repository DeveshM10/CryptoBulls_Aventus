/**
 * Finance-related type definitions
 */

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

export interface FinanceQueryResult {
  intent: string;
  confidence: number;
  entities: {
    [key: string]: any;
  };
  response: string;
}