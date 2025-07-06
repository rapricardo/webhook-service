const { Worker } = require("bullmq");
require("dotenv").config();

const worker = new Worker("webhookQueue", async (job) => {
  console.log("Processing job", job.name, job.data);
}, {
  connection: {
    host: process.env.REDIS_HOST || "redis",
    password: process.env.REDIS_PASSWORD || "",
  }
});

console.log("Worker is running...");
