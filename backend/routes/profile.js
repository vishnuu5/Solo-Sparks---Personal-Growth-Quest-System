import express from "express";
import User from "../models/User.js";
import MoodEntry from "../models/MoodEntry.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Update psychology profile
router.put(
  "/psychology",
  [
    body("personalityTraits")
      .optional()
      .isArray()
      .withMessage("Personality traits must be an array"),
    body("emotionalNeeds")
      .optional()
      .isArray()
      .withMessage("Emotional needs must be an array"),
    body("interests")
      .optional()
      .isArray()
      .withMessage("Interests must be an array"),
    body("goals").optional().isArray().withMessage("Goals must be an array"),
    body("currentMood")
      .optional()
      .isString()
      .withMessage("Current mood must be a string"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      console.log("Updating psychology profile for user:", req.user._id);
      console.log("Profile data received:", req.body);

      const updates = req.body;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            ...updates,
            onboardingCompleted: true,
          },
        },
        { new: true, runValidators: true }
      ).select("-password");

      console.log("Updated user:", user);

      res.json({
        message: "Psychology profile updated successfully",
        user,
      });
    } catch (error) {
      console.error("Psychology profile update error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Add mood entry
router.post(
  "/mood",
  [
    body("mood").isIn([
      "happy",
      "sad",
      "anxious",
      "calm",
      "excited",
      "tired",
      "frustrated",
      "inspired",
      "thoughtful",
    ]),
    body("intensity").isInt({ min: 1, max: 10 }),
    body("notes").optional().isLength({ max: 500 }),
    body("triggers").optional().isArray(),
    body("activities").optional().isArray(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const moodEntry = new MoodEntry({
        userId: req.user._id,
        ...req.body,
      });

      await moodEntry.save();

      // Update user's current mood
      await User.findByIdAndUpdate(req.user._id, {
        currentMood: req.body.mood,
      });

      res.status(201).json({
        message: "Mood entry added successfully",
        moodEntry,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get mood history
router.get("/mood-history", async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number.parseInt(days));

    const moodHistory = await MoodEntry.find({
      userId: req.user._id,
      createdAt: { $gte: startDate },
    }).sort({ createdAt: -1 });

    res.json({ moodHistory });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
