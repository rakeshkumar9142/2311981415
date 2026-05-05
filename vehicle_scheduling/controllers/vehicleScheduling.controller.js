const { buildDepotSchedules } = require("../services/vehicleScheduling.service");
const { Log } = require("../../logging_middleware/logger");

async function getDepotSchedules(req, res) {
  await Log("backend", "info", "controller", "Vehicle scheduling endpoint hit");
  const schedules = await buildDepotSchedules();

  res.status(200).json({
    success: true,
    message: "Vehicle schedules generated successfully",
    data: schedules
  });
}

module.exports = {
  getDepotSchedules
};
