// ONLINE MONGO CONNECTION
// import mongoose from 'mongoose';
// import 'dotenv/config';

// // MongoDB connection URL provided by user
// const mongoURI = process.env.MONGODB_URI || "mongodb+srv://adrianronan7305:adrian7305@cluster2.0gmv9tc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2";

// // Connect to MongoDB
// const connectDB = async () => {
//   try {
//     await mongoose.connect(mongoURI);
//     console.log('MongoDB connection successful');
//     return mongoose.connection;
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1);
//   }
// };

// // Handle connection events
// mongoose.connection.on('connected', () => console.log('MongoDB connected'));
// mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));
// mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));

// // Handle process termination (graceful shutdown)
// process.on('SIGINT', async () => {
//   await mongoose.connection.close();
//   console.log('MongoDB connection closed due to app termination');
//   process.exit(0);
// });

// export const db = mongoose.connection;
// export default connectDB;



// OFFLINE MONGO CONNECTION
import mongoose from 'mongoose';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name using fileURLToPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine the local MongoDB data directory
const localMongoDataDir = path.resolve(__dirname, 'local-mongo-data'); // Adjust 'local-mongo-data' as needed

// Construct the MongoDB connection URL for a local instance
// Assuming default MongoDB port (27017) and a database name (e.g., 'mydatabase')
const localMongoURI = `mongodb://127.0.0.1:27017/test`;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(localMongoURI);
    console.log('Connected to local MongoDB successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('Local MongoDB connection error:', error);
    console.error('Ensure that your local MongoDB server is running and accessible at', localMongoURI);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => console.log('Local MongoDB connected'));
mongoose.connection.on('error', (err) => console.error('Local MongoDB error:', err));
mongoose.connection.on('disconnected', () => console.log('Local MongoDB disconnected'));

// Handle process termination (graceful shutdown)
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Local MongoDB connection closed due to app termination');
  process.exit(0);
});

export const db = mongoose.connection;
export default connectDB;
