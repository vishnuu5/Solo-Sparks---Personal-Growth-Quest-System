
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useQuest } from "../context/QuestContext"
import { Sparkles, Target, Trophy, TrendingUp, Calendar, Heart, AlertCircle } from "lucide-react"
import { analyticsAPI } from "../services/api"
import OnboardingButton from "../components/OnboardingButton"
import toast from "react-hot-toast"

const Dashboard = () => {
    const { user } = useAuth()
    const { currentQuest, sparkPoints, loading, completeQuest, generateNewQuest } = useQuest()
    const navigate = useNavigate()
    const [stats, setStats] = useState({
        completedQuests: 0,
        currentStreak: 0,
        totalReflections: 0,
        growthScore: 0,
    })
    const [completingQuest, setCompletingQuest] = useState(false)
    const [skippingQuest, setSkippingQuest] = useState(false)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const response = await analyticsAPI.getStats()
            setStats(response.data)
        } catch (error) {
            console.error("Error fetching stats:", error)
        }
    }

    const handleCompleteQuest = () => {
        if (currentQuest) {
            navigate("/quests")
        }
    }

    const handleSkipQuest = async () => {
        if (!currentQuest) return

        setSkippingQuest(true)
        try {
            await generateNewQuest()
            toast.success("Quest skipped! New quest generated.")
        } catch (error) {
            toast.error("Failed to skip quest. Please try again.")
        } finally {
            setSkippingQuest(false)
        }
    }

    const handleGenerateQuest = async () => {
        try {
            await generateNewQuest()
            toast.success("New quest generated!")
        } catch (error) {
            toast.error("Failed to generate quest. Please try again.")
        }
    }

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Good morning"
        if (hour < 17) return "Good afternoon"
        return "Good evening"
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {getGreeting()}, {user?.name}! ✨
                    </h1>
                    <p className="text-gray-600 mt-2">Ready to continue your growth journey today?</p>
                </div>

                {/* Onboarding Alert */}
                {!user?.onboardingCompleted && (
                    <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <AlertCircle className="h-5 w-5 text-yellow-600" />
                                <div>
                                    <h3 className="text-sm font-medium text-yellow-800">Complete Your Profile Setup</h3>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Complete the onboarding process to unlock personalized quests and start your growth journey.
                                    </p>
                                </div>
                            </div>
                            <OnboardingButton />
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-primary-100">
                                <Sparkles className="h-6 w-6 text-primary-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Spark Points</p>
                                <p className="text-2xl font-bold text-gray-900">{sparkPoints}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-secondary-100">
                                <Target className="h-6 w-6 text-secondary-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Completed Quests</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.completedQuests}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100">
                                <Calendar className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.currentStreak} days</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Growth Score</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.growthScore}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Quest Section */}
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="card">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Today's Quest</h2>
                                <div className="flex items-center space-x-2 text-primary-600">
                                    <Target className="h-5 w-5" />
                                    <span className="text-sm font-medium">Active</span>
                                </div>
                            </div>

                            {!user?.onboardingCompleted ? (
                                <div className="text-center py-8">
                                    <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Complete Setup First</h3>
                                    <p className="text-gray-600 mb-4">
                                        Complete your profile setup to start receiving personalized quests.
                                    </p>
                                    <OnboardingButton />
                                </div>
                            ) : currentQuest ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
                                        <h3 className="font-semibold text-gray-900 mb-2">{currentQuest.title}</h3>
                                        <p className="text-gray-700 mb-3">{currentQuest.description}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Sparkles className="h-4 w-4" />
                                                <span>{currentQuest.points} points</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <Heart className="h-4 w-4" />
                                                <span>{currentQuest.category}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex space-x-4">
                                        <button onClick={handleCompleteQuest} className="btn-primary flex-1" disabled={completingQuest}>
                                            {completingQuest ? "Completing..." : "Complete Quest"}
                                        </button>
                                        <button
                                            onClick={handleSkipQuest}
                                            disabled={skippingQuest}
                                            className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            {skippingQuest ? "Skipping..." : "Skip for Today"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Quest</h3>
                                    <p className="text-gray-600 mb-4">
                                        Generate a new personalized quest to continue your growth journey.
                                    </p>
                                    <button onClick={handleGenerateQuest} className="btn-primary">
                                        Generate New Quest
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <div className="card">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate("/quests")}
                                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
                                >
                                    <div className="p-2 bg-primary-100 rounded-lg">
                                        <Target className="h-4 w-4 text-primary-600" />
                                    </div>
                                    <span className="font-medium text-gray-900">View All Quests</span>
                                </button>

                                <button
                                    onClick={() => navigate("/rewards")}
                                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
                                >
                                    <div className="p-2 bg-secondary-100 rounded-lg">
                                        <Trophy className="h-4 w-4 text-secondary-600" />
                                    </div>
                                    <span className="font-medium text-gray-900">Browse Rewards</span>
                                </button>

                                <button
                                    onClick={() => navigate("/progress")}
                                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
                                >
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <TrendingUp className="h-4 w-4 text-green-600" />
                                    </div>
                                    <span className="font-medium text-gray-900">View Progress</span>
                                </button>

                                <button
                                    onClick={() => navigate("/profile")}
                                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
                                >
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Heart className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <span className="font-medium text-gray-900">Edit Profile</span>
                                </button>
                            </div>
                        </div>

                        {/* Profile Status */}
                        <div className="card">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Onboarding</span>
                                    {user?.onboardingCompleted ? (
                                        <span className="text-green-600 text-sm font-medium">✓ Complete</span>
                                    ) : (
                                        <span className="text-yellow-600 text-sm font-medium">⚠ Pending</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Profile Data</span>
                                    {user?.personalityTraits?.length > 0 ? (
                                        <span className="text-green-600 text-sm font-medium">✓ Complete</span>
                                    ) : (
                                        <span className="text-gray-400 text-sm font-medium">○ Empty</span>
                                    )}
                                </div>
                            </div>
                            {!user?.onboardingCompleted && (
                                <div className="mt-4">
                                    <OnboardingButton className="w-full justify-center" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
