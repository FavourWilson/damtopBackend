import { Request, Response } from "express";
import GiftCard from "../database/models/GiftCardModel";

// Mark Gift Card as Redeemed
const VerifyGiftCard = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const giftCard = await GiftCard.findById(id);

      if (!giftCard) {
        return res.status(404).json({ message: "Gift card not found" });
      }

      if (giftCard.status === "redeemed") {
        return res.status(400).json({ message: "Gift card has already been redeemed" });
      }

      giftCard.status = "redeemed";
      await giftCard.save();

      res.status(200).json({ message: "Gift card successfully redeemed", giftCard });
    } catch (error) {
      res.status(500).json({ message: "Error redeeming gift card", error });
    }
};

// Upload file handler
const SaveGiftCard = async (req: Request, res: Response) => {
    const { cardName, provider, amount, userId } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (!cardName || !provider || !amount || !userId || !imageUrl) {
      return res.status(400).json({ message: "All fields are required, including image." });
    }

    try {
      const newGiftCard = new GiftCard({
        amount,
        cardName,
        imageUrl,
        provider,
        userId,
    });

      await newGiftCard.save();
      res.status(201).json({ message: "Gift card saved successfully", newGiftCard });
    } catch (error) {
      res.status(500).json({ message: "Error saving gift card", error });
    }
  };

export default {VerifyGiftCard,  SaveGiftCard};
