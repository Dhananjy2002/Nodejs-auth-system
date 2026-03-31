import mongoose, { Schema } from "mongoose";

/**
 * Session Schema
 * Tracks active logins for users so they can securely refresh their access tokens
 * and allows for remote session revocation (e.g., forced logout).
 */
const sessionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, // Links the session to a specific User document
        ref: "User",
        required: [true, "User is required"]
    },
    refreshTokenHash: {
        type: String, // Storing a hashed version of the token prevents token theft on database leaks
        required: [true, "Refresh token hash is required"]
    },
    ip: {
        type: String, // Logs the IP address where the login originated from
        required: [true, "IP address is required"]
    },
    userAgent: {
        type: String, // Logs the browser/device info used during the login
        required: [true, "User agent is required"]
    },
    revoked: {
        // A boolean flag determining if the session has been terminated/invalidated.
        // If true, the refresh token tied to this session can no longer be used.
        type: Boolean,
        default: false 
    }

}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt' fields

const sessionModel = mongoose.model("Session", sessionSchema);

export default sessionModel;