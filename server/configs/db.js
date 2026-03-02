import mongoose from "mongoose"

// Cache the database connection
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async() => {
    try {
        // If connection exists, return it
        if (cached.conn) {
            return cached.conn;
        }

        // If a connection is in progress, wait for it
        if (!cached.promise) {
            const opts = {
                bufferCommands: false,
                serverSelectionTimeoutMS: 5000,
                maxPoolSize: 10
            };

            cached.promise = mongoose.connect(process.env.MONGODB_URI, opts);
        }
        
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        console.error(`Database connection failed: ${error.message}`);
        throw new Error(`Database connection failed: ${error.message}`);
    }
};

export default connectDB;