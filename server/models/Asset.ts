import mongoose, { Document, Schema } from 'mongoose';

// Define the interface
interface IAsset extends Document {
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

// Define the schema
const AssetSchema: Schema = new Schema({
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
  value: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    trim: true
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
  }
}, {
  timestamps: true
});

// Create and export the model
const Asset = mongoose.model<IAsset>('Asset', AssetSchema);

export { IAsset };
export default Asset;