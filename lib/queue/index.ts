import {
  WorkerOptions,
  JobsOptions,
  Worker,
  QueueOptions,
  QueueSchedulerOptions,
  QueueScheduler,
  Job,
  Queue,
} from "bullmq";
import * as Process from "process";

export interface Connection {
  host: string;
  port: number;
}

export type Handler = (job: Job) => any;

export type ConcretePayload = {
  message: string;
};

export interface Producer<T> {
  add(payload: T): Promise<void>;
}

export class ConcreteProducer implements Producer<ConcretePayload> {
  constructor(connection: Connection) {
    this.connection = connection;
  }

  connection: Connection;
  async add(payload: ConcretePayload): Promise<void> {
    const q = new Queue<ConcretePayload>("test.queue", {
      connection: this.connection,
    });

    await q.add("concrete.job", payload);
  }
}

const producerMap = {
  "concrete.producer": ConcreteProducer,
};

const payloadMap = {
  "concrete.producer": ConcretePayload,
};

export class ProducerFactory {
  create<T>(type: new () => T): T {
    return new type();
  }
}

export async function produceEvent(
  producerType: string,
  payload: T
): Promise<void> {}
export function generateProducer<T>(producerType: new () => T): T {
  return new producerType();
}

export const defaultWorkerOptions: WorkerOptions = {};

export const defaultJobOptions: JobsOptions = {
  removeOnComplete: 10,
};

export const defaultQueueOptions: QueueOptions = {};

export const defaultQueueSchedulerOptions: QueueSchedulerOptions = {};

export async function listenDefaultWorkerEvents(worker: Worker): Promise<void> {
  worker.on("error", (err) => {
    console.log(`[worker] unhandled error: ${err}`);
  });

  worker.on("failed", (job, err) => {
    console.log(`[worker] job ${job.id} failed: ${err}`);
  });
}

export async function listenDefaultQueueSchedulerEvents(
  scheduler: QueueScheduler
): Promise<void> {
  scheduler.on("failed", (jobId, failedReason) => {
    console.log(`[scheduler] job ${jobId} failed: ${failedReason}`);
  });
  scheduler.on("stalled", (jobId) => {
    console.log(`[scheduler] job ${jobId} stalled`);
  });
}

export async function workerFactory(
  queueName: string,
  handler: Handler,
  opts: WorkerOptions,
  connection: Connection
): Promise<Worker> {
  let wOpts = { ...defaultWorkerOptions, ...opts, connection };

  const w = new Worker(queueName, handler, wOpts);

  await listenDefaultWorkerEvents(w);

  return new Promise<Worker>((resolve) => resolve(w));
}

export async function queueFactory(
  queueName: string,
  opts: QueueOptions,
  connection: Connection
): Promise<Queue> {
  let qOpts = { ...defaultQueueOptions, ...opts, connection };

  const q = new Queue(queueName, qOpts);

  return new Promise<Queue>((resolve) => resolve(q));
}
