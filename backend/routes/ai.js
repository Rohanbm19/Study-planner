const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/plan", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ msg: "Topic is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Create a 3-day study plan with dates and hours for: ${topic}`,
        },
      ],
    });

    res.json({
      plan: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("AI ERROR:", err.message);
    res.status(500).json({ msg: "AI generation failed" });
  }
});

module.exports = router;
