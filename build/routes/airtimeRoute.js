"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AirtimeController_1 = __importDefault(require("../controllers/AirtimeController"));
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
const airtimeRoute = express_1.default.Router();
airtimeRoute.post("/register", catchAsync(AirtimeController_1.default.AirtimeRecharge));
exports.default = airtimeRoute;
