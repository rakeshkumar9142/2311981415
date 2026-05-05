const express = require("express");
const asyncHandler = require("../../utils/asyncHandler");
const { getDepotSchedules } = require("../controllers/vehicleScheduling.controller");
const { Log } = require("../../logging_middleware/logger");

const router = express.Router();

router.get(
  "/schedule",
  asyncHandler(async (req, res) => {
    await Log("backend", "debug", "route", "Route /api/vehicles/schedule called");
    await getDepotSchedules(req, res);
  })
);

module.exports = router;
