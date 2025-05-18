import mongoose, { Document, Schema } from 'mongoose';

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  budgeted: string;
  spent: string;
  percentage: number;
  status: 'normal' | 'warning' | 'danger';
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  budgeted: { type: String, required: true },
  spent: { type: String, required: true },
  percentage: { type: Number, required: true },
  status: { type: String, enum: ['normal', 'warning', 'danger'], default: 'normal' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IBudget>('Budget', BudgetSchema);