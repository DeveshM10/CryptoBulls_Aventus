import { db } from "@db";

// Database connection check
const connectDB = async () => {
  try {
    // Test the database connection with a simple query
    await db.execute('SELECT 1');
    console.log('PostgreSQL connection successful');
    
    // Handle process termination (graceful shutdown)
    process.on('SIGINT', async () => {
      console.log('Database connection closed due to app termination');
      process.exit(0);
    });
    
    return db;
  } catch (error) {
    console.error(`Error connecting to database: ${error}`);
    process.exit(1);
  }
};

export default connectDB;