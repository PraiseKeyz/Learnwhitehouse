import mongoose from 'mongoose';
import logger from '../utils/logger';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        logger.info("MongoDB connected successfully");
    }
    catch (error) {
        logger.error({ error }, "MongoDB connection error");
        process.exit(1);
    }
}