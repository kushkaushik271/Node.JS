const redis = require("redis");

const redisClient = redis.createClient({
  url: "redis://127.0.0.1:6379",
});

/* eslint-disable */
redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("error", (err) => console.error("Redis Client Error:", err));
 
module.exports = redisClient;
