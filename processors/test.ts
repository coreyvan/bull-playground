import { SandboxedJob } from "bullmq";

module.exports = async (job: SandboxedJob) => {
  console.log(`test processor: ${job.data.message}`);
};
