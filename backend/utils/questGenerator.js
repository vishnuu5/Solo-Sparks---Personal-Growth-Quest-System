import Quest from "../models/Quest.js";

// Quest templates organized by category and personality traits
const questTemplates = {
  "self-love": [
    {
      title: "Mirror Affirmation Challenge",
      description:
        "Look in the mirror and say three genuine compliments to yourself. Focus on your character, not just appearance.",
      points: 15,
      difficulty: "easy",
    },
    {
      title: "Solo Date Adventure",
      description:
        "Take yourself on a proper date. Dress up, go somewhere nice, and enjoy your own company without distractions.",
      points: 25,
      difficulty: "medium",
    },
    {
      title: "Self-Forgiveness Letter",
      description:
        "Write a compassionate letter to yourself, forgiving past mistakes and acknowledging your growth.",
      points: 20,
      difficulty: "medium",
    },
  ],
  mindfulness: [
    {
      title: "Sunset Meditation",
      description:
        "Find a peaceful spot to watch the sunset. Spend 10 minutes in silent reflection about your day.",
      points: 15,
      difficulty: "easy",
    },
    {
      title: "Mindful Eating Experience",
      description:
        "Eat one meal today in complete silence, focusing on every taste, texture, and sensation.",
      points: 20,
      difficulty: "medium",
    },
    {
      title: "Digital Detox Hour",
      description:
        "Spend one hour completely disconnected from all devices. Use this time for self-reflection.",
      points: 18,
      difficulty: "medium",
    },
  ],
  creativity: [
    {
      title: "Express Your Emotions",
      description:
        "Create something artistic (draw, write, sing, dance) that represents how you feel right now.",
      points: 22,
      difficulty: "medium",
    },
    {
      title: "Random Acts of Beauty",
      description:
        "Create something beautiful and leave it for a stranger to find (origami, chalk art, etc.).",
      points: 25,
      difficulty: "medium",
    },
    {
      title: "Memory Lane Creation",
      description:
        "Create a visual representation of your favorite childhood memory using any medium you choose.",
      points: 20,
      difficulty: "easy",
    },
  ],
  social: [
    {
      title: "Compliment a Stranger",
      description:
        "Give a genuine, thoughtful compliment to someone you don't know. Notice how it makes you both feel.",
      points: 18,
      difficulty: "medium",
    },
    {
      title: "Reconnect with Someone",
      description:
        "Reach out to someone you haven't spoken to in a while. Share something meaningful about your life.",
      points: 20,
      difficulty: "easy",
    },
    {
      title: "Practice Active Listening",
      description:
        "Have a conversation where you focus entirely on listening without planning your response.",
      points: 15,
      difficulty: "easy",
    },
  ],
  physical: [
    {
      title: "Nature Walk Reflection",
      description:
        "Take a 30-minute walk in nature without music or podcasts. Focus on your thoughts and surroundings.",
      points: 15,
      difficulty: "easy",
    },
    {
      title: "Body Appreciation Exercise",
      description:
        "Do a gentle stretching routine while mentally thanking each part of your body for what it does.",
      points: 18,
      difficulty: "easy",
    },
    {
      title: "Dance Like Nobody's Watching",
      description:
        "Put on your favorite music and dance freely for 10 minutes. Let go of self-consciousness.",
      points: 20,
      difficulty: "medium",
    },
  ],
  emotional: [
    {
      title: "Emotion Mapping",
      description:
        "Create a visual map of your emotions today. Use colors, shapes, or words to represent your feelings.",
      points: 20,
      difficulty: "medium",
    },
    {
      title: "Gratitude Deep Dive",
      description:
        "Write about three things you're grateful for and explain in detail why each one matters to you.",
      points: 15,
      difficulty: "easy",
    },
    {
      title: "Fear Facing Exercise",
      description:
        "Identify one small fear and take a tiny step toward facing it today. Reflect on the experience.",
      points: 25,
      difficulty: "hard",
    },
  ],
};

// Function to select appropriate quest based on user profile
export const generateQuestForUser = async (user) => {
  try {
    // Get user's recent quests to avoid repetition
    const recentQuests = await Quest.find({
      userId: user._id,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
    }).select("title category");

    const recentTitles = recentQuests.map((q) => q.title);
    const recentCategories = recentQuests.map((q) => q.category);

    // Determine preferred categories based on user profile
    let preferredCategories = [];

    if (
      user.emotionalNeeds?.includes("Self-love") ||
      user.goals?.includes("Practice self-love")
    ) {
      preferredCategories.push("self-love");
    }

    if (
      user.emotionalNeeds?.includes("Inner peace") ||
      user.interests?.includes("Meditation")
    ) {
      preferredCategories.push("mindfulness");
    }

    if (
      user.personalityTraits?.includes("Creative") ||
      user.interests?.includes("Art & Creativity")
    ) {
      preferredCategories.push("creativity");
    }

    if (
      user.personalityTraits?.includes("Extroverted") ||
      user.emotionalNeeds?.includes("Connection")
    ) {
      preferredCategories.push("social");
    }

    if (
      user.interests?.includes("Fitness & Wellness") ||
      user.interests?.includes("Nature & Outdoors")
    ) {
      preferredCategories.push("physical");
    }

    if (
      user.goals?.includes("Improve emotional intelligence") ||
      user.emotionalNeeds?.includes("Emotional balance")
    ) {
      preferredCategories.push("emotional");
    }

    // If no preferred categories, use all categories
    if (preferredCategories.length === 0) {
      preferredCategories = Object.keys(questTemplates);
    }

    // Filter out recently used categories (but not completely)
    const availableCategories = preferredCategories.filter((cat) => {
      const recentCount = recentCategories.filter((rc) => rc === cat).length;
      return recentCount < 2; // Allow max 2 quests per category in last 7 days
    });

    const selectedCategory =
      availableCategories.length > 0
        ? availableCategories[
            Math.floor(Math.random() * availableCategories.length)
          ]
        : preferredCategories[
            Math.floor(Math.random() * preferredCategories.length)
          ];

    // Get available quests from selected category
    const categoryQuests = questTemplates[selectedCategory];
    const availableQuests = categoryQuests.filter(
      (quest) => !recentTitles.includes(quest.title)
    );

    // If all quests in category were recent, allow any quest from category
    const questPool =
      availableQuests.length > 0 ? availableQuests : categoryQuests;

    // Select random quest from pool
    const selectedTemplate =
      questPool[Math.floor(Math.random() * questPool.length)];

    // Adjust points based on user's current mood and difficulty preference
    let adjustedPoints = selectedTemplate.points;

    if (user.currentMood === "sad" || user.currentMood === "anxious") {
      adjustedPoints += 5; // Bonus points for completing quests when feeling down
    }

    // Create and save the quest
    const quest = new Quest({
      userId: user._id,
      title: selectedTemplate.title,
      description: selectedTemplate.description,
      category: selectedCategory,
      difficulty: selectedTemplate.difficulty,
      points: adjustedPoints,
      questType: "daily",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
    });

    await quest.save();
    return quest;
  } catch (error) {
    console.error("Error generating quest:", error);
    throw error;
  }
};

// Function to generate weekly quest (more challenging)
export const generateWeeklyQuest = async (user) => {
  const weeklyTemplates = [
    {
      title: "Week of Self-Discovery",
      description:
        "Each day this week, try one new activity that you've never done before. Document your experiences.",
      category: "self-love",
      points: 50,
      difficulty: "medium",
    },
    {
      title: "Mindfulness Challenge",
      description:
        "Practice 10 minutes of mindfulness meditation every day for a week. Track your progress.",
      category: "mindfulness",
      points: 60,
      difficulty: "hard",
    },
    {
      title: "Creative Expression Week",
      description:
        "Create something artistic every day for a week. It can be anything - writing, drawing, music, etc.",
      category: "creativity",
      points: 55,
      difficulty: "medium",
    },
  ];

  const selectedTemplate =
    weeklyTemplates[Math.floor(Math.random() * weeklyTemplates.length)];

  const quest = new Quest({
    userId: user._id,
    title: selectedTemplate.title,
    description: selectedTemplate.description,
    category: selectedTemplate.category,
    difficulty: selectedTemplate.difficulty,
    points: selectedTemplate.points,
    questType: "weekly",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
  });

  await quest.save();
  return quest;
};
