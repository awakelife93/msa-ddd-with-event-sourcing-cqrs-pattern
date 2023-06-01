import Domain from "../../Domain";
import PostEventQueues from "./Post/queue/Post";

const eventQueuesByDomain = {
    [Domain.POST]: PostEventQueues
};

export default eventQueuesByDomain;
