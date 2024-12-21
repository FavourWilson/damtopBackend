import mongoose, { Document, Schema } from "mongoose";

interface IGiftCard extends Document {
    cardName: string;
    provider: string;
    amount: number;
    imageUrl: string;
    status: "active" | "redeemed";
    userId: mongoose.Types.ObjectId;

  }

 /* eslint-disable sort-keys */
const GiftCardSchema: Schema = new Schema({
  cardName: { type: String, required: true },
  provider: { type: String, required: true },
  amount: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  status: {

      enum: ["active", "redeemed"],
      default: "active",
      type: String,
  },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});
/* eslint-enable sort-keys */

const GiftCard = mongoose.model<IGiftCard>("GiftCard", GiftCardSchema);
export default GiftCard;
