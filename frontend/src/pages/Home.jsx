import { Link } from "react-router-dom"
import { Sparkles, Heart, Target, Trophy, ArrowRight } from "lucide-react"

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <div className="text-center">
                        <div className="flex justify-center mb-8">
                            <div className="animate-bounce-gentle">
                                <Sparkles className="h-16 w-16 text-primary-500" />
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Discover Your
                            <span className="text-transparent bg-clip-text gradient-bg"> Inner Spark</span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Embark on a personalized journey of self-discovery. Complete meaningful quests, build emotional
                            intelligence, and fall in love with yourself through Solo Sparks.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="btn-primary text-lg px-8 py-4 rounded-xl flex items-center justify-center space-x-2 group transform hover:scale-105 transition-transform"
                            >
                                <span>Start Your Journey</span>
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                to="/login"
                                className="bg-white text-primary-600 border-2 border-primary-200 hover:border-primary-300 font-medium py-4 px-8 rounded-xl transition-colors duration-200 transform hover:scale-105"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Personal Growth Companion</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Intelligent quests designed to help you understand yourself better and build lasting self-love.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="card text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Target className="h-8 w-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalized Quests</h3>
                            <p className="text-gray-600">
                                AI-powered quest generation based on your personality, mood, and growth goals.
                            </p>
                        </div>

                        <div className="card text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Heart className="h-8 w-8 text-secondary-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Emotional Intelligence</h3>
                            <p className="text-gray-600">
                                Build self-awareness and emotional intelligence through reflective activities.
                            </p>
                        </div>

                        <div className="card text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Trophy className="h-8 w-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Reward System</h3>
                            <p className="text-gray-600">
                                Earn Spark Points and unlock exclusive rewards as you complete your growth journey.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div className="animate-fade-in">
                            <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
                            <div className="text-gray-600">Active Users</div>
                        </div>
                        <div className="animate-fade-in">
                            <div className="text-3xl font-bold text-secondary-600 mb-2">50K+</div>
                            <div className="text-gray-600">Quests Completed</div>
                        </div>
                        <div className="animate-fade-in">
                            <div className="text-3xl font-bold text-primary-600 mb-2">95%</div>
                            <div className="text-gray-600">User Satisfaction</div>
                        </div>
                        <div className="animate-fade-in">
                            <div className="text-3xl font-bold text-secondary-600 mb-2">24/7</div>
                            <div className="text-gray-600">Support Available</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Solo Sparks Works</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Simple steps to start your personal growth journey
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                1
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Complete Your Profile</h3>
                            <p className="text-gray-600">
                                Tell us about your personality, goals, and current emotional state to get personalized quests.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-secondary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                2
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Complete Daily Quests</h3>
                            <p className="text-gray-600">
                                Receive personalized daily quests designed to help you grow and build self-awareness.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                3
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Your Growth</h3>
                            <p className="text-gray-600">
                                Earn Spark Points, unlock rewards, and watch your emotional intelligence grow over time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 gradient-bg">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Spark Your Growth?</h2>
                    <p className="text-xl text-white/90 mb-8">
                        Join thousands of people discovering their authentic selves through personalized growth quests.
                    </p>
                    <Link
                        to="/register"
                        className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-xl transition-colors duration-200 inline-flex items-center space-x-2 transform hover:scale-105"
                    >
                        <span>Get Started Free</span>
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home
