const env = require("../../config/env");
const { Log } = require("../../logging_middleware/logger");
const { getTopUnreadNotifications } = require("../services/priorityInbox.service");

async function fetchPriorityInbox(req, res) {
  const requestedN = Number(req.query.n || env.defaultTopN);
  const limit = Number.isInteger(requestedN) && requestedN > 0 ? requestedN : env.defaultTopN;

  await Log("backend", "info", "controller", `Priority inbox endpoint hit with n=${limit}`);
  const notifications = await getTopUnreadNotifications(limit);

  res.status(200).json({
    success: true,
    message: "Priority inbox generated successfully",
    count: notifications.length,
    data: notifications
  });
}

module.exports = {
  fetchPriorityInbox
};
