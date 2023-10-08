import Bull from "bull";
import * as redis from "redis";
import { ErrorStatusMessage } from "../common/status";
import { CUDAction } from "../common/type";
import config from "../config";
import eventQueuesByDomain from "./domain";

/**
 * @description
 * Return all event queues by domain
 * When controlled by microservices, Redis is configured per domain,
 * Redis may be additionally configured as CREATE, UPDATE, and DELETE depending on traffic.
 */
export const getEventQueuesByDomain = () => {
  return eventQueuesByDomain;
};

/**
 * @description
 * Picks a specific event queue from all domain-specific Create, Update, Delete event queues.
 */
export const selectEventQueue = (
  domainName: string,
  cudAction: CUDAction,
): Bull.Queue => {
  const eventQueuesByDomain = getEventQueuesByDomain();

  const eventQueue = eventQueuesByDomain[domainName]?.[cudAction];

  if (!eventQueue) throw new Error(ErrorStatusMessage.IS_EMPTY_EVENT_QUEUE);

  return eventQueue;
};

/**
 * @description
 * The Redis client successfully performs connection processing if the connection port value is an open port, even if it is not an actual port on the Redis server.
 * Therefore, you have to check the port well because there is a phenomenon that the work cannot be performed and it keeps stuck.
 * The function basically checks whether the host and port are connectable, and if there is a problem, the port should be checked well.
 */
export const validateRedisConnection = async (): Promise<void> => {
  console.log(
    `Connect Redis redis://${config.POST_DOMAIN_QUEUE_HOST}:${config.POST_DOMAIN_QUEUE_PORT}`,
  );
  const redisClient: redis.RedisClientType = redis.createClient({
    url: `redis://${config.POST_DOMAIN_QUEUE_HOST}:${config.POST_DOMAIN_QUEUE_PORT}`,
  });

  await redisClient.connect();

  const isReady = redisClient.isReady;
  const isOpen = redisClient.isOpen;

  console.log(`Redis Status: isReady=${isReady}, isOpen=${isOpen}`);
  await redisClient.disconnect();
};
