import { SandboxedJob } from "bullmq";
import { Payload } from "./payload";

module.exports = async (job: SandboxedJob) => {
  const payload = job.data as Payload;
  console.log(`[${job.name}]: received ${payload}`);
};
