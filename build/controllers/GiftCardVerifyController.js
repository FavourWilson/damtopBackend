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
const GiftCardModel_1 = __importDefault(require("../database/models/GiftCardModel"));
// Mark Gift Card as Redeemed
const VerifyGiftCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const giftCard = yield GiftCardModel_1.default.findById(id);
        if (!giftCard) {
            return res.status(404).json({ message: "Gift card not found" });
        }
        if (giftCard.status === "redeemed") {
            return res.status(400).json({ message: "Gift card has already been redeemed" });
        }
        giftCard.status = "redeemed";
        yield giftCard.save();
        res.status(200).json({ message: "Gift card successfully redeemed", giftCard });
    }
    catch (error) {
        res.status(500).json({ message: "Error redeeming gift card", error });
    }
});
// Upload file handler
const SaveGiftCard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cardName, provider, amount, userId } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    if (!cardName || !provider || !amount || !userId || !imageUrl) {
        return res.status(400).json({ message: "All fields are required, including image." });
    }
    try {
        const newGiftCard = new GiftCardModel_1.default({
            amount,
            cardName,
            imageUrl,
            provider,
            userId,
        });
        yield newGiftCard.save();
        res.status(201).json({ message: "Gift card saved successfully", newGiftCard });
    }
    catch (error) {
        res.status(500).json({ message: "Error saving gift card", error });
    }
});
exports.default = { VerifyGiftCard, SaveGiftCard };
