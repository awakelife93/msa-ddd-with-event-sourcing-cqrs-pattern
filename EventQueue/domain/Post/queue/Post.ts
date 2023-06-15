import Bull from "bull";
import Domain from "../../../../Domain";
import config from "../../../../config";
import queueOptions from "./config";

/**
 * @description
 * C, U, and D queues are placed in one Redis.
 */
const generateSingleQueue = () => {
    return {
        CREATE: new Bull(`${Domain.POST}_CREATE_EVENT_QUEUE`, {
            ...queueOptions.singleEventQueueOption
        }),
        UPDATE: new Bull(`${Domain.POST}_UPDATE_EVENT_QUEUE`, {
            ...queueOptions.singleEventQueueOption
        }),
        DELETE: new Bull(`${Domain.POST}_DELETE_EVENT_QUEUE`, {
            ...queueOptions.singleEventQueueOption
        })
    };
};

/**
 * @description
 * C, U, and D queues are placed on each Redis.
 */
const generateMultiQueue = () => {
    return {
        CREATE: new Bull(`${Domain.POST}_CREATE_EVENT_QUEUE`, {
            ...queueOptions.multiEventQueueOption.CREATE
        }),
        UPDATE: new Bull(`${Domain.POST}_UPDATE_EVENT_QUEUE`, {
            ...queueOptions.multiEventQueueOption.UPDATE
        }),
        DELETE: new Bull(`${Domain.POST}_DELETE_EVENT_QUEUE`, {
            ...queueOptions.multiEventQueueOption.DELETE
        })
    };
};

const PostEventQueues = config.IS_SINGLE_QUEUE
    ? generateSingleQueue()
    : generateMultiQueue();

export default PostEventQueues;
