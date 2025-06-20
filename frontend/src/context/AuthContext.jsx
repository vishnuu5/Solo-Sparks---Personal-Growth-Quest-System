"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../services/api"

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem("token")

                if (!token) {
                    setLoading(false)
                    return
                }

                // Verify token with backend
                const response = await authAPI.verifyToken()
                setUser(response.data.user)
            } catch (error) {
                console.log("Token verification failed:", error.response?.status)
                // Clear invalid token
                localStorage.removeItem("token")
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        initializeAuth()
    }, [])

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password)
            const { token, user } = response.data

            localStorage.setItem("token", token)
            setUser(user)

            return response.data
        } catch (error) {
            throw error
        }
    }

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData)
            const { token, user } = response.data

            localStorage.setItem("token", token)
            setUser(user)

            return response.data
        } catch (error) {
            throw error
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
    }

    const updateUser = (userData) => {
        setUser((prev) => ({ ...prev, ...userData }))
    }

    const value = {
        user,
        login,
        register,
        logout,
        updateUser,
        loading,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
