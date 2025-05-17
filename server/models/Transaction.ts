import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  description: string;
  category: string;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
  };
  deviceId: string;
  merchantName: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed' | 'flagged';
  fraudScore: number; // Score between 0-100, higher means more likely fraudulent
  flaggedBy: 'system' | 'user' | null;
  fraudFeatures: {
    amountDeviation: number;     // Unusual amount compared to user's history
    locationAnomaly: number;     // How unusual the location is
    timeAnomaly: number;         // Unusual time of day/week for this user
    merchantAnomaly: number;     // How unusual this merchant is for the user
    frequencyAnomaly: number;    // Unusual frequency of transactions
  };
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  location: {
    latitude: Number,
    longitude: Number,
  },
  deviceId: {
    type: String,
    required: true,
  },
  merchantName: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed', 'flagged'],
    default: 'pending',
  },
  fraudScore: {
    type: Number,
    default: 0,
  },
  flaggedBy: {
    type: String,
    enum: ['system', 'user', null],
    default: null,
  },
  fraudFeatures: {
    amountDeviation: { type: Number, default: 0 },
    locationAnomaly: { type: Number, default: 0 },
    timeAnomaly: { type: Number, default: 0 },
    merchantAnomaly: { type: Number, default: 0 },
    frequencyAnomaly: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);