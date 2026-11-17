require('dotenv').config();
const express = require('express');
const Groq = require("groq-sdk");
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public')); // frontend ဖိုင်တွေထားမယ့် folder

// Groq API နဲ့ ချိတ်ဆက်ခြင်း
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// User ဆီက မေးခွန်းကို လက်ခံမယ့် Route
app.post('/ask', async (req, res) => {
    try {
        const { prompt } = req.body;

        // AI ဆီ မေးခွန်းပို့ခြင်း
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant who can speak Myanmar and English." },
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile", // Groq မှာ သုံးလို့ရတဲ့ model နာမည်
        });

        const answer = chatCompletion.choices[0]?.message?.content || "အဖြေမရှိပါ";
        res.json({ answer: answer });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "AI ဆီက အဖြေတောင်းလို့မရပါဘူး။" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

