
const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    mood: {
      type: String,
      required: true,
      enum: [
        "Good",
        "Happy",
        "Calm",
        "Angry",
        "Sad",
        "Anxious",
        "Tired",
        "Stressed",
        "Bored",
      ],
    },

    stress: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    note: {
      type: String,
      trim: true,
      default: "",
    },

    sleepHours: {
      type: Number,
      default: null,
      min: 0,
      max: 24,
    },

    waterGlasses: {
      type: Number,
      default: null,
      min: 0,
      max: 40,
    },

    steps: {
      type: Number,
      default: null,
      min: 0,
      max: 100000,
    },

    weight: {
      type: Number,
      default: null,
      min: 0.1,
      max: 500,
    },

    weightUnit: {
      type: String,
      enum: ["kg", "lb"],
      default: null,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Efficiently retrieve a user's check-ins in newest-first order.
moodSchema.index({ user: 1, date: -1 });

const Mood = mongoose.model("Mood", moodSchema);

module.exports = Mood;
