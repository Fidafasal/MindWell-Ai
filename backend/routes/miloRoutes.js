
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Conversation = require("../models/Conversation");

const router = express.Router();

const SYSTEM_INSTRUCTION = `
You are Milo, the friendly AI wellness companion inside MindWell AI.

PERSONALITY:
- Warm, kind, calm, friendly and emotionally supportive.
- Speak naturally, like a caring friend.
- Listen without judgment.
- Use simple, conversational English.
- Be empathetic without sounding overly formal or robotic.

RESPONSE STYLE:
- Usually respond in 2–4 sentences.
- Ask only one question at a time.
- Avoid unnecessarily long explanations.
- Don't repeat comforting phrases in every response.
- Don't give advice unless it is relevant.
- Remember the recent conversation and avoid asking questions the user has already answered.
- Use emojis occasionally, not in every message.
- Make the conversation feel natural and personal.

WELLNESS SUPPORT:
- Suggest simple activities for stress, anxiety, sadness, anger and tiredness.
- Encourage healthy habits and self-care.
- Never diagnose medical or mental health conditions.
- Never claim to be a doctor or therapist.
- Never shame, pressure or judge the user.
- For immediate danger or possible self-harm, encourage contacting emergency services or a trusted person immediately.

IMPORTANT:
You are a wellness companion, not a replacement for professional care.
Your goal is to help users feel heard, supported and comfortable.
`;

// Load the logged-in user's chat history
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      user: req.user._id,
    });

    return res.status(200).json({
      messages: conversation ? conversation.messages.slice(-100) : [],
    });
  } catch (error) {
    console.error("Milo history error:", error);
    return res.status(500).json({
      message: "Could not load Milo chat history.",
    });
  }
});

// Send a message to Milo and save the conversation
router.post("/chat", authMiddleware, async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "Gemini API key is not configured.",
      });
    }

    const { message } = req.body;

    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 2000
    ) {
      return res.status(400).json({
        message: "Please provide a valid message.",
      });
    }

    const conversation = await Conversation.findOne({
      user: req.user._id,
    });

    const previousMessages = conversation
      ? conversation.messages.slice(-12)
      : [];

    const contents = previousMessages.map((item) => ({
      role: item.role,
      parts: [{ text: item.text }],
    }));

    contents.push({
      role: "user",
      parts: [{ text: message.trim() }],
    });

    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        maxOutputTokens: 500,
      },
    });

    const reply = response.text;

    if (!reply) {
      throw new Error("Gemini returned an empty response.");
    }

    let savedConversation = conversation;

    if (!savedConversation) {
      savedConversation = new Conversation({
        user: req.user._id,
        messages: [],
      });
    }

    savedConversation.messages.push(
      { role: "user", text: message.trim() },
      { role: "model", text: reply }
    );

    // Keep only the latest 100 messages
    if (savedConversation.messages.length > 100) {
      savedConversation.messages =
        savedConversation.messages.slice(-100);
    }

    await savedConversation.save();

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Milo AI error:", error);

    return res.status(500).json({
      message: "Milo could not respond. Please try again.",
    });
  }
});

// Clear the logged-in user's chat history
router.delete("/history", authMiddleware, async (req, res) => {
  try {
    await Conversation.findOneAndDelete({
      user: req.user._id,
    });

    return res.status(200).json({
      message: "Milo chat history cleared successfully.",
    });
  } catch (error) {
    console.error("Milo history deletion error:", error);

    return res.status(500).json({
      message: "Could not clear Milo chat history.",
    });
  }
});

module.exports = router;
