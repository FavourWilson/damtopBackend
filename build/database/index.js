"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.User = void 0;
const Connection_1 = require("./Connection");
Object.defineProperty(exports, "connectDB", { enumerable: true, get: function () { return Connection_1.connectDB; } });
const UserModel_1 = __importDefault(require("./models/UserModel"));
exports.User = UserModel_1.default;
