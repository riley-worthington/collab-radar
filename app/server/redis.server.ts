import { Redis } from "@upstash/redis";

const ONE_WEEK = 60 * 60 * 24 * 7;

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export function setCache(key: string, value: unknown) {
  return redis.set(key, value, { ex: ONE_WEEK });
}

export function getCache(key: string) {
  return redis.get(key);
}
