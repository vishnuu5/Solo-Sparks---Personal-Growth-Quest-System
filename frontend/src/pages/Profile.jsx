
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { User, Mail, Edit, Save, X, Settings, RefreshCw } from "lucide-react"
import { authAPI } from "../services/api"
import toast from "react-hot-toast"

const Profile = () => {
    const { user, updateUser } = useAuth()
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        bio: user?.bio || "",
        personalityTraits: user?.personalityTraits || [],
        emotionalNeeds: user?.emotionalNeeds || [],
        interests: user?.interests || [],
        goals: user?.goals || [],
    })

    // Update formData when user data changes
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                bio: user.bio || "",
                personalityTraits: user.personalityTraits || [],
                emotionalNeeds: user.emotionalNeeds || [],
                interests: user.interests || [],
                goals: user.goals || [],
            })
        }
    }, [user])

    const handleSave = async () => {
        setLoading(true)
        try {
            console.log("Updating profile with:", formData)
            const response = await authAPI.updateProfile(formData)
            console.log("Profile updated:", response.data)
            updateUser(response.data.user)
            toast.success("Profile updated successfully!")
            setIsEditing(false)
        } catch (error) {
            console.error("Profile update error:", error)
            toast.error("Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
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

    const handleCompleteOnboarding = () => {
        navigate("/onboarding")
    }

    const handleRefreshProfile = async () => {
        setRefreshing(true)
        try {
            const response = await authAPI.verifyToken()
            updateUser(response.data.user)
            toast.success("Profile refreshed!")
        } catch (error) {
            toast.error("Failed to refresh profile")
        } finally {
            setRefreshing(false)
        }
    }

    const hasProfileData = () => {
        return (
            (user?.personalityTraits && user.personalityTraits.length > 0) ||
            (user?.emotionalNeeds && user.emotionalNeeds.length > 0) ||
            (user?.interests && user.interests.length > 0) ||
            (user?.goals && user.goals.length > 0)
        )
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
                                {user?.onboardingCompleted ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                        Onboarding Complete
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                                        Onboarding Pending
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={handleRefreshProfile}
                                disabled={refreshing}
                                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                                <span>Refresh</span>
                            </button>

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

                    {/* Onboarding Alert */}
                    {!user?.onboardingCompleted && (
                        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-yellow-800">Complete Your Profile Setup</h3>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Complete the onboarding process to unlock personalized quests and features.
                                    </p>
                                </div>
                                <button
                                    onClick={handleCompleteOnboarding}
                                    className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Complete Setup
                                </button>
                            </div>
                        </div>
                    )}

                    {/* No Profile Data Alert */}
                    {user?.onboardingCompleted && !hasProfileData() && (
                        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-blue-800">Profile Data Missing</h3>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Your psychology profile seems to be empty. You can redo the onboarding to set it up.
                                    </p>
                                </div>
                                <button
                                    onClick={handleCompleteOnboarding}
                                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Setup Profile
                                </button>
                            </div>
                        </div>
                    )}

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
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Psychology Profile</h3>
                            {!user?.onboardingCompleted && (
                                <button
                                    onClick={handleCompleteOnboarding}
                                    className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
                                >
                                    <Settings className="h-4 w-4" />
                                    <span>Complete Setup</span>
                                </button>
                            )}
                        </div>

                        {/* Personality Traits */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Personality Traits</h4>
                            <div className="flex flex-wrap gap-2">
                                {user?.personalityTraits && user.personalityTraits.length > 0 ? (
                                    user.personalityTraits.map((trait, index) => (
                                        <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                                            {trait}
                                        </span>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-gray-500 text-sm italic">No personality traits selected yet</span>
                                        <button
                                            onClick={handleCompleteOnboarding}
                                            className="text-xs text-primary-600 hover:text-primary-700 underline"
                                        >
                                            Add traits
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Emotional Needs */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Emotional Needs</h4>
                            <div className="flex flex-wrap gap-2">
                                {user?.emotionalNeeds && user.emotionalNeeds.length > 0 ? (
                                    user.emotionalNeeds.map((need, index) => (
                                        <span key={index} className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">
                                            {need}
                                        </span>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-gray-500 text-sm italic">No emotional needs selected yet</span>
                                        <button
                                            onClick={handleCompleteOnboarding}
                                            className="text-xs text-primary-600 hover:text-primary-700 underline"
                                        >
                                            Add needs
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Interests */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Interests</h4>
                            <div className="flex flex-wrap gap-2">
                                {user?.interests && user.interests.length > 0 ? (
                                    user.interests.map((interest, index) => (
                                        <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                            {interest}
                                        </span>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-gray-500 text-sm italic">No interests selected yet</span>
                                        <button
                                            onClick={handleCompleteOnboarding}
                                            className="text-xs text-primary-600 hover:text-primary-700 underline"
                                        >
                                            Add interests
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Goals */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Growth Goals</h4>
                            <div className="flex flex-wrap gap-2">
                                {user?.goals && user.goals.length > 0 ? (
                                    user.goals.map((goal, index) => (
                                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                            {goal}
                                        </span>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-gray-500 text-sm italic">No growth goals selected yet</span>
                                        <button
                                            onClick={handleCompleteOnboarding}
                                            className="text-xs text-primary-600 hover:text-primary-700 underline"
                                        >
                                            Add goals
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Debug Info (remove in production) */}
                        {process.env.NODE_ENV === "development" && (
                            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                                <h5 className="font-medium text-gray-700 mb-2">Debug Info:</h5>
                                <pre className="text-xs text-gray-600 overflow-auto max-h-40">
                                    {JSON.stringify(
                                        {
                                            onboardingCompleted: user?.onboardingCompleted,
                                            personalityTraits: user?.personalityTraits,
                                            emotionalNeeds: user?.emotionalNeeds,
                                            interests: user?.interests,
                                            goals: user?.goals,
                                            hasProfileData: hasProfileData(),
                                        },
                                        null,
                                        2,
                                    )}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
