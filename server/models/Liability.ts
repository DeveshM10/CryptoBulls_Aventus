import mongoose, { Document, Schema } from 'mongoose';

interface ILiability extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  amount: string;
  type: string;
  interest: string;
  payment: string;
  dueDate: string;
  status: 'current' | 'warning' | 'late';
  createdAt: Date;
  updatedAt: Date;
}

const LiabilitySchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: String, required: true },
  type: { type: String, required: true },
  interest: { type: String, required: true },
  payment: { type: String, required: true },
  dueDate: { type: String, required: true },
  status: { type: String, enum: ['current', 'warning', 'late'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<ILiability>('Liability', LiabilitySchema);