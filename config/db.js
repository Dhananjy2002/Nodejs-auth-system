import mongoose from "mongoose";
import { DB_NAME, MONGO_URI } from "./config.js";

/**
 * Connects the application to the MongoDB database using Mongoose.
 * This is an asynchronous operation.
 */
async function connectDB() {
    try {
        // Attempt to connect to MongoDB using the URI and Database Name provided in config
        const connectionInstance = await mongoose.connect(`${MONGO_URI}/${DB_NAME}`);

        // Log successful connection details for debugging
        console.log(`MongoDB Connected! Host: ${connectionInstance.connection.host}`);
        console.log(`Database Name: ${connectionInstance.connection.name}`);

    } catch (error) {
        // If the connection fails, log what happened
        console.error("MongoDB connection error:", error.message);
        
        // Terminate the Node.js process with a failure status (1) since the app cannot run without a DB
        process.exit(1); 
    }
}

export default connectDB;