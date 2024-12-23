import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config();
class ApiError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(
        statusCode: number,
        message: string | undefined,
        isOperational = true,
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

const encryptPassword = async (password: string) => {
    const encryptedPassword = await bcrypt.hash(password, 12);
    return encryptedPassword;
};

const isPasswordMatch = async (password: string, userPassword: string) => {
    const result = await bcrypt.compare(password, userPassword);
    return result;
};

export function generateToken(): string {
  return uuidv4();
}

export const verifyTokens = (token: string) => {
    try {
        return jwt.verify(token, process.env.JWT_TOKEN); 
    } catch (error) {
        return null;
    }
};

export { ApiError, encryptPassword, isPasswordMatch };
