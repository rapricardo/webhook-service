const { Queue } = require("bullmq");
require("dotenv").config();

const queue = new Queue("webhookQueue", {
  connection: {
    host: process.env.REDIS_HOST || "redis",
    password: process.env.REDIS_PASSWORD || "",
  }
});

module.exports = queue;
