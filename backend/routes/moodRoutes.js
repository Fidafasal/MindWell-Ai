
const express = require("express");
const Mood = require("../models/Mood");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// SAVE A MOOD CHECK-IN
router.post("/", protect, async (req, res) => {
  try {
    const {
      mood,
      stress,
      note,
      sleepHours,
      waterGlasses,
      steps,
      weight,
      weightUnit,
      date
    } = req.body;

    const checkin = await Mood.create({
      user: req.user._id,
      mood,
      stress,
      note,
      sleepHours,
      waterGlasses,
      steps,
      weight,
      weightUnit,
      date: date || new Date()
    });

    res.status(201).json({
      message: "Mood check-in saved successfully",
      checkin
    });

  } catch (error) {
    res.status(400).json({
      message: "Unable to save mood check-in",
      error: error.message
    });
  }
});

// GET LOGGED-IN USER'S MOOD HISTORY
router.get("/", protect, async (req, res) => {
  try {
    const checkins = await Mood.find({
      user: req.user._id
    }).sort({ date: -1 });

    res.status(200).json({
      message: "Mood history retrieved successfully",
      count: checkins.length,
      checkins
    });

  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve mood history",
      error: error.message
    });
  }
});

// DELETE A MOOD CHECK-IN
router.delete("/:id", protect, async (req, res) => {
  try {
    const checkin = await Mood.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!checkin) {
      return res.status(404).json({
        message: "Mood check-in not found"
      });
    }

    res.status(200).json({
      message: "Mood check-in deleted successfully"
    });

  } catch (error) {
    res.status(400).json({
      message: "Unable to delete mood check-in",
      error: error.message
    });
  }
});

module.exports = router;

