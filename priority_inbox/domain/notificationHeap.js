const TYPE_PRIORITY = {
  Placement: 3,
  Result: 2,
  Event: 1
};

class NotificationHeap {
  constructor() {
    this.items = [];
  }

  compare(a, b) {
    if (a.priority !== b.priority) {
      return a.priority > b.priority;
    }
    return a.time > b.time;
  }

  insert(item) {
    this.items.push(item);
    this.bubbleUp(this.items.length - 1);
  }

  bubbleUp(index) {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this.compare(this.items[parent], this.items[current])) {
        break;
      }
      [this.items[parent], this.items[current]] = [this.items[current], this.items[parent]];
      current = parent;
    }
  }

  extractMax() {
    if (this.items.length === 0) {
      return null;
    }
    const top = this.items[0];
    const end = this.items.pop();
    if (this.items.length > 0) {
      this.items[0] = end;
      this.bubbleDown(0);
    }
    return top;
  }

  bubbleDown(index) {
    let current = index;
    const length = this.items.length;

    while (true) {
      const left = current * 2 + 1;
      const right = current * 2 + 2;
      let largest = current;

      if (left < length && !this.compare(this.items[largest], this.items[left])) {
        largest = left;
      }
      if (right < length && !this.compare(this.items[largest], this.items[right])) {
        largest = right;
      }
      if (largest === current) {
        break;
      }
      [this.items[current], this.items[largest]] = [this.items[largest], this.items[current]];
      current = largest;
    }
  }
}

function toHeapNode(notification) {
  return {
    ...notification,
    priority: TYPE_PRIORITY[notification.Type] || 0,
    time: new Date(notification.Timestamp).getTime()
  };
}

module.exports = {
  NotificationHeap,
  toHeapNode
};
