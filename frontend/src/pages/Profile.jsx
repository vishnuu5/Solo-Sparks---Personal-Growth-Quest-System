"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { User, Mail, Edit, Save, X } from "lucide-react"
import { authAPI } from "../services/api"
import toast from "react-hot-toast"

const Profile = () => {
    const { user, updateUser } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        bio: user?.bio || "",
        personalityTraits: user?.personalityTraits || [],
        emotionalNeeds: user?.emotionalNeeds || [],
        interests: user?.interests || [],
        goals: user?.goals || [],
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const response = await authAPI.updateProfile(formData)
            updateUser(response.data.user)
            toast.success("Profile updated successfully!")
            setIsEditing(false)
        } catch (error) {
            toast.error("Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setFormData({
            name: user?.name || "",
            email: user?.email || "",
            bio: user?.bio || "",
            personalityTraits: user?.personalityTraits || [],
            emotionalNeeds: user?.emotionalNeeds || [],
            interests: user?.interests || [],
            goals: user?.goals || [],
        })
        setIsEditing(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="card">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                                <User className="h-8 w-8 text-primary-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                                <p className="text-gray-600">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="flex space-x-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900"
                                    >
                                        <X className="h-4 w-4" />
                                        <span>Cancel</span>
                                    </button>
                                    <button onClick={handleSave} disabled={loading} className="btn-primary flex items-center space-x-2">
                                        <Save className="h-4 w-4" />
                                        <span>{loading ? "Saving..." : "Save"}</span>
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="btn-primary flex items-center space-x-2">
                                    <Edit className="h-4 w-4" />
                                    <span>Edit Profile</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            {isEditing ? (
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" />
                            ) : (
                                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                    <User className="h-4 w-4 text-gray-400" />
                                    <span>{user?.name}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span>{user?.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell us about yourself..."
                                className="input-field h-24 resize-none"
                            />
                        ) : (
                            <div className="p-3 bg-gray-50 rounded-lg min-h-[96px]">{user?.bio || "No bio added yet."}</div>
                        )}
                    </div>

                    {/* Psychology Profile */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Psychology Profile</h3>

                        {/* Personality Traits */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Personality Traits</h4>
                            <div className="flex flex-wrap gap-2">
                                {(user?.personalityTraits || []).map((trait, index) => (
                                    <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                                        {trait}
                                    </span>
                                ))}
                                {(!user?.personalityTraits || user.personalityTraits.length === 0) && (
                                    <span className="text-gray-500 text-sm">No traits selected</span>
                                )}
                            </div>
                        </div>

                        {/* Emotional Needs */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Emotional Needs</h4>
                            <div className="flex flex-wrap gap-2">
                                {(user?.emotionalNeeds || []).map((need, index) => (
                                    <span key={index} className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">
                                        {need}
                                    </span>
                                ))}
                                {(!user?.emotionalNeeds || user.emotionalNeeds.length === 0) && (
                                    <span className="text-gray-500 text-sm">No needs selected</span>
                                )}
                            </div>
                        </div>

                        {/* Interests */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Interests</h4>
                            <div className="flex flex-wrap gap-2">
                                {(user?.interests || []).map((interest, index) => (
                                    <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                        {interest}
                                    </span>
                                ))}
                                {(!user?.interests || user.interests.length === 0) && (
                                    <span className="text-gray-500 text-sm">No interests selected</span>
                                )}
                            </div>
                        </div>

                        {/* Goals */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Growth Goals</h4>
                            <div className="flex flex-wrap gap-2">
                                {(user?.goals || []).map((goal, index) => (
                                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                        {goal}
                                    </span>
                                ))}
                                {(!user?.goals || user.goals.length === 0) && (
                                    <span className="text-gray-500 text-sm">No goals selected</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
