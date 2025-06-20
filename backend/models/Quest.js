import mongoose from "mongoose";

const questSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "self-love",
        "mindfulness",
        "creativity",
        "social",
        "physical",
        "emotional",
        "spiritual",
      ],
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    points: {
      type: Number,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    reflection: {
      text: String,
      imageUrl: String,
      audioUrl: String,
    },
    questType: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "daily",
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
questSchema.index({ userId: 1, completed: 1 });
questSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Quest", questSchema);
