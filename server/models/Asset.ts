import mongoose, { Schema, Document } from 'mongoose';

export interface IAsset extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  value: string;
  type: string;
  date: string;
  change: string;
  trend: 'up' | 'down';
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema = new Schema<IAsset>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  change: {
    type: String,
    required: true
  },
  trend: {
    type: String,
    enum: ['up', 'down'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IAsset>('Asset', AssetSchema);