import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IUser, User } from "../database";
import { sendPasswordResetEmail, sendVerificationEmail } from "../services/EmailService";
import { ApiError, encryptPassword, isPasswordMatch, verifyTokens } from "../utils";
import dotenv from 'dotenv'
import { v4 as uuidv4 } from "uuid";

dotenv.config();
const jwtSecret = process.env.JWT_TOKEN as string;
const COOKIE_EXPIRATION_DAYS = 90; // cookie expiration in days
const expirationDate = new Date(
    Date.now() + COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000
);
const cookieOptions = {
    expires: expirationDate,
    httpOnly: true,
    secure: false,

};
const register = async (req: Request, res: Response) => {
  try {
      const { firstName, lastName, phone, NIN, email, password } = req.body;

      if (!firstName || !lastName || !phone || !NIN || !email || !password) {
          throw new ApiError(400, "All fields are required!");
      }

      const userExists = await User.findOne({ email });
      if (userExists) {
          throw new ApiError(400, "User already exists!");
      }
      const token = uuidv4();
      const encryptedPassword = await encryptPassword(password);

      const user = await User.create({
          NIN,
          email,
          firstName,
          lastName,
          password: encryptedPassword,
          phone,
          isEmailVerified: false,
          verificationToken: token,
      });

      const userData = {
          NIN: user.NIN,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName, 
          password: user.password,
          phone: user.phone,
          isEmailVerified: false,
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

  } catch (error: any) {
      const message = error?.message || "Something went wrong!";
      return res.status(error.status || 500).json({
        message,
        status: error.status || 500,
    });
  }
};

const createSendToken = async (user: IUser, res: Response) => {
    const { email, id } = user;
    const token = jwt.sign({ email, id }, jwtSecret, {
        expiresIn: "1d",
    });
    if (process.env.NODE_ENV === "development") { cookieOptions.secure = true; }
    res.cookie("jwt", token, cookieOptions);

    return token;
};

const verifyToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified!" });
    }

    // Update user's email verification status
    user.isEmailVerified = true;
    user.verificationToken = undefined; // Clear the token
    await user.save();

    return res.status(200).json({ message: "Email successfully verified!" });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
  };

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (
            !user ||
            !(await isPasswordMatch(password, user.password as string))
        ) {
            throw new ApiError(400, "Incorrect email or password");
        }
        if (!user.isEmailVerified) {
          throw new Error("Email is not verified");
        }

        const token = await createSendToken(user!, res);

        return res.json({
            message: "User logged in successfully!",
            status: 200,
            token,
        });
    } catch (error: any) {
        return res.json({
          message: error.message,
          status: 500,
        });
    }
};

const requestPasswordReset = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ status: 404, message: "User not found!" });
      }

      // Generate a password reset token that expires in 1 hour
      const resetToken = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "1h" });

      // Send password reset email
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      await sendPasswordResetEmail(email);

      return res.status(200).json({
        message: "Password reset link sent successfully!",
        status: 200,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message, status: 500 });
    }
  };

  /**
   * @desc Reset password
   */
const resetPassword = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      // Verify the token
      const decoded = jwt.verify(token, jwtSecret) as { id: string };
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ status: 404, message: "User not found!" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({
        message: "Password reset successfully!",
        status: 200,
      });
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({ message: "Token has expired", status: 400,  });
      }
      return res.status(500).json({ message: error.message, status: 500,  });
    }
  };
export default {
  login,
  register,
  requestPasswordReset,
  resetPassword,
  verifyToken
};
