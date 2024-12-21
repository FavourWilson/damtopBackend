import express from "express";
import { NextFunction, Request, Response } from "express";
import AuthController from "../controllers/AuthController";

const catchAsync = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
const authRouter = express.Router();

authRouter.post("/register", catchAsync(AuthController.register));
authRouter.post("/login", catchAsync(AuthController.login));
authRouter.post("/verify-token/:token", catchAsync(AuthController.verifyToken));

export default authRouter;
