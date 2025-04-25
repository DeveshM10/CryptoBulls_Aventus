import mongoose, { Document, Schema } from 'mongoose';

// Define the interface
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

// Define the schema
const LiabilitySchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  interest: {
    type: String,
    required: true
  },
  payment: {
    type: String,
    required: true
  },
  dueDate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['current', 'warning', 'late'],
    default: 'current',
    required: true
  }
}, {
  timestamps: true
});

// Create and export the model
const Liability = mongoose.model<ILiability>('Liability', LiabilitySchema);

export { ILiability };
export default Liability;