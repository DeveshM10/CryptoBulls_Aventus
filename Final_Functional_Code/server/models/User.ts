import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  walletAddress?: string;
  fullName?: string;
  dob?: string;
  address?: string;
  panId?: string;
  panImage?: string;
  kycVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  walletAddress: { type: String },
  fullName: { type: String },
  dob: { type: String },
  address: { type: String },
  panId: { type: String },
  panImage: { type: String },
  kycVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);