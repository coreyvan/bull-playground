import { Queue as BullQueue } from "bullmq";

export class Queue extends BullQueue {
  constructor(name: string, host: string, port: number) {
    super(name, {
      connection: { host, port },
    });
  }
}
