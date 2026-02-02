import express from "express";
import Groq from "groq-sdk";

const router = express.Router();

// ⚠️ If API key missing, disable AI safely
let groq = null;
if (process.env.GROQ_API_KEY) {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
} else {
  console.warn("⚠️ GROQ_API_KEY missing. AI plan disabled.");
}

router.post("/plan", async (req, res) => {
  try {
    if (!groq) {
      return res.status(500).json({ error: "AI not configured" });
    }

    const { topic, weeks } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const totalWeeks = Number(weeks) || 4;

    const prompt = `
Create a STUDY TIMETABLE for ${totalWeeks} weeks.

Topic: ${topic}

Format EXACTLY like this (no markdown, no extra text):

Week 1:
- Day 1: ...
- Day 2: ...
- Day 3: ...

Week 2:
- Day 1: ...
- Day 2: ...
- Day 3: ...
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    const planText = completion.choices[0].message.content;

    res.json({ planText });
  } catch (error) {
    console.error("AI PLAN ERROR:", error);
    res.status(500).json({ error: "Failed to generate plan" });
  }
});

export default router;
