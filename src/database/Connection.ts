import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE!);
    } catch (error) {
        process.exit(1);
    }
};
