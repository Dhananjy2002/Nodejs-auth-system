import dotenv from "dotenv";

// Load environment variables before running any checks
dotenv.config();

// Ensure the MongoDB connection string is provided, otherwise the app cannot function
if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
}

// Ensure the secret key used for signing JWTs is provided to guarantee secure tokens
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
}

if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not defined");

}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is not defined");

}
if (!process.env.GOOGLE_REFRESH_TOKEN) {
    throw new Error("GOOGLE_REFRESH_TOKEN is not defined");
}

if (!process.env.GOOGLE_USER) {
    throw new Error("GOOGLE_USER is not defined");
}



// Centralized configuration object to prevent relying directly on process.env throughout the app
const config = {
    PORT: process.env.PORT || 7511,          // The port your server will listen on
    MONGO_URI: process.env.MONGO_URI,        // Your MongoDB connection string
    DB_NAME: process.env.DB_NAME,            // The specific database name in MongoDB
    JWT_SECRET: process.env.JWT_SECRET,      // The secret cryptographic key for tokens
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_USER: process.env.GOOGLE_USER,
};

// Export destructured values for easy imports elsewhere
export const { PORT, MONGO_URI, DB_NAME, JWT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, GOOGLE_USER } = config;

// Export the whole config object as default
export default config;