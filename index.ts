import express from "express";
import authRouter from "./src/routes/authRouter";
import verifyGiftCardRouter from "./src/routes/giftCardVerifyRouter";
import airtimeRoute from "./src/routes/airtimeRoute";
import dotenv from 'dotenv';
import { connectDB } from "./src/database";

dotenv.config();
const app = express();
const PORT = process.env.SERVER_PORT;

if (!PORT) {
  throw new Error("SERVER_PORT is not defined in the environment variables.");
}

(async () => {
  try {
      await connectDB();
      console.log("Database connected successfully.");
  } catch (err) {
      console.error("Database connection failed:", err);
      process.exit(1); 
  }
})();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads")); // Serve uploaded files

app.use('/api/auth', authRouter);
app.use('/api/giftcard-verify', verifyGiftCardRouter);
app.use('/api/airtime',airtimeRoute)

try {
    app.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error starting the server:", err);
  }
