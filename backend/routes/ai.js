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
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ msg: "Topic is required" });
    }

    // ✅ STRICT WEEKLY FORMAT PROMPT
const prompt = `
Create a WEEKLY STUDY PLAN strictly in this format.

Week 1:
Topic:
Subtopics:
Daily Tasks:
Hours per day:

Week 2:
Topic:
Subtopics:
Daily Tasks:
Hours per day:

Keep it clean.
No markdown.
No ** symbols.
No paragraphs.
Plain text only.

Topic: ${topic}
`;



    // 🔹 Generate plan from Groq
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

    // 🔹 SAVE PLAN (ONLY ONCE ✅)
    const savedPlan = await Plan.create({
      userId: req.userId,
      topic,
      planText,
    });

    console.log("✅ PLAN SAVED:", savedPlan._id);

    // 🔹 Send response
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
