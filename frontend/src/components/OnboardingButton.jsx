

import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Settings, CheckCircle } from "lucide-react"

const OnboardingButton = ({ className = "" }) => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleClick = () => {
        navigate("/onboarding")
    }

    if (user?.onboardingCompleted) {
        return (
            <button
                onClick={handleClick}
                className={`flex items-center space-x-2 text-green-600 hover:text-green-700 ${className}`}
            >
                <CheckCircle className="h-4 w-4" />
                <span>Update Profile</span>
            </button>
        )
    }

    return (
        <button
            onClick={handleClick}
            className={`flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors ${className}`}
        >
            <Settings className="h-4 w-4" />
            <span>Complete Setup</span>
        </button>
    )
}

export default OnboardingButton
