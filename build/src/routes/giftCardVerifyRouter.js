"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GiftCardVerifyController_1 = __importDefault(require("../controllers/GiftCardVerifyController"));
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
const verifyGiftCardRouter = express_1.default.Router();
verifyGiftCardRouter.post("/verify-gift-card", catchAsync(GiftCardVerifyController_1.default.VerifyGiftCard));
verifyGiftCardRouter.post("/save", uploadMiddleware_1.uploadMiddleware, catchAsync(GiftCardVerifyController_1.default.SaveGiftCard));
exports.default = verifyGiftCardRouter;
