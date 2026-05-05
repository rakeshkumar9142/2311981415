const axios = require("axios");
const env = require("../config/env");

const ALLOWED_STACKS = new Set(["backend"]);
const ALLOWED_LEVELS = new Set(["error", "debug", "info", "warn", "fatal"]);
const ALLOWED_PACKAGES = new Set([
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service",
  "auth",
  "config",
  "middleware",
  "utils"
]);

async function Log(stack, level, packageName, message) {
  try {
    const safeStack = ALLOWED_STACKS.has(stack) ? stack : "backend";
    const safeLevel = ALLOWED_LEVELS.has(level) ? level : "info";
    const safePackage = ALLOWED_PACKAGES.has(packageName) ? packageName : "utils";
    const safeMessage = typeof message === "string" ? message.slice(0, 300) : "Invalid log message";

    await axios.post(
      env.evaluationLogsUrl,
      {
        stack: safeStack,
        level: safeLevel,
        package: safePackage,
        message: safeMessage
      },
      {
        headers: {
          Authorization: env.evaluationAccessToken ? `Bearer ${env.evaluationAccessToken}` : "",
          "x-client-id": env.evaluationClientId,
          "x-client-secret": env.evaluationClientSecret,
          "Content-Type": "application/json"
        },
        timeout: 7000
      }
    );
  } catch (error) {
    // Keep the app resilient even if external logging API is unavailable.
  }
}

module.exports = {
  Log
};
