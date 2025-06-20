import mongoose from "mongoose";

const moodEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mood: {
      type: String,
      required: true,
      enum: [
        "happy",
        "sad",
        "anxious",
        "calm",
        "excited",
        "tired",
        "frustrated",
        "inspired",
        "thoughtful",
      ],
    },
    intensity: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    triggers: [
      {
        type: String,
      },
    ],
    activities: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
moodEntrySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("MoodEntry", moodEntrySchema);
