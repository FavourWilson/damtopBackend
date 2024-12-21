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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database");
const EmailService_1 = require("../services/EmailService");
const utils_1 = require("../utils");
const jwtSecret = process.env.JWT_TOKEN;
const COOKIE_EXPIRATION_DAYS = 90; // cookie expiration in days
const expirationDate = new Date(Date.now() + COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
const cookieOptions = {
    expires: expirationDate,
    httpOnly: true,
    secure: false,
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, phone, NIN, email, password } = req.body;
        if (!firstName || !lastName || !phone || !NIN || !email || !password) {
            throw new utils_1.ApiError(400, "All fields are required!");
        }
        const userExists = yield database_1.User.findOne({ email });
        if (userExists) {
            throw new utils_1.ApiError(400, "User already exists!");
        }
        const encryptedPassword = yield (0, utils_1.encryptPassword)(password);
        const user = yield database_1.User.create({
            NIN,
            email,
            firstName,
            lastName,
            password: encryptedPassword,
            phone,
        });
        const userData = {
            NIN: user.NIN,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            password: user.password,
            phone: user.phone,
        };
        // if(!email||!lastName) {
        //     throw new ApiError(400, "Email and last name are required to send verification email!");
        // }
        //awaitsendVerificationEmail(email, lastName);
        return res.json({
            data: userData,
            message: "User registered successfully!",
            status: 200,
        });
    }
    catch (error) {
        const message = (error === null || error === void 0 ? void 0 : error.message) || "Something went wrong!";
        return res.status(error.status || 500).json({
            message,
            status: error.status || 500,
        });
    }
});
const createSendToken = (user, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, id } = user;
    const token = jsonwebtoken_1.default.sign({ email, id }, jwtSecret, {
        expiresIn: "1d",
    });
    if (process.env.NODE_ENV === "production") {
        cookieOptions.secure = true;
    }
    res.cookie("jwt", token, cookieOptions);
    return token;
});
const verifyToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        if (!token) {
            return res.status(400).json({ message: "Invalid token" });
        }
        const isValid = (0, utils_1.verifyTokens)(token);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        res.status(200).json({ message: "Email successfully verified!" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield database_1.User.findOne({ email }).select("+password");
        if (!user ||
            !(yield (0, utils_1.isPasswordMatch)(password, user.password))) {
            throw new utils_1.ApiError(400, "Incorrect email or password");
        }
        const token = yield createSendToken(user, res);
        return res.json({
            message: "User logged in successfully!",
            status: 200,
            token,
        });
    }
    catch (error) {
        return res.json({
            message: error.message,
            status: 500,
        });
    }
});
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield database_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found!" });
        }
        // Generate a password reset token that expires in 1 hour
        const resetToken = jsonwebtoken_1.default.sign({ id: user._id }, jwtSecret, { expiresIn: "1h" });
        // Send password reset email
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        yield (0, EmailService_1.sendPasswordResetEmail)(email);
        return res.status(200).json({
            message: "Password reset link sent successfully!",
            status: 200,
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message, status: 500 });
    }
});
/**
 * @desc Reset password
 */
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const user = yield database_1.User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found!" });
        }
        // Hash the new password
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 12);
        // Update the user's password
        user.password = hashedPassword;
        yield user.save();
        return res.status(200).json({
            message: "Password reset successfully!",
            status: 200,
        });
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(400).json({ message: "Token has expired", status: 400, });
        }
        return res.status(500).json({ message: error.message, status: 500, });
    }
});
exports.default = {
    login,
    register,
    requestPasswordReset,
    resetPassword,
    verifyToken
};
