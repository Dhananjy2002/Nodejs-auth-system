import dotenv from "dotenv";
import app from "./app.js";
import { PORT } from "./config/config.js";
import connectDB from "./config/db.js";

// Load environment variables from the .env file into process.env
dotenv.config({
    path: './.env'
})

// Establish connection to the MongoDB database first
connectDB()
    .then(() => {
        // Once successfully connected to the DB, start the Express server
        app.listen(PORT || 7511, () => {
            console.log(`⚙️ Server is running at port : ${PORT} and url is http://localhost:${PORT}`);
        })
    })
    .catch((err) => {
        // If the database connection fails, log the error (app will not start listening)
        console.log("MONGO db connection failed !!! ", err);
    })