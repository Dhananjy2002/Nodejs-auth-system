import mongoose from "mongoose";

/**
 * OTP Schema
 * Strictly dictates the physical mapping structure exclusively for handling temporary email verifications seamlessly.
 */
const otpSchema = new mongoose.Schema({
    email: {
        type: String, // Explicitly target mathematical email structurally natively.
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // Explicitly universally binds abstract mapping natively directly to the core user locally.
        ref: "User",
        required: true
    },
    otpHash: {
        type: String, // Security measure natively: Abstract OTP codes are mathematically bcrypt hashed actively so they remain mathematically useless if db is breached statically.
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now,
        expires: 1800 // Automatically seamlessly destructs standard Mongoose model inherently completely after precisely exactly 30 minutes (1800 seconds) physically!
    }
}, { timestamps: true })


export const Otp = mongoose.model("Otp", otpSchema);