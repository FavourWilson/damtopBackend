"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
const authRouter = express_1.default.Router();
authRouter.post("/register", catchAsync(AuthController_1.default.register));
authRouter.post("/login", catchAsync(AuthController_1.default.login));
authRouter.post("/verify-token/:token", catchAsync(AuthController_1.default.verifyToken));
exports.default = authRouter;
