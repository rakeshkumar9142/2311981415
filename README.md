# Afford Medical Backend Assessment

Production-grade backend implementation for Afford Medical assessment built using **Node.js**, **Express.js**, and clean architecture principles.

## Features

- Mandatory Evaluation API Logging Middleware
- Vehicle Maintenance Scheduler (0/1 Knapsack Optimization)
- Priority Inbox Notification System (Max Heap / Priority Queue)
- Scalable Notification System Design Documentation

---

## Logging Middleware

Integrated mandatory logging middleware that sends logs directly to:

```bash
POST /evaluation-service/logs
```

### Logging Coverage

- Incoming request logging
- Response logging
- Error logging
- External API logging
- Service-level logging
- Controller-level logging

### Files

```bash
logging_middleware/logger.js
middleware/requestLogger.js
middleware/errorHandler.js
common/evaluationApiClient.js
```

---

## Vehicle Maintenance Scheduler

Optimizes maintenance tasks using **0/1 Knapsack Dynamic Programming**.

### Goal

```bash
Total Duration <= Available Mechanic Hours
```

### Complexity

- Time Complexity: `O(n * capacity)`
- Space Complexity: `O(n * capacity)`

### Files

```bash
vehicle_scheduling/domain/knapsack.js
vehicle_scheduling/services/vehicleScheduling.service.js
vehicle_scheduling/controllers/vehicleScheduling.controller.js
vehicle_scheduling/routes/vehicleScheduling.routes.js
```

---

## Priority Inbox System

Returns top unread notifications using **Max Heap**.

### Priority Order

- Placement
- Result
- Event

### Complexity

- Time Complexity: `O(n log n)`
- Space Complexity: `O(n)`

---

## Project Structure

```bash
project-root/
├── config/
├── common/
├── logging_middleware/
├── middleware/
├── utils/
├── vehicle_scheduling/
├── priority_inbox/
├── routes/
├── server.js
├── README.md
```

---

## API Endpoints

### Health Check

```bash
GET /api/health
```

### Vehicle Scheduler

```bash
GET /api/vehicles/schedule
```

### Priority Inbox

```bash
GET /api/priority-inbox/top-unread?n=5
```

---

## Setup

Install dependencies:

```bash
npm install
```

Create `.env`:

```bash
PORT=3000
EVALUATION_ACCESS_TOKEN=
EVALUATION_CLIENT_ID=
EVALUATION_CLIENT_SECRET=
```

Run server:

```bash
npm start
```

---

## System Design

Detailed architecture available in:

```bash
notification_system_design.md
```

Includes:

- API Design
- Database Design
- Retry Mechanism
- Queue Processing
- Dead Letter Queue
- Scalability Handling

---

## Known Limitation

External Afford authentication credentials were mismatched during final API verification.

Core implementation remains fully completed.

---

## Tech Stack

- Node.js
- Express.js
- Axios
- Dynamic Programming
- Heap / Priority Queue

---

## Author

**Rakesh Kumar**  
Chitkara University  
Roll No: 2311981415
