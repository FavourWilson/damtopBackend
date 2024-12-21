 import express from "express";
 import { NextFunction, Request, Response } from "express";
 import multer from "multer";
 import GiftCardVerifyController from "../controllers/GiftCardVerifyController";
 import { uploadMiddleware } from "../middleware/uploadMiddleware";

 const catchAsync = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
   Promise.resolve(fn(req, res, next)).catch(next);
 };

 const verifyGiftCardRouter = express.Router();

 verifyGiftCardRouter.post("/verify-gift-card", catchAsync(GiftCardVerifyController.VerifyGiftCard));
 verifyGiftCardRouter.post("/save", uploadMiddleware, catchAsync(GiftCardVerifyController.SaveGiftCard));
 export default verifyGiftCardRouter;
