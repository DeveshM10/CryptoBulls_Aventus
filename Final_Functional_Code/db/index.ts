import mongoose from 'mongoose';
import 'dotenv/config';

// MongoDB connection URL provided by user
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://adrianronan7305:adrian7305@cluster2.0gmv9tc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connection successful');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => console.log('MongoDB connected'));
mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));

// Handle process termination (graceful shutdown)
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

export const db = mongoose.connection;
export default connectDB;