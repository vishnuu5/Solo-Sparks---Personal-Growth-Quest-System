import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Import routes
import authRoutes from "./routes/auth.js";
import questRoutes from "./routes/quests.js";
import rewardRoutes from "./routes/rewards.js";
import profileRoutes from "./routes/profile.js";
import analyticsRoutes from "./routes/analytics.js";

// Import middleware
import { errorHandler } from "./middleware/errorHandler.js";
import { authMiddleware } from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

// Enhanced security middleware for production
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: isProduction
      ? {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
            connectSrc: ["'self'"],
          },
        }
      : false,
  })
);

// CORS configuration for production
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:3000", // Keep for development
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Enhanced rate limiting for production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 100 : 1000, // Stricter in production
  message: {
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 5 : 50, // Very strict for auth
  message: {
    message: "Too many authentication attempts, please try again later.",
  },
});

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Trust proxy for production (important for rate limiting and IP detection)
if (isProduction) {
  app.set("trust proxy", 1);
}

// MongoDB connection with production optimizations
let isConnected = false;

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    // console.log("🔄 Attempting to connect to MongoDB...");

    // Updated connection options for current Mongoose version
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    await mongoose.connect(mongoURI, options);

    isConnected = true;
    console.log("✅ Connected to MongoDB successfully!");
    // console.log(`📊 Database: ${mongoose.connection.name}`);

    // Seed default rewards after successful connection
    setTimeout(async () => {
      try {
        const { seedRewards } = await import("./utils/seedRewards.js");
        await seedRewards();
      } catch (seedError) {
        console.log("⚠️  Reward seeding skipped:", seedError.message);
      }
    }, 1000);
  } catch (error) {
    isConnected = false;
    console.error("❌ MongoDB connection failed:", error.message);

    // In production, exit if database connection fails
    if (isProduction) {
      console.error(
        "🚨 Database connection required in production. Exiting..."
      );
      process.exit(1);
    }
  }
};

// Handle MongoDB connection events
mongoose.connection.on("connected", () => {
  isConnected = true;
  console.log("🔗 Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  isConnected = false;
  console.error("❌ Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  isConnected = false;
  console.log("🔌 Mongoose disconnected");
});

// Connect to database
connectDB();

// Health check endpoint
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText =
    {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    }[dbStatus] || "unknown";

  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database: {
      status: dbStatusText,
      connected: isConnected,
      name: mongoose.connection.name || "not connected",
    },
    server: {
      port: PORT,
      uptime: process.uptime(),
    },
  });
});

// Database check middleware
const requireDB = (req, res, next) => {
  if (!isConnected) {
    return res.status(503).json({
      message: "Database not connected. Service temporarily unavailable.",
      error: "SERVICE_UNAVAILABLE",
    });
  }
  next();
};

// Routes with enhanced rate limiting for auth
app.use("/api/auth", requireDB, authLimiter, authRoutes);
app.use("/api/quests", requireDB, authMiddleware, questRoutes);
app.use("/api/rewards", requireDB, authMiddleware, rewardRoutes);
app.use("/api/profile", requireDB, authMiddleware, profileRoutes);
app.use("/api/analytics", requireDB, authMiddleware, analyticsRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🎉 Solo Sparks API",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    status: "running",
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Graceful shutdown...`);
  try {
    await mongoose.connection.close();
    console.log("📊 MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Solo Sparks Backend Server`);
  // console.log(`📍 Server: http://localhost:${PORT}`);
  // console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  // console.log(`⚙️  Environment: ${process.env.NODE_ENV || "development"}`);
  // console.log(
  //   `🌐 Frontend: ${process.env.FRONTEND_URL || "http://localhost:3000"}`
  // );

  if (isProduction) {
    console.log(`🔒 Production mode: Enhanced security enabled`);
  }
});
