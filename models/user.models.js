import mongoose from "mongoose";
import bcrypt from "bcrypt";

/**
 * User Schema
 * Defines the core fields fundamentally needed to identify or authenticate a user.
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true, // Speeds up queries searching by username
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no two parallel users can share the same login email
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"],
        maxlength: [200, "Password must not exceed 50 characters"],
    },
    verified: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true }); // Automatically maintains 'createdAt' and 'updatedAt' fields

/**
 * Pre-Save Hook (Middleware)
 * Right before Mongoose natively attempts to save any document to the Database, this runs.
 * If the user has explicitly changed or generated a password, we securely salt and hash it,
 * meaning plain-text passwords NEVER reach the database intact.
 */
// NOTE: In Mongoose 7+, async pre-save hooks do NOT receive a `next` callback.
// Instead, simply return early if no action is needed, or let the function resolve normally.
userSchema.pre("save", async function () {
    // If the password field hasn't been modified, skip hashing to prevent re-hashing
    if (!this.isModified("password")) return;

    // Mathematically encrypt the user's password using the robust bcrypt library
    this.password = await bcrypt.hash(this.password, 10);
    // No need to call next() — Mongoose awaits the async function automatically
});

/**
 * Custom Instance Method: isPasswordCorrect
 * This compares the plain-text string passed from a login request
 * mathematically against the stored hash safely embedded in the database.
 * 
 * @param {String} password - The plain text string the user attempts to log in with.
 * @returns {Boolean} - True if the password is valid, false if not.
 */
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);