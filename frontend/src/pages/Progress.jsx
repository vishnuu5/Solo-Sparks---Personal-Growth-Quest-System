"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Calendar, Target, Heart, Award, Sparkles } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { analyticsAPI } from "../services/api"

const Progress = () => {
    const [progressData, setProgressData] = useState({
        weeklyProgress: [],
        monthlyStats: [],
        achievements: [],
        growthMetrics: {},
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProgressData()
    }, [])

    const fetchProgressData = async () => {
        try {
            const response = await analyticsAPI.getProgress()
            setProgressData(response.data)
        } catch (error) {
            console.error("Error fetching progress data:", error)
        } finally {
            setLoading(false)
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Your Growth Journey</h1>
                    <p className="text-gray-600 mt-2">Track your progress and celebrate your achievements</p>
                </div>

                {/* Growth Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-primary-100">
                                <Target className="h-6 w-6 text-primary-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Quests Completed</p>
                                <p className="text-2xl font-bold text-gray-900">{progressData.growthMetrics.totalQuests || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-secondary-100">
                                <Calendar className="h-6 w-6 text-secondary-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                                <p className="text-2xl font-bold text-gray-900">{progressData.growthMetrics.currentStreak || 0} days</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Growth Score</p>
                                <p className="text-2xl font-bold text-gray-900">{progressData.growthMetrics.growthScore || 0}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100">
                                <Sparkles className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Points</p>
                                <p className="text-2xl font-bold text-gray-900">{progressData.growthMetrics.totalPoints || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    {/* Weekly Progress Chart */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={progressData.weeklyProgress}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="points" stroke="#ed7420" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Monthly Stats Chart */}
                    <div className="card">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Quest Completion</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={progressData.monthlyStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="completed" fill="#0ea5e9" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Achievements */}
                <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Achievements</h3>

                    {progressData.achievements.length === 0 ? (
                        <div className="text-center py-8">
                            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-gray-900 mb-2">No achievements yet</h4>
                            <p className="text-gray-600">Complete more quests to unlock achievements!</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {progressData.achievements.map((achievement, index) => (
                                <div
                                    key={index}
                                    className="flex items-center p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg"
                                >
                                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                                        <Award className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                                        <p className="text-sm text-gray-600">{achievement.description}</p>
                                        <p className="text-xs text-gray-500 mt-1">{new Date(achievement.earnedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Growth Categories */}
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="card text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="h-8 w-8 text-red-500" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Self-Love</h4>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                        <p className="text-sm text-gray-600">75% Progress</p>
                    </div>

                    <div className="card text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrendingUp className="h-8 w-8 text-blue-500" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Emotional Intelligence</h4>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                        </div>
                        <p className="text-sm text-gray-600">60% Progress</p>
                    </div>

                    <div className="card text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="h-8 w-8 text-green-500" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Self-Awareness</h4>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                        </div>
                        <p className="text-sm text-gray-600">85% Progress</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Progress
