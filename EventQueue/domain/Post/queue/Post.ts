import Bull from "bull";
import Domain from "../../../../Domain";
import queueOptions from "./config";

const PostCreateEventQueue = new Bull(`${Domain.POST}_CREATE_EVENT_QUEUE`, {
    ...queueOptions.singleEventQueueOption
});

const PostUpdateEventQueue = new Bull(`${Domain.POST}_UPDATE_EVENT_QUEUE`, {
    ...queueOptions.singleEventQueueOption
});

const PostDeleteEventQueue = new Bull(`${Domain.POST}_DELETE_EVENT_QUEUE`, {
    ...queueOptions.singleEventQueueOption
});

const PostEventQueues = {
    CREATE: PostCreateEventQueue,
    UPDATE: PostUpdateEventQueue,
    DELETE: PostDeleteEventQueue
};

export default PostEventQueues;
