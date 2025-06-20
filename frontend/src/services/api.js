import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - token expired or invalid
      const currentPath = window.location.pathname;

      // Only show error if user is trying to access protected routes
      if (
        currentPath !== "/" &&
        currentPath !== "/login" &&
        currentPath !== "/register"
      ) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } else if (error.response?.status === 503) {
      // Service unavailable - database not connected
      toast.error("Service temporarily unavailable. Please try again later.");
    } else if (error.code === "ECONNABORTED") {
    
      toast.error("Request timeout. Please check your connection.");
    } else if (!error.response) {
    
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),
  verifyToken: () => api.get("/auth/verify"),
  updateProfile: (userData) => api.put("/auth/profile", userData),
};

export const questAPI = {
  getQuests: () => api.get("/quests"),
  generateQuest: () => api.post("/quests/generate"),
  completeQuest: (questId, reflection) =>
    api.post(`/quests/${questId}/complete`, reflection),
  getSparkPoints: () => api.get("/quests/points"),
};

export const rewardAPI = {
  getRewards: () => api.get("/rewards"),
  redeemReward: (rewardId) => api.post(`/rewards/${rewardId}/redeem`),
};

export const profileAPI = {
  updatePsychProfile: (profileData) =>
    api.put("/profile/psychology", profileData),
  getMoodHistory: () => api.get("/profile/mood-history"),
  updateMood: (moodData) => api.post("/profile/mood", moodData),
};

export const analyticsAPI = {
  getProgress: () => api.get("/analytics/progress"),
  getStats: () => api.get("/analytics/stats"),
};

export default api;
