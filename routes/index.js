const express = require("express");
const { Log } = require("../logging_middleware/logger");
const vehicleSchedulingRoutes = require("../vehicle_scheduling/routes/vehicleScheduling.routes");
const priorityInboxRoutes = require("../priority_inbox/routes/priorityInbox.routes");

const router = express.Router();

router.get("/health", async (req, res) => {
  await Log("backend", "info", "route", "Health route called");
  res.status(200).json({ success: true, message: "Service is healthy" });
});

router.use("/vehicles", vehicleSchedulingRoutes);
router.use("/priority-inbox", priorityInboxRoutes);

module.exports = router;
