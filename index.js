const fastify = require("fastify")();
const { createBullBoard } = require("@bull-board/api");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const { FastifyAdapter } = require("@bull-board/fastifyAdapter");
const { Queue } = require("bullmq");
require("dotenv").config();

const queue = new Queue("webhookQueue", {
  connection: {
    host: process.env.REDIS_HOST || "redis",
    password: process.env.REDIS_PASSWORD || "",
  },
});

const serverAdapter = new FastifyAdapter();
serverAdapter.setBasePath("/dashboard");

createBullBoard({
  queues: [new BullMQAdapter(queue)],
  serverAdapter,
});

fastify.register(serverAdapter.registerPlugin(), {
  prefix: "/dashboard",
  preHandler: async (request, reply) => {
    const token = request.headers["authorization"];
    if (!token || token !== `Bearer ${process.env.API_KEY}`) {
      reply.code(401).send({ error: "Unauthorized" });
    }
  },
});

fastify.listen({ port: 3000, host: "0.0.0.0" }, () =>
  console.log("Dashboard disponível em /dashboard")
);
