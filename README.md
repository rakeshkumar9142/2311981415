Afford Medical Backend Assessment

Production-grade backend implementation for Afford Medical assessment built using Node.js, Express.js, and clean architecture principles.

This project includes:

Mandatory Evaluation API Logging Middleware
Vehicle Maintenance Scheduler (0/1 Knapsack Optimization)
Priority Inbox Notification System (Max Heap / Priority Queue)
Scalable Notification System Design Documentation
Features
1. Evaluation Logging Middleware

Integrated mandatory logging middleware that sends logs directly to:

POST /evaluation-service/logs
Logging Coverage
Incoming request logging
Response logging
Error logging
External API call logging
Service-level logging
Controller-level logging
Implementation Files
logging_middleware/logger.js
middleware/requestLogger.js
middleware/errorHandler.js
common/evaluationApiClient.js
2. Vehicle Maintenance Scheduler

Optimizes vehicle maintenance scheduling for each depot using 0/1 Knapsack Dynamic Programming.

Problem Statement

Each depot has:

Limited mechanic hours
Multiple maintenance tasks
Each task contains:
Duration
Impact score

Goal:

Maximize total impact while ensuring:

Total Duration <= Available Mechanic Hours
Algorithm Used
Dynamic Programming
0/1 Knapsack Optimization
Time Complexity
O(n * capacity)
Space Complexity
O(n * capacity)
Files
vehicle_scheduling/domain/knapsack.js
vehicle_scheduling/services/vehicleScheduling.service.js
vehicle_scheduling/controllers/vehicleScheduling.controller.js
vehicle_scheduling/routes/vehicleScheduling.routes.js
3. Priority Inbox System

Fetches notifications and returns top unread notifications based on priority.

Priority Order
Placement > Result > Event

If priorities match:

Latest timestamp wins
Algorithm Used
Max Heap
Priority Queue
Time Complexity
O(n log n)
Space Complexity
O(n)
Files
priority_inbox/domain/notificationHeap.js
priority_inbox/services/priorityInbox.service.js
priority_inbox/controllers/priorityInbox.controller.js
priority_inbox/routes/priorityInbox.routes.js
Project Structure
project-root/
│
├── config/
│   └── env.js
│
├── common/
│   └── evaluationApiClient.js
│
├── logging_middleware/
│   └── logger.js
│
├── middleware/
│   ├── requestLogger.js
│   └── errorHandler.js
│
├── utils/
│   └── asyncHandler.js
│
├── vehicle_scheduling/
│   ├── domain/
│   ├── services/
│   ├── controllers/
│   └── routes/
│
├── priority_inbox/
│   ├── domain/
│   ├── services/
│   ├── controllers/
│   └── routes/
│
├── routes/
│   └── index.js
│
├── notification_system_design.md
├── postman_collection.json
├── server.js
├── package.json
└── README.md
Architecture Flow
Client Request
    ↓
Routes
    ↓
Controllers
    ↓
Services
    ↓
Domain Logic
    ↓
External Evaluation APIs
    ↓
Response
API Endpoints
Health Check
GET /api/health
Vehicle Scheduling
GET /api/vehicles/schedule

Returns optimized maintenance schedule.

Priority Inbox
GET /api/priority-inbox/top-unread?n=5

Returns top unread notifications.

Setup Instructions
Install Dependencies
npm install
Configure Environment Variables

Create .env

PORT=3000
EVALUATION_ACCESS_TOKEN=
EVALUATION_CLIENT_ID=
EVALUATION_CLIENT_SECRET=
Start Server
npm start
Sample Response
Vehicle Scheduling Response
{
  "success": true,
  "message": "Vehicle schedules generated successfully"
}
Priority Inbox Response
{
  "success": true,
  "message": "Priority inbox generated successfully"
}
System Design Document

Detailed notification architecture available in:

notification_system_design.md

Includes:

API design
Database design
Queue handling
Retry mechanisms
Dead letter queues
Scalability for 50,000 notifications
Known Limitation

Core backend implementation is fully completed.

During final API verification, authentication issues occurred due to evaluation credential mismatch from the external assessment platform.

Despite this:

Logging middleware is fully implemented
API integrations are completed
Core algorithms are implemented
Postman collection included for verification
Tech Stack
Node.js
Express.js
Axios
REST APIs
Dynamic Programming
Heap/Priority Queue
Submission Artifacts
Source Code
Postman Collection
System Design Document
Logging Middleware Integration
API Implementations
Author

Rakesh Kumar
Backend Assessment Submission
Chitkara University
Roll No: 2311981415
