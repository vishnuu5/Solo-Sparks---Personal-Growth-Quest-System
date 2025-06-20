"use client"

import { useState } from "react"
import { useQuest } from "../context/QuestContext"
import { Target, Clock, Sparkles, Camera, Mic, FileText, CheckCircle } from "lucide-react"
import toast from "react-hot-toast"

const Quests = () => {
    const { quests, currentQuest, completeQuest, generateNewQuest, loading } = useQuest()
    const [showReflectionModal, setShowReflectionModal] = useState(false)
    const [selectedQuest, setSelectedQuest] = useState(null)
    const [reflection, setReflection] = useState({
        text: "",
        image: null,
        audio: null,
    })

    const handleCompleteQuest = (quest) => {
        setSelectedQuest(quest)
        setShowReflectionModal(true)
    }

    const submitReflection = async () => {
        try {
            const formData = new FormData()
            formData.append("text", reflection.text)
            if (reflection.image) formData.append("image", reflection.image)
            if (reflection.audio) formData.append("audio", reflection.audio)

            await completeQuest(selectedQuest._id, formData)
            toast.success(`Quest completed! You earned ${selectedQuest.points} Spark Points!`)
            setShowReflectionModal(false)
            setReflection({ text: "", image: null, audio: null })
        } catch (error) {
            toast.error("Failed to complete quest. Please try again.")
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Your Quests</h1>
                        <p className="text-gray-600 mt-2">Complete quests to earn Spark Points and grow</p>
                    </div>
                    <button onClick={handleGenerateQuest} className="btn-primary flex items-center space-x-2">
                        <Target className="h-4 w-4" />
                        <span>Generate New Quest</span>
                    </button>
                </div>

                {/* Current Quest */}
                {currentQuest && (
                    <div className="card mb-8 border-l-4 border-l-primary-500">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Current Quest</h2>
                            <div className="flex items-center space-x-2 text-primary-600">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm font-medium">Active</span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-lg mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentQuest.title}</h3>
                            <p className="text-gray-700 mb-4">{currentQuest.description}</p>

                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                        <Sparkles className="h-4 w-4" />
                                        <span>{currentQuest.points} points</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Target className="h-4 w-4" />
                                        <span>{currentQuest.category}</span>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => handleCompleteQuest(currentQuest)} className="btn-primary w-full">
                                Complete Quest
                            </button>
                        </div>
                    </div>
                )}

                {/* Quest History */}
                <div className="card">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Quest History</h2>

                    {quests.length === 0 ? (
                        <div className="text-center py-8">
                            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No quests yet</h3>
                            <p className="text-gray-600">Generate your first quest to start your growth journey!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {quests.map((quest) => (
                                <div key={quest._id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h3 className="font-semibold text-gray-900">{quest.title}</h3>
                                                {quest.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                                            </div>
                                            <p className="text-gray-600 mb-3">{quest.description}</p>

                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <Sparkles className="h-4 w-4" />
                                                    <span>{quest.points} points</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Target className="h-4 w-4" />
                                                    <span>{quest.category}</span>
                                                </div>
                                                <span>{new Date(quest.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="ml-4">
                                            {quest.completed ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Completed
                                                </span>
                                            ) : (
                                                <button onClick={() => handleCompleteQuest(quest)} className="btn-primary text-sm px-4 py-2">
                                                    Complete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Reflection Modal */}
            {showReflectionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Share Your Reflection</h2>
                            <p className="text-gray-600 mb-6">
                                How did completing "{selectedQuest?.title}" make you feel? Share your thoughts, photos, or voice notes.
                            </p>

                            <div className="space-y-6">
                                {/* Text Reflection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FileText className="h-4 w-4 inline mr-1" />
                                        Written Reflection
                                    </label>
                                    <textarea
                                        value={reflection.text}
                                        onChange={(e) => setReflection((prev) => ({ ...prev, text: e.target.value }))}
                                        placeholder="Share your thoughts and feelings about this quest..."
                                        className="input-field h-32 resize-none"
                                    />
                                </div>

                                {/* Photo Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Camera className="h-4 w-4 inline mr-1" />
                                        Photo (Optional)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setReflection((prev) => ({ ...prev, image: e.target.files[0] }))}
                                        className="input-field"
                                    />
                                </div>

                                {/* Audio Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Mic className="h-4 w-4 inline mr-1" />
                                        Voice Note (Optional)
                                    </label>
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        onChange={(e) => setReflection((prev) => ({ ...prev, audio: e.target.files[0] }))}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-4 mt-8">
                                <button
                                    onClick={() => setShowReflectionModal(false)}
                                    className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 py-3 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitReflection}
                                    disabled={!reflection.text.trim()}
                                    className="flex-1 btn-primary py-3 disabled:opacity-50"
                                >
                                    Complete Quest
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Quests
