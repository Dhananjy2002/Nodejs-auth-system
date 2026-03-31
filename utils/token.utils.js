import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

/**
 * Generates a short-lived Access Token.
 * This token is sent with API requests to prove authentication.
 * 
 * @param {String} userId - The unique ID of the user
 * @param {String} sessionId - The corresponding Session ID tracking this login
 * @returns {String} Encoded JWT access token
 */
export const generateAccessToken = (userId, sessionId) => {
    return jwt.sign(
        { _id: userId, sessionId }, // The visible payload payload inside the token
        JWT_SECRET,                 // The secret key used to mathematically sign the token
        { expiresIn: "15m" }        // Token lifespan: 15 minutes before expiring
    );
};

/**
 * Generates a long-lived Refresh Token.
 * This token is securely sent to the user's browser via HTTP-only cookies 
 * and is ONLY used to securely request a fresh Access token when the old one expires.
 * 
 * @param {String} userId - The unique ID of the user
 * @returns {String} Encoded JWT refresh token
 */
export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { _id: userId },            // Payload 
        JWT_SECRET,                 // The exact same cryptographic secret logic applied to the token
        { expiresIn: "15d" }        // Token lifespan: 15 days before fully demanding a password login again
    );
};
