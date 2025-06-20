import express from "express";
import Quest from "../models/Quest.js";
import User from "../models/User.js";

const router = express.Router();

// Get user progress data
router.get("/progress", async (req, res) => {
  try {
    const userId = req.user._id;

    // Get weekly progress (last 7 days)
    const weeklyProgress = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const completedQuests = await Quest.find({
        userId,
        completed: true,
        completedAt: {
          $gte: date,
          $lt: nextDate,
        },
      });

      const points = completedQuests.reduce(
        (sum, quest) => sum + quest.points,
        0
      );

      weeklyProgress.push({
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        points,
        quests: completedQuests.length,
      });
    }

    // Get monthly stats (last 6 months)
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);

      const nextMonth = new Date(date);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const completed = await Quest.countDocuments({
        userId,
        completed: true,
        completedAt: {
          $gte: date,
          $lt: nextMonth,
        },
      });

      monthlyStats.push({
        month: date.toLocaleDateString("en-US", { month: "short" }),
        completed,
      });
    }

    // Get achievements
    const user = await User.findById(userId).select("achievements");
    const achievements = user.achievements || [];

    // Calculate growth metrics
    const totalQuests = await Quest.countDocuments({ userId, completed: true });
    const totalPoints = await Quest.aggregate([
      { $match: { userId, completed: true } },
      { $group: { _id: null, total: { $sum: "$points" } } },
    ]);

    const growthMetrics = {
      totalQuests,
      currentStreak: req.user.currentStreak,
      totalPoints: totalPoints[0]?.total || 0,
      growthScore: Math.min(100, Math.floor((totalQuests / 50) * 100)), // Example calculation
    };

    res.json({
      weeklyProgress,
      monthlyStats,
      achievements,
      growthMetrics,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get user stats
router.get("/stats", async (req, res) => {
  try {
    const userId = req.user._id;

    const completedQuests = await Quest.countDocuments({
      userId,
      completed: true,
    });
    const totalReflections = await Quest.countDocuments({
      userId,
      completed: true,
      "reflection.text": { $exists: true, $ne: "" },
    });

    const user = await User.findById(userId).select(
      "currentStreak sparkPoints"
    );

    // Calculate growth score based on various factors
    const growthScore = Math.min(
      100,
      Math.floor(
        completedQuests * 2 + user.currentStreak * 5 + totalReflections * 3
      )
    );

    res.json({
      completedQuests,
      currentStreak: user.currentStreak,
      totalReflections,
      growthScore,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
