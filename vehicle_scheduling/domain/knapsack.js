function optimizeVehiclesForDepot(mechanicHours, vehicles) {
  const capacity = Math.max(0, Number(mechanicHours) || 0);
  const n = vehicles.length;

  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
  const take = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(false));

  for (let i = 1; i <= n; i += 1) {
    const duration = Number(vehicles[i - 1].Duration) || 0;
    const impact = Number(vehicles[i - 1].Impact) || 0;

    for (let h = 0; h <= capacity; h += 1) {
      dp[i][h] = dp[i - 1][h];
      if (duration <= h && dp[i - 1][h - duration] + impact > dp[i][h]) {
        dp[i][h] = dp[i - 1][h - duration] + impact;
        take[i][h] = true;
      }
    }
  }

  const selectedVehicles = [];
  let h = capacity;
  for (let i = n; i >= 1; i -= 1) {
    if (take[i][h]) {
      const item = vehicles[i - 1];
      selectedVehicles.push(item);
      h -= Number(item.Duration) || 0;
    }
  }

  selectedVehicles.reverse();

  return {
    totalImpact: dp[n][capacity],
    totalDuration: selectedVehicles.reduce((sum, v) => sum + (Number(v.Duration) || 0), 0),
    selectedVehicles
  };
}

module.exports = {
  optimizeVehiclesForDepot
};
