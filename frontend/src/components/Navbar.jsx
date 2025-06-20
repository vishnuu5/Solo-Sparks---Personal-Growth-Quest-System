
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useQuest } from "../context/QuestContext"
import { Sparkles, Menu, X, User, LogOut, Trophy, Target, BarChart3 } from "lucide-react"

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { user, logout } = useAuth()
    const { sparkPoints } = useQuest()
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    const navItems = [
        { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
        { path: "/quests", label: "Quests", icon: Target },
        { path: "/rewards", label: "Rewards", icon: Trophy },
        { path: "/progress", label: "Progress", icon: BarChart3 },
    ]

    return (
        <nav className="bg-white shadow-lg border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center space-x-2">
                            <Sparkles className="h-8 w-8 text-primary-500" />
                            <span className="text-xl font-bold text-gray-900">Solo Sparks</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                                            ? "text-primary-600 bg-primary-50"
                                            : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Spark Points & User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-primary-50 px-3 py-1 rounded-full">
                            <Sparkles className="h-4 w-4 text-primary-500" />
                            <span className="text-sm font-medium text-primary-700">{sparkPoints}</span>
                        </div>

                        <div className="relative group">
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                                <User className="h-5 w-5" />
                                <span className="text-sm font-medium">{user?.name}</span>
                            </button>

                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Profile Settings
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <LogOut className="h-4 w-4 inline mr-2" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900 focus:outline-none">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${location.pathname === item.path
                                            ? "text-primary-600 bg-primary-50"
                                            : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}

                        <div className="border-t pt-4">
                            <div className="flex items-center justify-between px-3 py-2">
                                <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                                <div className="flex items-center space-x-2 bg-primary-50 px-2 py-1 rounded-full">
                                    <Sparkles className="h-4 w-4 text-primary-500" />
                                    <span className="text-sm font-medium text-primary-700">{sparkPoints}</span>
                                </div>
                            </div>

                            <Link
                                to="/profile"
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            >
                                Profile Settings
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            >
                                <LogOut className="h-4 w-4 inline mr-2" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
