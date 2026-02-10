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
        const {prompt} = req.body;

        if (!prompt) {
            return res.status(400).json({error: "Message is required"});
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const result = await model.generateContent(prompt);
        const reply = await result.response.text();

        res.json({reply});
    } catch (err) {
        // Gemini quota / rate limit
        if (err.status === 429) {
            console.warn("⚠️ Gemini rate limit hit (429):", err.errorDetails);

            return res.status(429).json({
                reply: "⚠️ Rate limit hit. Please wait a bit before sending another prompt."
            });
        }

        // Any other Gemini / server error
        console.error("❌ Gemini server error (500):", err);

        res.status(500).json({
            reply: "❌ Internal server error"
        });
    }
});

// Server status
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
