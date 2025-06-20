import { Reward } from "../models/Reward.js";

const defaultRewards = [
  {
    title: "Profile Spotlight",
    description: "Boost your profile visibility for 24 hours",
    cost: 100,
    type: "profile_boost",
    metadata: { duration: 24 },
  },
  {
    title: "Self-Love Champion Badge",
    description: 'Unlock a special "Self-Love Champion" badge for your profile',
    cost: 150,
    type: "special_badge",
    metadata: { badgeType: "self_love_champion" },
  },
  {
    title: "Premium Content Access",
    description: "Access exclusive self-growth articles and videos for 30 days",
    cost: 200,
    type: "exclusive_content",
    metadata: { duration: 30 },
  },
  {
    title: "Advanced Analytics",
    description: "Unlock detailed progress analytics and insights",
    cost: 250,
    type: "premium_feature",
    metadata: { feature: "advanced_analytics" },
  },
  {
    title: "Custom Quest Creator",
    description: "Create and customize your own personal growth quests",
    cost: 300,
    type: "premium_feature",
    metadata: { feature: "custom_quests" },
  },
  {
    title: "Mindfulness Master Badge",
    description: "Special badge for completing 50 mindfulness quests",
    cost: 500,
    type: "special_badge",
    metadata: { badgeType: "mindfulness_master" },
  },
  {
    title: "Growth Guru Status",
    description: "Unlock exclusive Growth Guru status and special features",
    cost: 750,
    type: "premium_feature",
    metadata: { feature: "guru_status" },
  },
  {
    title: "Emotional Intelligence Badge",
    description: "Badge for mastering emotional intelligence quests",
    cost: 400,
    type: "special_badge",
    metadata: { badgeType: "emotional_intelligence" },
  },
];

export const seedRewards = async () => {
  try {
    console.log("🌱 Checking rewards database...");

    const existingRewards = await Reward.countDocuments();

    if (existingRewards === 0) {
      console.log("📦 Seeding default rewards...");
      await Reward.insertMany(defaultRewards);
      console.log(`✅ Successfully seeded ${defaultRewards.length} rewards`);
    } else {
      console.log(
        `📊 Found ${existingRewards} existing rewards, skipping seed`
      );
    }
  } catch (error) {
    console.error("❌ Error seeding rewards:", error.message);
    throw error;
  }
};
