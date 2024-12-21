import mongoose, { Document, Schema} from "mongoose";

export interface IAdminGiftCard extends Document {
  code: string;
  value: number;
  status: string;
  createdBy: string;
  expirationDate: Date;
}

const giftCardSchema = new Schema<IAdminGiftCard>(
  {
    code: { type: String, required: true, unique: true },
    createdBy: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    status: { type: String, default: "Available" },
    value: { type: Number, required: true },
  },
  { timestamps: true }
);

const AdminGiftCard = mongoose.model<IAdminGiftCard>("GiftCard", giftCardSchema);
export default AdminGiftCard;
