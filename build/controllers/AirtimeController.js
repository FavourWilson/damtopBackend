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
const AirtimeModel_1 = __importDefault(require("../database/models/AirtimeModel"));
const API_URL = process.env.VTU_AIRTIME_API;
const VTU_APIKEY = process.env.VTU_APIKEY;
const AirtimeRecharge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { network, phone, amount, ref, userId } = req.body;
    if (!network || !phone || !amount || !ref) {
        return res.status(400).json({ message: "All fields are required." });
    }
    try {
        const airtimeTransaction = new AirtimeModel_1.default({
            network,
            phone,
            amount,
            ref,
            userId
        });
        yield airtimeTransaction.save();
        const response = yield axios.post(API_URL, {
            apiKey: VTU_APIKEY,
            network,
            phone,
            amount,
            ref,
            userId
        });
        airtimeTransaction.status = "success";
        yield airtimeTransaction.save();
        return res.status(200).json({
            success: true,
            data: response.data,
            airtimeTransaction,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error saving gift card", error });
    }
});
exports.default = { AirtimeRecharge };
