import express from "express";
import Groq from "groq-sdk";
import auth from "../middleware/authMiddleware.js";
import Plan from "../models/Plan.js";

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/plan", auth, async (req, res) => {
  try {
    const { topic, weeks } = req.body;

    if (!topic) {
      return res.status(400).json({ msg: "Topic is required" });
    }

    const totalWeeks = Number(weeks) || 4;

    const prompt = `
Create a ${totalWeeks}-week study timetable.
Each week MUST have 7 days (Monday to Sunday).

Format EXACTLY like this:

Week 1
Monday: ...
Tuesday: ...
Wednesday: ...
Thursday: ...
Friday: ...
Saturday: ...
Sunday: ...

Topic: ${topic}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    // ✅ DEFINE FIRST
    const planText = completion.choices[0].message.content
      .replace(/\*\*/g, "") // remove **
      .trim();

    // ✅ THEN USE
    const savedPlan = await Plan.create({
      userId: req.userId,
      topic,
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

export default router;
