const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  evaluationBaseUrl:
    process.env.EVALUATION_BASE_URL || "http://20.207.122.201/evaluation-service",
  evaluationAccessToken: process.env.EVALUATION_ACCESS_TOKEN || "",
  evaluationClientId: process.env.EVALUATION_CLIENT_ID || "",
  evaluationClientSecret: process.env.EVALUATION_CLIENT_SECRET || ""
};
