import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "dev"; 

export async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    console.log("✅ Already connected to MongoDB.");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 60000, // Increased timeout to 60s
      socketTimeoutMS: 60000, // Increased timeout
      // directConnection: true, // Bypass SRV lookup if necessary
    });

    console.log(`Connected to MongoDB database: ${DB_NAME}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.error("Stack Trace:", error.stack);
  }
}
