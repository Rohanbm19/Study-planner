const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Plan = require("../models/Plan");
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/plan", auth, async (req, res) => {
  try {
    const { topic, weeks } = req.body;

    if (!topic || typeof topic !== "string") {
      return res.status(400).json({ msg: "Valid topic is required" });
    }

    const totalWeeks = Number(weeks) || 4;

    // ✅ CORRECT PROMPT
    const prompt = `
Create a WEEKLY STUDY PLAN for ${totalWeeks} weeks.

Format EXACTLY like this:

Week 1:
Topic:
Subtopics:
Daily Tasks:
Hours per day:

Topic to study: ${topic}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const planText = completion.choices[0].message.content;

    // ✅ SAVE CLEAN DATA
    const savedPlan = await Plan.create({
      userId: req.userId,
      topic: topic, // STRING ONLY
      planText,
    });

    res.json({
      planText,
      planId: savedPlan._id,
    });

  } catch (err) {
    console.error("AI PLAN ERROR:", err);
    res.status(500).json({ msg: "Failed to generate plan" });
  }
});

module.exports = router;
