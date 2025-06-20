import { Sparkles } from "lucide-react"

const LoadingSpinner = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-bounce-gentle mb-4">
                    <Sparkles className="h-12 w-12 text-primary-500 mx-auto" />
                </div>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading your journey...</p>
            </div>
        </div>
    )
}

export default LoadingSpinner
