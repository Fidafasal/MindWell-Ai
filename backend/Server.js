
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const moodRoutes = require("./routes/moodRoutes");
const miloRoutes = require("./routes/miloRoutes");
const wellnessRoutes = require("./routes/wellnessRoutes");

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    credentials: true
  })
);

app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.send("MindWell AI backend server is working");
});

// API health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "MindWell AI API",
    message: "Backend is working successfully"
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Mood tracking routes
app.use("/api/moods", moodRoutes);

// Milo chat routes
app.use("/api/milo", miloRoutes);

// wellness tip
app.use("/api/wellness-feedback", wellnessRoutes);

// MongoDB connection and server startup
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB Atlas connected successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`MindWell AI server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
