import { SandboxedJob } from "bullmq";
import { Payload } from "./payload";

module.exports = async (job: SandboxedJob<Payload>) => {
  const payload = job.data;
  console.log(`[${job.name}]: received ${payload}`);
};
