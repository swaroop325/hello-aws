const { REDIS_PORT, REDIS_HOST } = require("../constants");
const redis = require("redis");

// Check Redis connection health
const checkRedisConnection = async () => {
  try {
    const redisClient = redis.createClient({
      socket: {
        host: REDIS_HOST || "localhost",
        port: REDIS_PORT,
      },
      password: process.env.REDIS_PASSWORD || undefined,
    });
    redisClient.connect().catch((err) => {
      console.error("Redis connection error:", err);
    });
    await redisClient.ping(); // Ping Redis server
    console.log("Redis connection is healthy");
    return true;
  } catch (error) {
    console.error("Redis health check failed:", error);
    return false;
  }
};

module.exports = {
  checkRedisConnection,
};
