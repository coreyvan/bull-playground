import * as BuildingSMS from "../../lib/queue/building-sms/index.js";
import { Worker } from "bullmq";
import { Connection } from "../../lib/queue";

const connection: Connection = { host: "localhost", port: 6380 };

async function run() {
  let command = process.argv[2] || "default";
  let w: Worker;

  process.on("SIGINT", async () => {
    console.log("received SIGINT... shutting down worker");
    await w.close();
  });

  switch (command) {
    case "default":
      console.log(
        `running ${command} worker: using redis at ${connection.host}:${connection.port}`
      );
      w = await BuildingSMS.newWorker(connection);
      break;
    case "sleepy":
      console.log(
        `running ${command} worker: using redis at ${connection.host}:${connection.port}`
      );
      w = await BuildingSMS.newSleepyWorker(connection);
      break;
    case "faulty":
      console.log(
        `running ${command} worker: using redis at ${connection.host}:${connection.port}`
      );
      w = await BuildingSMS.newFaultyWorker(connection);
      break;
    case "concurrent":
      console.log(
        `running ${command} worker: using redis at ${connection.host}:${connection.port}`
      );
      w = await BuildingSMS.newConcurrentWorker(connection);
      break;
  }
}

run().catch((err) => {
  console.log(`error while running: ${err}`);
  process.exit(1);
});
