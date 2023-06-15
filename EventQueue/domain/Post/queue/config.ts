import Bull from "bull";
import config from "../../../../config";
import { defaultJobOptions, defaultRedisOptions } from "../../../config";

type SingleEventQueueOption = Bull.QueueOptions;
type MultiEventQueueOption = {
    CREATE: SingleEventQueueOption;
    UPDATE: SingleEventQueueOption;
    DELETE: SingleEventQueueOption;
};

/**
 * @description
 * singleEventQueueOption = When using a single Redis
 * multiEventQueueOption = If you are isolating Redis for each C, U, D operation
 */
const queueOptions: {
    singleEventQueueOption: SingleEventQueueOption;
    multiEventQueueOption: MultiEventQueueOption;
} = {
    singleEventQueueOption: {
        redis: {
            ...defaultRedisOptions,
            port: Number(config.POST_DOMAIN_QUEUE_PORT),
            host: config.POST_DOMAIN_QUEUE_HOST
        },
        defaultJobOptions: {
            ...defaultJobOptions
        }
    },
    multiEventQueueOption: {
        CREATE: {
            redis: {
                ...defaultRedisOptions
                // port: undefined,
                // host: ""
            },
            defaultJobOptions: {
                ...defaultJobOptions
            }
        },
        UPDATE: {
            redis: {
                ...defaultRedisOptions
                // port: undefined,
                // host: ""
            },
            defaultJobOptions: {
                ...defaultJobOptions
            }
        },
        DELETE: {
            redis: {
                ...defaultRedisOptions
                // port: undefined,
                // host: ""
            },
            defaultJobOptions: {
                ...defaultJobOptions
            }
        }
    }
};

export default queueOptions;
