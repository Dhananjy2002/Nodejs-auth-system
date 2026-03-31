import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

// Imports for dynamic Swagger Documentation UI 
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

// Initialize the Express application
const app = express();

// ==========================================
// Global Middlewares
// ==========================================

// Parse incoming JSON requests and put the parsed data in req.body
app.use(express.json());

// Parse incoming URL-encoded data (e.g., from HTML forms)
app.use(express.urlencoded({ extended: true }));

// Log HTTP requests to the console for easier debugging (using the 'dev' format)
app.use(morgan('dev'));

// Parse incoming HTTP cookies attached to requests and populate req.cookies
app.use(cookieParser());

// ==========================================
// Route Mounts
// ==========================================

// Mount the authentication router at the /api/v1/auth base path
app.use("/api/v1/auth", authRouter);

// Mount the graphical Swagger API Documentation specifically to /api-docs dynamically
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Export the configured app for use in server.js
export default app;