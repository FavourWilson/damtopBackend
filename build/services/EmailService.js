"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = sendVerificationEmail;
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const utils_1 = require("../utils");
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
function sendVerificationEmail(email, name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = (0, utils_1.generateToken)();
            const verificationUrl = `${process.env.FRONTEND_URL}/verify/${token}`;
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Email Verification",
                html: `
        <h1>Welcome, ${name}!</h1>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationUrl}">Verify Email</a>
      `,
            };
            yield transporter.sendMail(mailOptions);
            console.log(`Verification email sent to ${email}`);
        }
        catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    });
}
function sendPasswordResetEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = (0, utils_1.generateToken)();
            const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Reset Your Password",
                html: `
        <h1>Reset Your Password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
      `,
            };
            yield transporter.sendMail(mailOptions);
            console.log(`Password reset email sent to ${email}`);
        }
        catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    });
}
