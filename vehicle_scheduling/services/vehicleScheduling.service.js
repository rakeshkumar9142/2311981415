const evaluationApiClient = require("../../common/evaluationApiClient");
const { Log } = require("../../logging_middleware/logger");
const { optimizeVehiclesForDepot } = require("../domain/knapsack");

function normalizeDepot(rawDepot) {
  return {
    ID: rawDepot.ID,
    MechanicHours: Number(rawDepot.MechanicHours) || 0
  };
}

function normalizeVehicle(rawVehicle) {
  return {
    TaskID: rawVehicle.TaskID,
    Duration: Number(rawVehicle.Duration) || 0,
    Impact: Number(rawVehicle.Impact) || 0
  };
}

async function buildDepotSchedules() {
  await Log("backend", "info", "service", "Starting depot scheduling computation");

  const [depotResponse, vehicleResponse] = await Promise.all([
    evaluationApiClient.get("/depots"),
    evaluationApiClient.get("/vehicles")
  ]);

  const depots = (depotResponse.data || []).map(normalizeDepot);
  const vehicles = (vehicleResponse.data || []).map(normalizeVehicle);

  const schedules = depots.map((depot) => {
    const optimized = optimizeVehiclesForDepot(depot.MechanicHours, vehicles);
    return {
      depotId: depot.ID,
      mechanicHours: depot.MechanicHours,
      totalScheduledDuration: optimized.totalDuration,
      maximumImpact: optimized.totalImpact,
      selectedTasks: optimized.selectedVehicles
    };
  });

  await Log("backend", "info", "service", `Computed schedules for ${schedules.length} depots`);
  return schedules;
}

module.exports = {
  buildDepotSchedules
};
