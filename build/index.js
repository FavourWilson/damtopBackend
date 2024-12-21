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
const express_1 = __importDefault(require("express"));
const authRouter_1 = __importDefault(require("./src/routes/authRouter"));
const giftCardVerifyRouter_1 = __importDefault(require("./src/routes/giftCardVerifyRouter"));
const airtimeRoute_1 = __importDefault(require("./src/routes/airtimeRoute"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./src/database");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.SERVER_PORT;
if (!PORT) {
    throw new Error("SERVER_PORT is not defined in the environment variables.");
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.connectDB)();
        console.log("Database connected successfully.");
    }
    catch (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
}))();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/uploads", express_1.default.static("uploads")); // Serve uploaded files
app.use('/api/auth', authRouter_1.default);
app.use('/api/giftcard-verify', giftCardVerifyRouter_1.default);
app.use('/api/airtime', airtimeRoute_1.default);
try {
    app.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`);
    });
}
catch (err) {
    console.error("Error starting the server:", err);
}
