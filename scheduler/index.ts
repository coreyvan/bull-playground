import { QueueScheduler as BullQueueScheduler } from "bullmq";

export class QueueScheduler extends BullQueueScheduler {
  constructor(name: string, host: string, port: number) {
    super(name, { connection: { host, port } });
  }
}
