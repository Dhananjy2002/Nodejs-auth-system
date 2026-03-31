import { Router } from "express";
import { registerUser, getMe, getActiveSessions, refreshToken, logout, logoutAll, loginUser, verifyEmail } from "../controllers/auth.controller.js";

const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Secure API endpoints for user identity and multi-device session management
 */


/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new system user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Platform user verified and created cleanly! Safely injects HTTP-Only "refresh_token" automatically into your system while gracefully returning "access_token" payload.
 *       400:
 *         description: User didn't specify every required core property
 *       409:
 *         description: That email/username already strictly exists
 */
authRouter.post("/register", registerUser);


/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticate a user via Database
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Authenticated properly! Drops a new HTTP-Only specific physical tracking cookie to establish dynamic access.
 *       401:
 *         description: Provided an Invalid password 
 *       404:
 *         description: A registered user does not map sequentially to that email
 */
authRouter.post("/login", loginUser);


/**
 * @swagger
 * /api/v1/auth/get-me:
 *   get:
 *     summary: Directly retrieves current identity payload from Abstract tokens
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User physically fetched safely successfully (Notice the strictly-removed password abstraction).
 *       401:
 *         description: Absolutely unauthorized! Standard target payload either missing or expired!
 *       404:
 *         description: Ghost profile.
 */
authRouter.get("/get-me", getMe);


/**
 * @swagger
 * /api/v1/auth/sessions:
 *   get:
 *     summary: Retrieve securely exclusively mapped logged-in active dynamically structured session instances!
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Effectively reliably fetched natively!
 *       401:
 *         description: Generic Bearer header strictly mathematically physically missing seamlessly.
 */
authRouter.get("/sessions", getActiveSessions);

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   get:
 *     summary: Mint a fresh valid Access Pass actively 
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Technically successfully checked the database physically to rotate and securely provide standard HTTP access passes logically flawlessly!
 *       401:
 *         description: That cookie technically does not functionally validate locally!
 *       404:
 *         description: Wait a minute — this cookie was fundamentally flagged or strictly revoked database-side completely!
 */
authRouter.get("/refresh-token", refreshToken);


/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Revoke this explicit session footprint securely seamlessly
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Technically successfully triggered DB flags securely and wiped the cookie locally accurately!
 *       401:
 *         description: Unauthorized.
 */
authRouter.post("/logout", logout);


/**
 * @swagger
 * /api/v1/auth/logout-all:
 *   post:
 *     summary: Extremely high-alert systematic wipe universally
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Severed inherently all standard interconnects across instances flawlessly everywhere.
 *       401:
 *         description: Unauthorized natively absent token data.
 */
authRouter.post("/logout-all", logoutAll);

/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   post:
 *     summary: Verify a user's newly registered email address utilizing a generated OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully! Target user physically unlocked.
 *       400:
 *         description: Malformed payload natively missing email or explicit OTP string.
 *       401:
 *         description: OTP inherently provided is strictly mathematically invalid natively.
 *       404:
 *         description: No active un-expired OTP currently structured realistically exists for this email structurally.
 */
authRouter.post("/verify-email", verifyEmail);

export default authRouter;
