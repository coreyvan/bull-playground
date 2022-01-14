import { Queue } from "./queue/index.js";
import { TestProducer } from "./producer/index.js";
import { SandboxedWorker, TestWorker } from "./worker/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const q = new Queue("testQueue", "localhost", 6380);

const p = new TestProducer(q);
// const w1 = new TestWorker("localhost", 6380, "1");
const sw = new SandboxedWorker(
  "testQueue",
  { host: "localhost", port: 6380 },
  path.join(__dirname, "processors/test.ts")
);

let counter = 0;
while (true) {
  counter++;
  await p.add({ message: `hello world ${counter}` });
  console.log(`added job ${counter}`);
  await new Promise((resolve) => setTimeout(resolve, 100));
}
