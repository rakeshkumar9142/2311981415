const express = require("express");
const asyncHandler = require("../../utils/asyncHandler");
const { Log } = require("../../logging_middleware/logger");
const { fetchPriorityInbox } = require("../controllers/priorityInbox.controller");

const router = express.Router();

router.get(
  "/top-unread",
  asyncHandler(async (req, res) => {
    await Log("backend", "debug", "route", "Route /api/priority-inbox/top-unread called");
    await fetchPriorityInbox(req, res);
  })
);

module.exports = router;
