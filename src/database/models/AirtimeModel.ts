import mongoose, { Document, Schema } from "mongoose";

interface IAirtime extends Document {
    network: string;
    phone: string;
    amount: number;
    ref: string;
    status?: 'pending' | 'success' | 'failed';
    default: 'pending';
    userId: mongoose.Types.ObjectId;

  }

 /* eslint-disable sort-keys */
const AirtimeSchema: Schema = new Schema({
  network: { type: String, required: true },
  phone: { type: String, required: true },
  amount: { type: Number, required: true },
  ref: { type: String, required: true },
  status: {
      enum: ['pending', 'success', 'failed'],
      default: "pending",
      type: String,
  },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});
/* eslint-enable sort-keys */

const Airtime = mongoose.model<IAirtime>("Airtime", AirtimeSchema);
export default Airtime;
