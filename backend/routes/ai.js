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

    // 🔹 1. Generate plan from Groq
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `Create a detailed study plan for ${topic}`,
        },
      ],
    });

    const planText = completion.choices[0].message.content;

    // 🔹 2. SAVE TO DATABASE (THIS WAS BROKEN BEFORE)
    const plan = await Plan.create({
      userId: req.userId,   // ✅ REQUIRED
      topic,         // ✅ REQUIRED
      planText,   // ✅ REQUIRED
    });

    const savedPlan = await Plan.create({
  userId: req.userId,
  topic,
  planText,
});

console.log("✅ PLAN SAVED:", savedPlan._id);


    // 🔹 3. Send response
    res.json({ plan: planText });
  } catch (err) {
    console.error("AI PLAN ERROR:", err);
    res.status(500).json({ msg: "Failed to generate plan" });
  }
});

module.exports = router;
