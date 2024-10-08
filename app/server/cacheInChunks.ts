import { setCache } from "./redis.server";

export default function cacheInChunks(key: string, chunks: unknown[]) {
  return Promise.all([
    ...chunks.map((chunk, index) => setCache(`${key}:chunk_${index}`, chunk)),
    setCache(`${key}:chunk_count`, chunks.length),
  ]);
}
