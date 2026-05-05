const evaluationApiClient = require("../../common/evaluationApiClient");
const { Log } = require("../../logging_middleware/logger");
const { NotificationHeap, toHeapNode } = require("../domain/notificationHeap");

function normalizeNotification(raw) {
  return {
    ID: raw.ID,
    Type: raw.Type,
    Message: raw.Message,
    Timestamp: raw.Timestamp,
    IsRead: Boolean(raw.IsRead || false)
  };
}

async function getTopUnreadNotifications(limit) {
  await Log("backend", "info", "service", `Fetching notifications for top ${limit} unread`);
  const response = await evaluationApiClient.get("/notifications");
  const notifications = (response.data || []).map(normalizeNotification);

  const heap = new NotificationHeap();
  notifications.forEach((notification) => {
    if (!notification.IsRead) {
      heap.insert(toHeapNode(notification));
    }
  });

  const top = [];
  while (top.length < limit) {
    const item = heap.extractMax();
    if (!item) {
      break;
    }
    top.push({
      ID: item.ID,
      Type: item.Type,
      Message: item.Message,
      Timestamp: item.Timestamp
    });
  }

  await Log("backend", "info", "service", `Prepared ${top.length} notifications in priority inbox`);
  return top;
}

module.exports = {
  getTopUnreadNotifications
};
