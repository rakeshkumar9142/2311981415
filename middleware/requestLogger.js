const { Log } = require("../logging_middleware/logger");

async function requestLogger(req, res, next) {
  const start = Date.now();
  await Log("backend", "info", "middleware", `Incoming request ${req.method} ${req.originalUrl}`);

  res.on("finish", async () => {
    const duration = Date.now() - start;
    await Log(
      "backend",
      "info",
      "middleware",
      `Completed ${req.method} ${req.originalUrl} with ${res.statusCode} in ${duration}ms`
    );
  });

  next();
}

module.exports = requestLogger;
