import express from "express";
import Quest from "../models/Quest.js";
import User from "../models/User.js";
import { upload } from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";
import { generateQuestForUser } from "../utils/questGenerator.js";

const router = express.Router();

// Get user's quests
router.get("/", async (req, res) => {
  try {
    const quests = await Quest.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    const currentQuest = await Quest.findOne({
      userId: req.user._id,
      completed: false,
      $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }],
    }).sort({ createdAt: -1 });

    res.json({
      quests,
      currentQuest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Generate new quest
router.post("/generate", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const quest = await generateQuestForUser(user);

    res.json({
      message: "Quest generated successfully",
      quest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Complete quest
router.post(
  "/:questId/complete",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { questId } = req.params;
      const { text } = req.body;

      const quest = await Quest.findOne({
        _id: questId,
        userId: req.user._id,
        completed: false,
      });

      if (!quest) {
        return res
          .status(404)
          .json({ message: "Quest not found or already completed" });
      }

      // Upload files to Cloudinary if provided
      let imageUrl = null;
      let audioUrl = null;

      if (req.files?.image) {
        const imageResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { resource_type: "image", folder: "solo-sparks/reflections" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(req.files.image[0].buffer);
        });
        imageUrl = imageResult.secure_url;
      }

      if (req.files?.audio) {
        const audioResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { resource_type: "video", folder: "solo-sparks/reflections" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(req.files.audio[0].buffer);
        });
        audioUrl = audioResult.secure_url;
      }

      // Update quest
      quest.completed = true;
      quest.completedAt = new Date();
      quest.reflection = {
        text: text || "",
        imageUrl,
        audioUrl,
      };
      await quest.save();

      // Update user stats
      const user = await User.findById(req.user._id);
      user.sparkPoints += quest.points;
      user.totalQuestsCompleted += 1;

      // Update streak
      const today = new Date();
      const lastQuestDate = user.lastQuestDate;

      if (lastQuestDate) {
        const daysDiff = Math.floor(
          (today - lastQuestDate) / (1000 * 60 * 60 * 24)
        );
        if (daysDiff === 1) {
          user.currentStreak += 1;
          if (user.currentStreak > user.longestStreak) {
            user.longestStreak = user.currentStreak;
          }
        } else if (daysDiff > 1) {
          user.currentStreak = 1;
        }
      } else {
        user.currentStreak = 1;
      }

      user.lastQuestDate = today;
      await user.save();

      res.json({
        message: "Quest completed successfully",
        pointsEarned: quest.points,
        quest,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Get spark points
router.get("/points", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("sparkPoints");
    res.json({ points: user.sparkPoints });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
