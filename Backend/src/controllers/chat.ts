import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

interface CustomRequest extends Request {
    user?: {
        _id: string;
        role?: string;
    };
}

dotenv.config();

export const generalChat = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const { message } = req.body;
        const userId = req.user?._id

        if(!userId) {
            res.status(401).json({message: "User not found"})
        }
        if (!message) {
            res.status(400).json({ message: "Missing fields required" });
            return;
        }
        const response = await axios.post(`${process.env.MODEL_API_URL}/general-chat`, { message, userId }, {
            headers: {
                "Content-Type": "application/json",
                "X-API_Key": process.env.MODEL_API_KEY
            }
        }
        );

        res.status(200).json(response.data);
    }
    catch (error) {
        console.error("Error posting request:", error);
        res.status(400).json({ error: "Error posting request" });
    }
};

export const generalTest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { course, questionNumber } = req.body;
        if (!course || !questionNumber) {
            res.status(400).json({ message: "Missing fields required" });
            return;
        }
        const requestData = {
            course,
            number_of_questions: questionNumber,
        };
        const response = await axios.post(`${process.env.MODEL_API_URL}/generate-test`, requestData, {
            headers: {
                "Content-Type": "application/json",
                "X-API_Key": process.env.MODEL_API_KEY
            }
        });

        res.status(200).json(response.data);
    }
    catch (error) {
        console.error("Error posting request:", error);
        res.status(400).json({ error: "Error posting request" });
    }
};