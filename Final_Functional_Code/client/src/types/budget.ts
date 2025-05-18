export interface Budget {
  _id: string;
  userId: string;
  title: string;
  budgeted: string;
  spent: string;
  percentage: number;
  status: 'normal' | 'warning' | 'danger';
  createdAt: string;
  updatedAt: string;
}