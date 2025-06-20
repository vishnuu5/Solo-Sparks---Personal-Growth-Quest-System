"use client"

import { useState, useEffect } from "react"
import { useQuest } from "../context/QuestContext"
import { Trophy, Sparkles, Gift, Crown, Star, Zap } from "lucide-react"
import { rewardAPI } from "../services/api"
import toast from "react-hot-toast"

const Rewards = () => {
    const { sparkPoints } = useQuest()
    const [rewards, setRewards] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRewards()
    }, [])

    const fetchRewards = async () => {
        try {
            const response = await rewardAPI.getRewards()
            setRewards(response.data.rewards)
        } catch (error) {
            console.error("Error fetching rewards:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleRedeem = async (rewardId) => {
        try {
            await rewardAPI.redeemReward(rewardId)
            toast.success("Reward redeemed successfully!")
            fetchRewards()
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to redeem reward")
        }
    }

    const getRewardIcon = (type) => {
        switch (type) {
            case "profile_boost":
                return Crown
            case "exclusive_content":
                return Star
            case "special_badge":
                return Trophy
            case "premium_feature":
                return Zap
            default:
                return Gift
        }
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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Rewards Store</h1>
                    <p className="text-gray-600 mb-6">Redeem your Spark Points for exclusive rewards</p>

                    <div className="inline-flex items-center space-x-3 bg-primary-50 px-6 py-3 rounded-full">
                        <Sparkles className="h-6 w-6 text-primary-500" />
                        <span className="text-xl font-bold text-primary-700">{sparkPoints} Spark Points</span>
                    </div>
                </div>

                {/* Rewards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rewards.map((reward) => {
                        const IconComponent = getRewardIcon(reward.type)
                        const canAfford = sparkPoints >= reward.cost

                        return (
                            <div key={reward._id} className="card group hover:shadow-xl transition-shadow duration-300">
                                <div className="text-center mb-4">
                                    <div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${canAfford ? "bg-primary-100" : "bg-gray-100"
                                            }`}
                                    >
                                        <IconComponent className={`h-8 w-8 ${canAfford ? "text-primary-600" : "text-gray-400"}`} />
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{reward.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{reward.description}</p>

                                    <div className="flex items-center justify-center space-x-2 mb-4">
                                        <Sparkles className="h-4 w-4 text-primary-500" />
                                        <span className="font-bold text-primary-700">{reward.cost} points</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleRedeem(reward._id)}
                                    disabled={!canAfford || reward.redeemed}
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${reward.redeemed
                                            ? "bg-green-100 text-green-700 cursor-not-allowed"
                                            : canAfford
                                                ? "btn-primary"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    {reward.redeemed ? "Redeemed" : canAfford ? "Redeem" : "Not Enough Points"}
                                </button>
                            </div>
                        )
                    })}
                </div>

                {/* Empty State */}
                {rewards.length === 0 && (
                    <div className="text-center py-12">
                        <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No rewards available</h3>
                        <p className="text-gray-600">Complete more quests to unlock exclusive rewards!</p>
                    </div>
                )}

                {/* Reward Categories */}
                <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="card text-center">
                        <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-900 mb-2">Profile Boosts</h4>
                        <p className="text-sm text-gray-600">Enhance your profile visibility and features</p>
                    </div>

                    <div className="card text-center">
                        <Star className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-900 mb-2">Exclusive Content</h4>
                        <p className="text-sm text-gray-600">Access premium growth content and resources</p>
                    </div>

                    <div className="card text-center">
                        <Trophy className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-900 mb-2">Special Badges</h4>
                        <p className="text-sm text-gray-600">Show off your achievements with unique badges</p>
                    </div>

                    <div className="card text-center">
                        <Zap className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-900 mb-2">Premium Features</h4>
                        <p className="text-sm text-gray-600">Unlock advanced app features and tools</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Rewards
