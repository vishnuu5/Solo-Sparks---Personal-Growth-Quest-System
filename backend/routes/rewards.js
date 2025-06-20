import express from "express";
import { Reward, UserReward } from "../models/Reward.js";
import User from "../models/User.js";

const router = express.Router();

// Get available rewards
router.get("/", async (req, res) => {
  try {
    const rewards = await Reward.find({ isActive: true });
    const userRewards = await UserReward.find({ userId: req.user._id });

    const rewardsWithStatus = rewards.map((reward) => ({
      ...reward.toObject(),
      redeemed: userRewards.some(
        (ur) => ur.rewardId.toString() === reward._id.toString()
      ),
    }));

    res.json({ rewards: rewardsWithStatus });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Redeem reward
router.post("/:rewardId/redeem", async (req, res) => {
  try {
    const { rewardId } = req.params;

    const reward = await Reward.findById(rewardId);
    if (!reward || !reward.isActive) {
      return res.status(404).json({ message: "Reward not found" });
    }

    // Check if already redeemed
    const existingRedemption = await UserReward.findOne({
      userId: req.user._id,
      rewardId,
    });

    if (existingRedemption) {
      return res.status(400).json({ message: "Reward already redeemed" });
    }

    // Check if user has enough points
    const user = await User.findById(req.user._id);
    if (user.sparkPoints < reward.cost) {
      return res.status(400).json({ message: "Insufficient Spark Points" });
    }

    // Deduct points and create redemption record
    user.sparkPoints -= reward.cost;
    await user.save();

    const userReward = new UserReward({
      userId: req.user._id,
      rewardId,
    });
    await userReward.save();

    res.json({
      message: "Reward redeemed successfully",
      remainingPoints: user.sparkPoints,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
