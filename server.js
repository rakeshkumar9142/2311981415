const express = require("express");
const env = require("./config/env");
const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");
const routes = require("./routes");
const { Log } = require("./logging_middleware/logger");

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use("/api", routes);
app.use(errorHandler);

app.listen(env.port, async () => {
  await Log("backend", "info", "config", `Server started on port ${env.port}`);
});
