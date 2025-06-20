export const errorHandler = (err, req, res, next) => {
  console.error("🚨 Error occurred:");
  console.error("   Path:", req.path);
  console.error("   Method:", req.method);
  console.error("   Error:", err.message);
  console.error("   Stack:", err.stack);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format",
      error: "INVALID_ID",
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `${field} already exists`,
      error: "DUPLICATE_FIELD",
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      message: "Validation failed",
      errors: errors,
      error: "VALIDATION_ERROR",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Invalid authentication token",
      error: "INVALID_TOKEN",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Authentication token expired",
      error: "TOKEN_EXPIRED",
    });
  }

  // Multer errors (file upload)
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "File too large. Maximum size is 10MB",
      error: "FILE_TOO_LARGE",
    });
  }

  // Default server error
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
    error: "SERVER_ERROR",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
