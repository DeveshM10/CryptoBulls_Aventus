import mongoose from 'mongoose';
import connectDBWithClient from "../db";

// Database connection check
const connectDB = async () => {
  try {
    // Simply use the connection from db/index.ts
    const conn = await connectDBWithClient();
    
    // Add a delay to ensure the connection is fully established
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Database connection confirmed');
    return conn;
  } catch (error) {
    console.error(`Error connecting to database: ${error}`);
    process.exit(1);
  }
};

export default connectDB;