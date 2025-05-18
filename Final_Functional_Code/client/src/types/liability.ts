export interface Liability {
  _id: string;
  userId: string;
  title: string;
  amount: string;
  type: string;
  interest: string;
  payment: string;
  dueDate: string;
  status: 'current' | 'warning' | 'late';
  createdAt: string;
  updatedAt: string;
}