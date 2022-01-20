import {
  newQueue,
  newQueueWithRetries,
  newQueueScheduler,
  newWorker,
  newFaultyWorker,
  newSleepyWorker,
  newConcurrentWorker,
  addEvent,
} from "./lib/queue/building-sms/index.js";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import { KoaAdapter } from "@bull-board/koa";
import Koa from "koa";
import Router from "koa-router";

const host = "localhost";
const port = 6380;

const run = async () => {
  const q = newQueue({ host, port });
  // const q = newQueueWithRetries({ host, port });
  await newQueueScheduler({ host, port });

  // await newWorker({ host, port });
  await newFaultyWorker({ host, port });
  // await newSleepyWorker({ host, port });
  // await newConcurrentWorker({ host, port });

  const app = new Koa();
  const router = new Router();

  const serverAdapter = new KoaAdapter();

  createBullBoard({
    queues: [new BullMQAdapter(q)],
    serverAdapter,
  });

  serverAdapter.setBasePath("/ui");
  await app.use(serverAdapter.registerPlugin());

  router.get("/add", async (ctx: any) => {
    let delay = ctx.query.delay || 0;

    if (delay) {
      delay = +delay * 1000; // delay must be a number
    }
    await addEvent(q, { message: ctx.query.message }, { delay });

    ctx.body = {
      ok: true,
    };
  });

  router.get("/drain", async (ctx: any) => {
    await q.drain();

    ctx.body = {
      ok: true,
    };
  });

  router.get("/obliterate", async (ctx: any) => {
    await q.obliterate({ force: true });

    ctx.body = {
      ok: true,
    };
  });

  app.use(router.routes()).use(router.allowedMethods());

  await app.listen(3000);
  // eslint-disable-next-line no-console
  console.log("Running on 3000...");
  console.log("For the UI of instance1, open http://localhost:3000/ui");
  console.log("Make sure Redis is running on port 6379 by default");
  console.log("To populate the queue, run:");
  console.log("  curl http://localhost:3000/add?message=Example");
  console.log("To populate the queue with custom options (opts), run:");
  console.log("  curl http://localhost:3000/add?message=Test&delay=9");
};

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
