## Stage 1: API Design

### 1) Create Notification
- **Method/URL**: `POST /api/notifications`
- **Headers**:
  - `Authorization: Bearer <jwt>`
  - `Content-Type: application/json`
  - `X-Request-ID: <uuid>`
- **Request Body**:
```json
{
  "recipientIds": [1042, 1050],
  "type": "Placement",
  "title": "Interview Round 1",
  "message": "Round 1 starts at 10:00 AM",
  "metadata": {
    "company": "Afford Medical"
  }
}
```
- **Response (201)**:
```json
{
  "success": true,
  "notificationBatchId": "nb_231198",
  "createdCount": 2
}
```
- **Errors**: `400`, `401`, `403`, `500`

### 2) Get Notifications
- **Method/URL**: `GET /api/notifications?studentId=1042&isRead=false&page=1&limit=20`
- **Headers**:
  - `Authorization: Bearer <jwt>`
  - `X-Request-ID: <uuid>`
- **Response (200)**:
```json
{
  "success": true,
  "page": 1,
  "limit": 20,
  "total": 148,
  "data": [
    {
      "id": "n_1",
      "studentId": 1042,
      "type": "Placement",
      "message": "Shortlisted for final round",
      "isRead": false,
      "createdAt": "2026-05-05T09:30:00.000Z"
    }
  ]
}
```
- **Errors**: `400`, `401`, `500`

### 3) Mark Notification as Read
- **Method/URL**: `PATCH /api/notifications/:id/read`
- **Headers**:
  - `Authorization: Bearer <jwt>`
  - `Content-Type: application/json`
- **Request Body**:
```json
{
  "studentId": 1042
}
```
- **Response (200)**:
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```
- **Errors**: `400`, `401`, `404`, `500`

### 4) Delete Notification
- **Method/URL**: `DELETE /api/notifications/:id?studentId=1042`
- **Headers**:
  - `Authorization: Bearer <jwt>`
- **Response (200)**:
```json
{
  "success": true,
  "message": "Notification deleted"
}
```
- **Errors**: `401`, `404`, `500`

### 5) Real-time Notification Delivery
- **Method/URL**: `GET /api/notifications/stream` (WebSocket upgrade or SSE)
- **Headers**:
  - `Authorization: Bearer <jwt>`
  - `Last-Event-ID: <optional>`
- **Event Payload**:
```json
{
  "event": "notification.created",
  "data": {
    "id": "n_99",
    "studentId": 1042,
    "type": "Result",
    "message": "Result declared for coding round"
  }
}
```
- **Status**: `101` (WebSocket) / `200` (SSE stream)

## Stage 2: Database Design

### Tables
1. **users**
   - `id BIGINT PRIMARY KEY`
   - `name VARCHAR(120)`
   - `email VARCHAR(255) UNIQUE`
   - `role ENUM('student','admin','hr')`
   - `created_at TIMESTAMP`

2. **notifications**
   - `id BIGSERIAL PRIMARY KEY`
   - `type VARCHAR(30) NOT NULL`
   - `title VARCHAR(150)`
   - `message TEXT NOT NULL`
   - `priority SMALLINT DEFAULT 1`
   - `created_at TIMESTAMP NOT NULL DEFAULT NOW()`
   - `metadata JSONB`

3. **notification_reads** (read status table)
   - `id BIGSERIAL PRIMARY KEY`
   - `notification_id BIGINT REFERENCES notifications(id) ON DELETE CASCADE`
   - `student_id BIGINT REFERENCES users(id) ON DELETE CASCADE`
   - `is_read BOOLEAN DEFAULT FALSE`
   - `read_at TIMESTAMP NULL`
   - `created_at TIMESTAMP NOT NULL DEFAULT NOW()`
   - `UNIQUE(notification_id, student_id)`

### SQL vs NoSQL Choice
- SQL is preferred because relational integrity is important (user-notification mappings and read state consistency).
- JSONB in SQL handles optional metadata while preserving transactional behavior.
- NoSQL can be used for activity feeds, but enforcing read-state uniqueness and joins is harder.

### Scaling and Indexing
- Partition `notification_reads` by `student_id` hash/range for high cardinality users.
- Index hot filters and ordering columns.
- Archive old notifications to cold storage table.
- Use read replicas for heavy read traffic.

## Stage 3: Query Optimization

### Slow Query
```sql
SELECT * 
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC;
```

### Why Slow
- `SELECT *` fetches unnecessary columns.
- Filter + sort on unindexed columns causes full scan + sort.
- Large row count for active users increases latency.

### Optimized Query
```sql
SELECT id, type, message, created_at
FROM notification_reads
WHERE student_id = 1042
  AND is_read = false
ORDER BY created_at DESC
LIMIT 50;
```

### Composite Index Strategy
```sql
CREATE INDEX idx_notification_reads_student_read_created
ON notification_reads (student_id, is_read, created_at DESC);
```
- This supports both `WHERE student_id + is_read` and `ORDER BY created_at DESC`.

## Stage 4: DB Overload Solution

- **Redis cache**: Keep `unread_notifications:{studentId}:{page}` with short TTL (30-120s) and invalidate on write/read events.
- **Pagination**: Always require `page` + `limit`; cap `limit` (for example 50).
- **Lazy loading**: Load page 1 initially and fetch additional pages on user interaction.
- **Realtime optimization**: Push only notification IDs over WebSocket/SSE and fetch payload in batched API calls when required.
- **Polling fallback**: Use adaptive polling (15s when active tab, 60s when idle) with ETag/If-None-Match.

## Stage 5: Notify 50,000 Students

### Architecture (Kafka/RabbitMQ)
1. HR API receives one bulk request and stores a `notification_batch` record.
2. Producer publishes one message per recipient to topic/queue `notification.send`.
3. Worker consumers process messages asynchronously and persist notifications.
4. Retry strategy with exponential backoff for transient failures.
5. After retry threshold, send to dead-letter queue (`notification.send.dlq`) for manual/automated replay.

### Why This Scales
- Decouples API latency from delivery throughput.
- Enables horizontal worker autoscaling.
- Provides resiliency with retries and DLQ.
- Preserves delivery observability through batch + message IDs.

## Stage 6: Priority Inbox Coding Task

- Implemented in `priority_inbox/` module with a heap-based max-priority queue.
- Priority order enforced as `Placement > Result > Event`.
- Secondary sort by latest timestamp.
- Returns top `N` unread notifications via `GET /api/priority-inbox/top-unread?n=5`.
- Logging middleware integrated at route, controller, service, and external API call level.
