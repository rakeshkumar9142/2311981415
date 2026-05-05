# Afford Medical Backend Assessment

Node.js + Express backend implementation for:
- Mandatory evaluation API-based logging middleware
- Vehicle maintenance scheduler (0/1 knapsack)
- Priority inbox notifications (heap/priority queue)
- Notification system design documentation

## Folder Structure

```text
project-root/
  config/
    env.js
  common/
    evaluationApiClient.js
  logging_middleware/
    logger.js
  middleware/
    requestLogger.js
    errorHandler.js
  utils/
    asyncHandler.js
  vehicle_scheduling/
    domain/knapsack.js
    services/vehicleScheduling.service.js
    controllers/vehicleScheduling.controller.js
    routes/vehicleScheduling.routes.js
  priority_inbox/
    domain/notificationHeap.js
    services/priorityInbox.service.js
    controllers/priorityInbox.controller.js
    routes/priorityInbox.routes.js
  routes/
    index.js
  server.js
  notification_system_design.md
  postman_collection.json
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```
Update the values for:
- `EVALUATION_ACCESS_TOKEN`
- `EVALUATION_CLIENT_ID`
- `EVALUATION_CLIENT_SECRET`

3. Start server:
```bash
npm start
```

## APIs

- `GET /api/health`
- `GET /api/vehicles/schedule`
- `GET /api/priority-inbox/top-unread?n=5`

## Logging Notes

- Logging strictly uses evaluation API (`POST /evaluation-service/logs`).
- No `console.log` calls used for application logging.
- Logging integrated in middleware, routes, controllers, services, and API client interceptors.

## Sample Outputs

### Vehicle Scheduling Output (sample shape)
```json
{
  "success": true,
  "message": "Vehicle schedules generated successfully",
  "data": [
    {
      "depotId": "D1",
      "mechanicHours": 8,
      "totalScheduledDuration": 8,
      "maximumImpact": 63,
      "selectedTasks": [
        { "TaskID": "T2", "Duration": 3, "Impact": 24 }
      ]
    }
  ]
}
```

### Priority Inbox Output (sample shape)
```json
{
  "success": true,
  "message": "Priority inbox generated successfully",
  "count": 5,
  "data": [
    {
      "ID": "N45",
      "Type": "Placement",
      "Message": "Interview slot released",
      "Timestamp": "2026-05-05T07:22:00.000Z"
    }
  ]
}
```

## Screenshots

Run both APIs in Postman and save response screenshots as required by your assessment portal.
