const { REDIS_PORT, REDIS_HOST } = require("../constants");
const redis = require("redis");

// Redis client configuration
const redisClient = redis.createClient({
  socket: {
    host: REDIS_HOST || "localhost",
    port: REDIS_PORT,
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

// Connect to Redis
redisClient.connect().catch((err) => {
  console.error("Redis connection error:", err);
});

// Check Redis connection health
const checkRedisConnection = async () => {
  try {
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
