const express = require("express");
const Groq = require("groq-sdk");

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/plan", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ msg: "Topic is required" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ VALID MODEL
      messages: [
        {
          role: "user",
          content: `Create a 3-day study plan with time slots for: ${topic}`,
        },
      ],
    });

    res.json({
      plan: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({ msg: "AI generation failed" });
  }
});

module.exports = router;
