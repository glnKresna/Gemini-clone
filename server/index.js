import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Test route
app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Server is alive 🫀" });
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
    try{
        const {message} = req.body;

        if (!message) {
            return res.status(400).json({error: "Message is required"});
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const result = await model.generateContent(message);
        const reply = result.response.text();

        res.json({reply});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error. Gemini had a meltdown 💥"});
    }
});

// Server status
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
