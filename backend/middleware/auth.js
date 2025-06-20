import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
        error: "NO_TOKEN",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Access denied. Invalid token format.",
        error: "INVALID_TOKEN_FORMAT",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET not configured");
      return res.status(500).json({
        message: "Server configuration error",
        error: "SERVER_CONFIG_ERROR",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Access denied. User not found.",
        error: "USER_NOT_FOUND",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("🔐 Auth middleware error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Access denied. Invalid token.",
        error: "INVALID_TOKEN",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Access denied. Token expired.",
        error: "TOKEN_EXPIRED",
      });
    }

    res.status(500).json({
      message: "Authentication error",
      error: "AUTH_ERROR",
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      if (token && process.env.JWT_SECRET) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // For optional auth, we don't return errors, just continue without user
    next();
  }
};
