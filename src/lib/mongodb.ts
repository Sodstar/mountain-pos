import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) {
    return cached.conn; 
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "pointofsale"
    })
      .then((mongooseInstance) => {
        cached.conn = mongooseInstance;
        return cached.conn;
      })
      .catch((error) => {
        throw new Error(`MongoDB Connection Error: ${error.message}`); 
      });
  }

  try {
    return await cached.promise;
  } catch (error) {
    throw new Error(`Error establishing MongoDB connection: ${error}`);
  }
}