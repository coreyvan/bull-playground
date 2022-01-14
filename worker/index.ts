import { Worker as BullWorker, Processor } from "bullmq";

export class Worker extends BullWorker {
  constructor(
    name: string,
    connection: { host: string; port: number },
    processor: Processor
  ) {
    super(name, processor, { connection });
  }
}

export class TestWorker extends Worker {
  constructor(host: string, port: number, id: string) {
    super("testQueue", { host, port }, async (job) => {
      console.log(
        `message received by worker ${id}: ${job.name} - ${job.data.message}`
      );
    });
  }
}

export class SandboxedWorker extends BullWorker {
  constructor(
    name: string,
    connection: { host: string; port: number },
    processorPath: string
  ) {
    super(name, processorPath, { connection });
  }
}
