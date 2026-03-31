import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";
import sessionModel from "../models/session.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.utils.js";

import generateOTP, { getOTPEmailTemplate } from "../utils/otp_generate.js";
import { Otp } from "../models/otp.model.js";
import { sendEmail } from "../service/email.service.js";

/**
 * @desc    Register a new user, initiates their first session, returns tokens
 * @route   POST /api/v1/auth/register
 */
export async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;

        // Ensure the user doesn't already exist in the database (checking by email or username)
        const alreadyRegisteredUser = await User.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (alreadyRegisteredUser) {
            return res.status(409).json({ message: "User already registered" });
        }

        // Validate basic fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create the user in the database. 
        // Note: The password will be automatically hashed by the Mongoose 'pre-save' hook defined in the User model.
        const user = await User.create({
            username,
            email,
            password
        });

        const otp = generateOTP();
        const html = getOTPEmailTemplate(otp);
        const otpHash = await bcrypt.hash(otp, 10);

        await Otp.create({
            email,
            user: user._id,
            otpHash
        })

        await sendEmail(email, "OTP Verification", `Your OTP is ${otp}`, html);


        // Respond with success JSON payload including the short-lived structural access_token
        return res.status(201).json({
            message: "User created successfully",
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                verified: user.verified
            }

        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @desc    Authenticate user credentials, assign new valid cookies and access pass
 * @route   POST /api/v1/auth/login
 */
export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        // Retrieve the user from the database by matching their email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.verified) {
            return res.status(401).json({ message: "User not verified" });
        }


        // Utilize the custom instance method from the robust User Model to mathematically verify the password
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate the long-lived refresh token 
        const refresh_token = generateRefreshToken(user._id);

        // Hash it before injecting into the database
        const refreshTokenHash = await bcrypt.hash(refresh_token, 10);

        // Log the brand new session dynamically into the Session model
        const session = await sessionModel.create({
            user: user._id,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
        });

        // Generate the matching access payload linking to the DB session
        const access_token = generateAccessToken(user._id, session._id);

        // Automatically assign the secure cookie payload into their HTTP-Only browser vault
        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 24 * 60 * 60 * 1000 // 15 Days
        });

        // Complete the authentication and pass the standard application token back down
        return res.status(201).json({
            message: "User logged in successfully",
            user: {
                _id: user._id,
                email: user.email,
                username: user.username
            },
            access_token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @desc    Fetch current authenticated user profile payload data (ignores password string!)
 * @route   GET /api/v1/auth/get-me
 */
export async function getMe(req, res) {
    try {
        // Extract the short-lived Access token payload off the generic HTTP Authentication Bearer header
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Decode the payload specifically using the exact matching Secret logic parameters
        const decodedToken = jwt.verify(token, JWT_SECRET);

        // Extract the target User by matching the decrypted database identifier, stripping the password securely
        const user = await User.findById(decodedToken._id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User fetched successfully",
            user: user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @desc    Fetch physical active sessions securely mapped automatically natively explicitly!
 * @route   GET /api/v1/auth/sessions
 */
export async function getActiveSessions(req, res) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized" });
        
        const decodedToken = jwt.verify(token, JWT_SECRET);
        
        const sessions = await sessionModel.find({
            user: decodedToken._id,
            revoked: false
        }).select("-refreshTokenHash").sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Active sessions dynamically fetched reliably",
            sessions
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @desc    Check validity of standard HTTP-only cookie, logically mint a brand new continuous pair of Token credentials
 * @route   GET /api/v1/auth/refresh-token
 */
export async function refreshToken(req, res) {
    try {
        // Read the standard HTTP cookie (the browser automatically sends this)
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token not found" });
        }

        // Attempt generically decrypting the token with the global Server JWT parameters
        const decodedToken = jwt.verify(refreshToken, JWT_SECRET);

        // Fetch ALL active sessions for this specific user (allows multi-device logins like phone + desktop)
        const activeSessions = await sessionModel.find({
            user: decodedToken._id,
            revoked: false
        });

        if (activeSessions.length === 0) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Technically verify that the browser cookie matches the EXACT device session cryptographically 
        let targetSession = null;
        for (const session of activeSessions) {
            const isValid = await bcrypt.compare(refreshToken, session.refreshTokenHash);
            if (isValid) {
                targetSession = session;
                break;
            }
        }

        if (!targetSession) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Use the strictly mapped session moving forward
        const session = targetSession;

        // Read the target abstract User directly via decryption
        const user = await User.findById(decodedToken._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Once successfully legally validated, create a brand new pair of dynamic session credential passes
        const access_token = generateAccessToken(user._id, session._id);
        const newRefreshToken = generateRefreshToken(user._id);

        // Safely Hash & Overwrite the active Session Model mathematically
        const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
        session.refreshTokenHash = newRefreshTokenHash;
        await session.save();

        // Overwrite the HTTP-Only securely back down 
        res.cookie("refresh_token", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Token refreshed successfully",
            access_token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @desc    Disconnect Target User's Local login, systematically purge and block standard Session instances strictly
 * @route   POST /api/v1/auth/logout
 */
export async function logout(req, res) {
    try {
        // Capture specific cookie 
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token not found" });
        }

        const decodedToken = jwt.verify(refreshToken, JWT_SECRET);

        const user = await User.findById(decodedToken._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Abstract specific logged-in Sessions safely tracking dynamically across all devices
        const activeSessions = await sessionModel.find({
            user: user._id,
            revoked: false
        });

        if (activeSessions.length === 0) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Strictly verify it directly mapped mathematically to identify WHICH specific device is logging out!
        let targetSession = null;
        for (const session of activeSessions) {
            const isValid = await bcrypt.compare(refreshToken, session.refreshTokenHash);
            if (isValid) {
                targetSession = session;
                break;
            }
        }

        if (!targetSession) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        // Formally invalidate active flag state specifically directly mapping to Database
        targetSession.revoked = true;
        await targetSession.save();

        // Wipe specific target tracking browser footprint completely logically!
        res.clearCookie("refresh_token");
        return res.status(200).json({ message: "User logged out successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @desc    Sever all interconnected connections aggressively logic-wide matching this specific identity across all known generic external instances
 * @route   POST /api/v1/auth/logout-all
 */
export async function logoutAll(req, res) {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token not found" });
        }

        // Unseal identifying footprint generically
        const decodedToken = jwt.verify(refreshToken, JWT_SECRET);

        // Wipe EVERY generic specific tracking Session dynamically!
        await sessionModel.updateMany({
            user: decodedToken._id, // Fixed a subtle bug where decodedToken.id was undefined, it's actually ._id
            revoked: false
        }, {
            revoked: true
        });

        // Strip logical target specifically 
        res.clearCookie("refresh_token");

        return res.status(200).json({ message: "User logged out successfully from all devices" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}



/**
 * @desc    Validate strict explicit email OTP physically, securely verify cryptographically, completely unlock profile accurately.
 * @route   POST /api/v1/auth/verify-email
 */
export async function verifyEmail(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const otpEntry = await Otp.findOne({ email });
        if (!otpEntry) {
            return res.status(404).json({ message: "OTP not found" });
        }

        const isValid = await bcrypt.compare(otp, otpEntry.otpHash);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid OTP" });
        }

        const user = await User.findById(otpEntry.user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.verified = true;
        await user.save();

        await Otp.deleteOne({ email });

        return res.status(200).json({ message: "Email verified successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}