import mongoose from "mongoose";

const connectToDatabase = async () => {
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is missing in environment (.env)");
        }
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error?.message || error);
    }
};

export default connectToDatabase;