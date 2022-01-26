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
import { addEvent as BuildingEmailaddEvent} from
      import {generateEvent, eventTypes} from lib/queue
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import { KoaAdapter } from "@bull-board/koa";
import Koa from "koa";
import Router from "koa-router";
import { ConcreteProducer } from "./lib/queue";

const host = process.argv[2] || "localhost";
const port = process.argv[3] || "6380";

const connection = { host, port: parseInt(port) };

const run = async () => {
  console.log(`... using redis at ${host}:${port}`);
  // const q = await newQueue({ host, port });
  const q = await newQueueWithRetries(connection);
  await newQueueScheduler(connection);

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

    let repeat = ctx.query.repeat || 1;
    for (let i = 0; i < repeat; i++) {
      await addEvent(q, { message: ctx.query.message }, { delay });
    }

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
  console.log("... server running on 3000...");
  console.log("For the UI of instance1, open http://localhost:3000/ui");
  console.log("To populate the queue, run:");
  console.log("  curl http://localhost:3000/add?message=Example");
  console.log("To populate the queue with custom delay, run:");
  console.log("  curl http://localhost:3000/add?message=Test&delay=9");
};

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
