import {
  WorkerOptions,
  JobsOptions,
  Worker,
  QueueOptions,
  QueueSchedulerOptions,
  QueueScheduler,
  Job,
} from "bullmq";

export interface Connection {
  host: string;
  port: number;
}

export type Processor = (job: Job) => any;

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
