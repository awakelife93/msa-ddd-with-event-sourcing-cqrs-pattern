import config from "../config";

export const defaultRedisOptions = {
    connectTimeout: config.DEFAULT_CONNECT_TIMEOUT
};

export const defaultJobOptions = {
    removeOnComplete: true
};
