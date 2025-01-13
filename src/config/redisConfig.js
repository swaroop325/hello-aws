// services/redisService.ts
import * as redis from "redis";

// Redis client configuration
const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

// Connect to Redis
redisClient.connect().catch((err) => {
  console.error("Redis connection error:", err);
});

// Check Redis connection health
export const checkRedisConnection = async () => {
  try {
    await redisClient.ping(); // Ping Redis server
    console.log("Redis connection is healthy");
    return true;
  } catch (error) {
    console.error("Redis health check failed:", error);
    return false;
  }
};

export { redisClient };
