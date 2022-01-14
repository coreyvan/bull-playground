import { Queue } from "../queue";
class Producer {
  constructor(queue: Queue) {
    this.queue = queue;
  }
  queue: Queue;
}

export interface TestEventPayload {
  message: string;
}

export class TestProducer extends Producer {
  constructor(queue: Queue) {
    super(queue);
  }
  async add(payload: TestEventPayload) {
    return this.queue.add("testEvent", payload);
  }
}
