import mongoose, { Document, Schema } from 'mongoose';

export interface IDailyExpense extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  amount: string;
  category: string;
  date: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DailyExpenseSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IDailyExpense>('DailyExpense', DailyExpenseSchema);