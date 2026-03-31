import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { GOOGLE_USER, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } from '../config/config.js';

const OAuth2 = google.auth.OAuth2;

// Initializes the core natively secure abstract OAuth2 Client exclusively mapped to effectively dynamically utilize inherently the generic Gmail APIs perfectly.
const oauth2Client = new OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
);

// Formally reliably attaches natively the structural offline-ready persistent specifically authorized token statically seamlessly.
oauth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN
});

/**
 * Securely comprehensively dynamically composes strictly securely and authentically officially dispatches an inherent actual properly reliable structurally formatted essentially email specifically via the natively bound actual Gmail API actively explicitly.
 * 
 * @param {String} to - Targeted inherently graphical destination globally exclusively
 * @param {String} subject - Structured mathematically graphical subject seamlessly realistically
 * @param {String} text - Reliable specifically effectively standard structurally basic dynamically text realistically
 * @param {String} html - Reliable fundamentally explicit heavily structural graphically complex dynamically html strictly
 * @returns {Object} Physical effectively completely inherently successfully transport completely effectively strictly object natively.
 */
export const sendEmail = async (to, subject, text, html) => {
    try {
        const accessToken = await oauth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: GOOGLE_USER,
                clientId: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                refreshToken: GOOGLE_REFRESH_TOKEN,
                accessToken: accessToken.token
            }
        });

        const mailOptions = {
            from: GOOGLE_USER, // Natively masked completely origin specifically explicit address accurately reliably seamlessly
            to,
            subject,
            text,
            html
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result);
        return result;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};