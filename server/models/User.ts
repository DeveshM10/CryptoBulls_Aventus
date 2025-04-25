import mongoose, { Document, Schema } from 'mongoose';

// Define the interface
interface IUser extends Document {
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

// Define the schema
const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  walletAddress: {
    type: String,
    trim: true
  },
  fullName: {
    type: String,
    trim: true
  },
  dob: {
    type: String
  },
  address: {
    type: String
  },
  panId: {
    type: String,
    trim: true
  },
  panImage: {
    type: String
  },
  kycVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// In a real app, we would add middleware here to hash passwords before saving
// UserSchema.pre('save', async function(next) {...})

// Create and export the model
const User = mongoose.model<IUser>('User', UserSchema);

export { IUser };
export default User;