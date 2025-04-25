import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Use environment variable or fallback to localhost for development
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/finvault';
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;