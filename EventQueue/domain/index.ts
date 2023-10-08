import { getDomain } from "../../Domain";
import PostEventQueues from "./Post/queue/Post";

const eventQueuesByDomain = {
  [getDomain("POST")]: PostEventQueues,
};

export default eventQueuesByDomain;
