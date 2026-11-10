
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const WELLNESS_INSTRUCTION = `
You are the wellness reflection assistant inside MindWell AI.

Your task is to review a user's recent wellness check-ins and provide
a short, thoughtful reflection.

GUIDELINES:
- Be warm, supportive, calm, and non-judgmental.
- Use simple, conversational English.
- Keep the response around 3–5 sentences.
- Identify meaningful patterns across mood, stress, sleep,
  water intake, steps, and weight when relevant.
- Compare entries only when the available data supports it.
- Mention positive patterns without exaggeration.
- Suggest one small, practical wellness action when appropriate.
- Do not assume missing information.
- Do not diagnose medical or mental health conditions.
- Do not make medical claims or prescribe treatment.
- Never shame or pressure the user.
- Remind the user that check-in numbers do not tell the whole story.

Your response must contain only the reflection text.
`;

router.post("/", authMiddleware, async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "Gemini API key is not configured.",
      });
    }

    const { checkins } = req.body;

    if (
      !Array.isArray(checkins) ||
      checkins.length === 0 ||
      checkins.length > 7
    ) {
      return res.status(400).json({
        message: "Please provide between 1 and 7 check-ins.",
      });
    }

    const safeCheckins = checkins.map((item) => ({
      date: item.date || null,
      mood:
        typeof item.mood === "string"
          ? item.mood.slice(0, 30)
          : null,
      stress:
        Number.isFinite(Number(item.stress))
          ? Number(item.stress)
          : null,
      sleepHours:
        item.sleepHours == null
          ? null
          : Number(item.sleepHours),
      waterGlasses:
        item.waterGlasses == null
          ? null
          : Number(item.waterGlasses),
      steps:
        item.steps == null
          ? null
          : Number(item.steps),
      weight:
        item.weight == null
          ? null
          : Number(item.weight),
      weightUnit:
        item.weightUnit === "lb" ? "lb" : "kg",
    }));

    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `
Review the following recent wellness check-ins.

The entries are ordered from newest to oldest.

Check-in data:
${JSON.stringify(safeCheckins, null, 2)}

Provide a short, personalized wellness reflection.
`,
      config: {
        systemInstruction: WELLNESS_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 350,
      },
    });

    const feedback = response.text?.trim();

    if (!feedback) {
      throw new Error("Gemini returned an empty reflection.");
    }

    return res.status(200).json({ feedback });

  } catch (error) {
    console.error("Wellness reflection error:", error);

    return res.status(500).json({
      message: "Could not generate your wellness reflection.",
    });
  }
});

module.exports = router;
