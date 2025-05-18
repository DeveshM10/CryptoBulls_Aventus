export interface Asset {
  _id: string;
  userId: string;
  title: string;
  value: string;
  type: string;
  date: string;
  change: string;
  trend: 'up' | 'down';
  createdAt: string;
  updatedAt: string;
}