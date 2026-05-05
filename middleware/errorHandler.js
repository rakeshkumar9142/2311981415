const { Log } = require("../logging_middleware/logger");

async function errorHandler(err, req, res, next) {
  await Log(
    "backend",
    "error",
    "middleware",
    `Unhandled error on ${req.method} ${req.originalUrl}: ${err.message}`
  );

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
}

module.exports = errorHandler;
