"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, "firstname is required"],
        minlength: 3
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, "lastname is required"],
        minlength: 3
    },
    phone: {
        type: String,
        trim: true,
        required: [true, "phone is required"],
        minlength: 11
    },
    NIN: {
        type: String,
        trim: true,
        required: [true, "NIN is required"],
        minlength: 11
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator_1.default.isEmail, "Please provide a valid email."],
    },
    password: {
        type: String,
        trim: false,
        required: [true, "Password must be provided"],
        minlength: 8,
    },
}, {
    timestamps: true,
});
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
