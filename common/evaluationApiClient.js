const axios = require("axios");
const env = require("../config/env");
const { Log } = require("../logging_middleware/logger");

const evaluationApiClient = axios.create({
  baseURL: env.evaluationBaseUrl,
  timeout: 10000,
  headers: {
    Authorization: env.evaluationAccessToken ? `Bearer ${env.evaluationAccessToken}` : "",
    "x-client-id": env.evaluationClientId,
    "x-client-secret": env.evaluationClientSecret
  }
});

evaluationApiClient.interceptors.request.use(async (config) => {
  await Log(
    "backend",
    "debug",
    "service",
    `External API request ${config.method.toUpperCase()} ${config.url}`
  );
  return config;
});

evaluationApiClient.interceptors.response.use(
  async (response) => {
    await Log(
      "backend",
      "debug",
      "service",
      `External API response ${response.status} for ${response.config.url}`
    );
    return response;
  },
  async (error) => {
    const status = error.response ? error.response.status : "NO_STATUS";
    const url = error.config ? error.config.url : "UNKNOWN_URL";
    await Log("backend", "error", "service", `External API failed ${status} for ${url}`);
    return Promise.reject(error);
  }
);

module.exports = evaluationApiClient;
