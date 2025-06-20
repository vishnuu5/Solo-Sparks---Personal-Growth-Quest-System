"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { questAPI } from "../services/api"
import { useAuth } from "./AuthContext"

const QuestContext = createContext()

export const useQuest = () => {
    const context = useContext(QuestContext)
    if (!context) {
        throw new Error("useQuest must be used within a QuestProvider")
    }
    return context
}

export const QuestProvider = ({ children }) => {
    const [quests, setQuests] = useState([])
    const [currentQuest, setCurrentQuest] = useState(null)
    const [sparkPoints, setSparkPoints] = useState(0)
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        if (user) {
            fetchQuests()
            fetchSparkPoints()
        }
    }, [user])

    const fetchQuests = async () => {
        try {
            setLoading(true)
            const response = await questAPI.getQuests()
            setQuests(response.data.quests)
            setCurrentQuest(response.data.currentQuest)
        } catch (error) {
            console.error("Error fetching quests:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchSparkPoints = async () => {
        try {
            const response = await questAPI.getSparkPoints()
            setSparkPoints(response.data.points)
        } catch (error) {
            console.error("Error fetching spark points:", error)
        }
    }

    const completeQuest = async (questId, reflection) => {
        try {
            const response = await questAPI.completeQuest(questId, reflection)
            setSparkPoints((prev) => prev + response.data.pointsEarned)
            await fetchQuests()
            return response.data
        } catch (error) {
            throw error
        }
    }

    const generateNewQuest = async () => {
        try {
            const response = await questAPI.generateQuest()
            setCurrentQuest(response.data.quest)
            return response.data
        } catch (error) {
            throw error
        }
    }

    const value = {
        quests,
        currentQuest,
        sparkPoints,
        loading,
        fetchQuests,
        completeQuest,
        generateNewQuest,
        fetchSparkPoints,
    }

    return <QuestContext.Provider value={value}>{children}</QuestContext.Provider>
}
