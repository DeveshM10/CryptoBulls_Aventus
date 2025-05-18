export interface DailyExpense {
  id: string;
  title: string;
  amount: string;
  category: string;
  date: string;
  notes?: string;
}