"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react"
import { profileAPI } from "../services/api"
import toast from "react-hot-toast"

const Onboarding = () => {
    const [currentStep, setCurrentStep] = useState(0)
    const [loading, setLoading] = useState(false)
    const { updateUser } = useAuth()
    const navigate = useNavigate()

    const [profileData, setProfileData] = useState({
        personalityTraits: [],
        emotionalNeeds: [],
        interests: [],
        goals: [],
        currentMood: "",
        preferredQuestTypes: [],
    })

    const steps = [
        {
            title: "Let's Get to Know You",
            subtitle: "Help us understand your personality",
            component: PersonalityStep,
        },
        {
            title: "Your Emotional Landscape",
            subtitle: "What do you need most right now?",
            component: EmotionalNeedsStep,
        },
        {
            title: "Your Interests",
            subtitle: "What activities bring you joy?",
            component: InterestsStep,
        },
        {
            title: "Your Growth Goals",
            subtitle: "What would you like to work on?",
            component: GoalsStep,
        },
        {
            title: "Current Mood Check",
            subtitle: "How are you feeling today?",
            component: MoodStep,
        },
    ]

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            handleComplete()
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleComplete = async () => {
        setLoading(true)
        try {
            await profileAPI.updatePsychProfile(profileData)
            updateUser({ onboardingCompleted: true })
            toast.success("Profile setup complete! Welcome to Solo Sparks!")
            navigate("/dashboard")
        } catch (error) {
            toast.error("Failed to save profile. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const updateProfileData = (key, value) => {
        setProfileData((prev) => ({
            ...prev,
            [key]: value,
        }))
    }

    const CurrentStepComponent = steps[currentStep].component

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Sparkles className="h-12 w-12 text-primary-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">{steps[currentStep].title}</h1>
                    <p className="text-gray-600 mt-2">{steps[currentStep].subtitle}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>
                            Step {currentStep + 1} of {steps.length}
                        </span>
                        <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Step Content */}
                <div className="card mb-8">
                    <CurrentStepComponent data={profileData} updateData={updateProfileData} />
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back</span>
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={loading}
                        className="btn-primary flex items-center space-x-2 px-6 py-3 disabled:opacity-50"
                    >
                        <span>{currentStep === steps.length - 1 ? "Complete Setup" : "Next"}</span>
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

// Step Components
const PersonalityStep = ({ data, updateData }) => {
    const traits = [
        "Introverted",
        "Extroverted",
        "Creative",
        "Analytical",
        "Adventurous",
        "Cautious",
        "Optimistic",
        "Realistic",
        "Spontaneous",
        "Organized",
    ]

    const toggleTrait = (trait) => {
        const current = data.personalityTraits || []
        const updated = current.includes(trait) ? current.filter((t) => t !== trait) : [...current, trait]
        updateData("personalityTraits", updated)
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select traits that describe you (choose 3-5):</h3>
            <div className="grid grid-cols-2 gap-3">
                {traits.map((trait) => (
                    <button
                        key={trait}
                        onClick={() => toggleTrait(trait)}
                        className={`p-3 rounded-lg border-2 transition-all ${(data.personalityTraits || []).includes(trait)
                                ? "border-primary-500 bg-primary-50 text-primary-700"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        {trait}
                    </button>
                ))}
            </div>
        </div>
    )
}

const EmotionalNeedsStep = ({ data, updateData }) => {
    const needs = [
        "Self-confidence",
        "Inner peace",
        "Emotional balance",
        "Self-love",
        "Stress relief",
        "Motivation",
        "Clarity",
        "Connection",
        "Joy",
        "Purpose",
    ]

    const toggleNeed = (need) => {
        const current = data.emotionalNeeds || []
        const updated = current.includes(need) ? current.filter((n) => n !== need) : [...current, need]
        updateData("emotionalNeeds", updated)
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What do you need most in your life right now? (select all that apply):
            </h3>
            <div className="grid grid-cols-2 gap-3">
                {needs.map((need) => (
                    <button
                        key={need}
                        onClick={() => toggleNeed(need)}
                        className={`p-3 rounded-lg border-2 transition-all ${(data.emotionalNeeds || []).includes(need)
                                ? "border-secondary-500 bg-secondary-50 text-secondary-700"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        {need}
                    </button>
                ))}
            </div>
        </div>
    )
}

const InterestsStep = ({ data, updateData }) => {
    const interests = [
        "Reading",
        "Writing",
        "Art & Creativity",
        "Music",
        "Nature & Outdoors",
        "Fitness & Wellness",
        "Cooking",
        "Photography",
        "Travel",
        "Learning",
        "Meditation",
        "Socializing",
    ]

    const toggleInterest = (interest) => {
        const current = data.interests || []
        const updated = current.includes(interest) ? current.filter((i) => i !== interest) : [...current, interest]
        updateData("interests", updated)
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What activities bring you joy? (select your favorites):
            </h3>
            <div className="grid grid-cols-2 gap-3">
                {interests.map((interest) => (
                    <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`p-3 rounded-lg border-2 transition-all ${(data.interests || []).includes(interest)
                                ? "border-primary-500 bg-primary-50 text-primary-700"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        {interest}
                    </button>
                ))}
            </div>
        </div>
    )
}

const GoalsStep = ({ data, updateData }) => {
    const goals = [
        "Build self-confidence",
        "Improve emotional intelligence",
        "Reduce stress",
        "Find inner peace",
        "Develop better habits",
        "Increase self-awareness",
        "Practice self-love",
        "Improve relationships",
        "Find life purpose",
        "Boost creativity",
    ]

    const toggleGoal = (goal) => {
        const current = data.goals || []
        const updated = current.includes(goal) ? current.filter((g) => g !== goal) : [...current, goal]
        updateData("goals", updated)
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What would you like to work on? (select your top priorities):
            </h3>
            <div className="grid grid-cols-1 gap-3">
                {goals.map((goal) => (
                    <button
                        key={goal}
                        onClick={() => toggleGoal(goal)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${(data.goals || []).includes(goal)
                                ? "border-green-500 bg-green-50 text-green-700"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        {goal}
                    </button>
                ))}
            </div>
        </div>
    )
}

const MoodStep = ({ data, updateData }) => {
    const moods = [
        { emoji: "😊", label: "Happy", value: "happy" },
        { emoji: "😌", label: "Calm", value: "calm" },
        { emoji: "😔", label: "Sad", value: "sad" },
        { emoji: "😰", label: "Anxious", value: "anxious" },
        { emoji: "😴", label: "Tired", value: "tired" },
        { emoji: "🤔", label: "Thoughtful", value: "thoughtful" },
        { emoji: "😤", label: "Frustrated", value: "frustrated" },
        { emoji: "✨", label: "Inspired", value: "inspired" },
    ]

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How are you feeling today?</h3>
            <div className="grid grid-cols-2 gap-4">
                {moods.map((mood) => (
                    <button
                        key={mood.value}
                        onClick={() => updateData("currentMood", mood.value)}
                        className={`p-4 rounded-lg border-2 transition-all text-center ${data.currentMood === mood.value
                                ? "border-primary-500 bg-primary-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        <div className="text-3xl mb-2">{mood.emoji}</div>
                        <div className="font-medium text-gray-900">{mood.label}</div>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Onboarding
