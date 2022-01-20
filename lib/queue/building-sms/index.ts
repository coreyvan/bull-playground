import {
  Connection,
  defaultJobOptions,
  listenDefaultQueueSchedulerEvents,
  defaultQueueOptions,
  defaultQueueSchedulerOptions,
  workerFactory,
  queueFactory,
} from "../index.js";
import { Job, JobsOptions, Queue, QueueScheduler, Worker } from "bullmq";
import { Payload as ImportedPayload } from "./payload";

const queueName = "building.sms";
const jobName = "building.sms";

const sleep = (t: number) =>
  new Promise((resolve) => setTimeout(resolve, t * 1000));

export interface Payload extends ImportedPayload {}

const handler = async (job: Job) => {
  if (Math.round(Math.random() * 10) % 2) {
    // throw Error("random error!");
  }
  const payload = job.data as Payload;
  console.log(`[${job.name} ${job.id}]: received message "${payload.message}"`);
};

const faultyHandler = async (job: Job) => {
  if (Math.round(Math.random() * 10) % 2) {
    throw Error("random error!");
  }
  const payload = job.data as Payload;
  console.log(`[${job.name} ${job.id}]: received message "${payload.message}"`);
};

const sleepHandler = async (job: Job) => {
  let progress = 0;

  while (progress < 100) {
    await sleep(5);
    progress += 10;
    await job.updateProgress(progress);
    await job.log("made a little progress");
  }

  const payload = job.data as Payload;
  console.log(
    `[${job.name} ${job.id}]: finished job: received message "${payload.message}"`
  );
};

export async function newFaultyWorker(connection: Connection): Promise<void> {
  await workerFactory(queueName, faultyHandler, {}, connection);
}

export async function newSleepyWorker(connection: Connection): Promise<void> {
  await workerFactory(queueName, sleepHandler, {}, connection);
}

export async function newWorker(connection: Connection): Promise<void> {
  await workerFactory(queueName, handler, {}, connection);
}

export async function newConcurrentWorker(
  connection: Connection
): Promise<void> {
  await workerFactory(queueName, sleepHandler, { concurrency: 50 }, connection);
}

export async function newQueueScheduler(connection: Connection): Promise<void> {
  const sOpts = { ...defaultQueueSchedulerOptions, connection };

  const scheduler = new QueueScheduler(queueName, sOpts);

  return listenDefaultQueueSchedulerEvents(scheduler);
}

export async function newQueue(connection: Connection): Promise<Queue> {
  return queueFactory(queueName, {}, connection);
}

export async function newQueueWithRetries(
  connection: Connection
): Promise<Queue> {
  const qOpts = {
    defaultJobOptions: {
      attempts: 3,
      backoff: { delay: 1000, type: "exponential" },
    },
  };

  return queueFactory(queueName, qOpts, connection);
}

export async function addEvent(
  queue: Queue,
  payload: Payload,
  opts?: JobsOptions
): Promise<void> {
  let jobOpts = { ...defaultJobOptions, ...opts };

  await queue.add(jobName, payload, jobOpts);
}
