import Bull from "bull";
import { getEventQueuesByDomain } from "../EventQueue";
import { EventHandleParamEnum } from "../common/enum";
import { EventHandleParams } from "../common/type";

/**
 * @description
 * Events are registered while traversing event queues existing in all domain.
 */
export const EventHandlerByDomain = async (
    EventHandler: (EventQueue: Bull.Queue) => void
): Promise<void> => {
    const eventQueuesByDomain = getEventQueuesByDomain();
    const domain = Object.keys(eventQueuesByDomain);

    for (const domainName of domain) {
        const EventQueues: (Bull.Queue | undefined)[] = Object.values(
            eventQueuesByDomain[domainName] ?? {}
        );

        for await (const EventQueue of EventQueues) {
            if (EventQueue) await EventHandler(EventQueue);
        }
    }
};

export const generateEventParams = (job: Bull.Job): EventHandleParams => {
    const domainName = job.data[EventHandleParamEnum.DOMAIN_NAME];
    const entity = job.data[EventHandleParamEnum.ENTITY];
    const cudAction = job.data[EventHandleParamEnum.ACTION_TYPE];

    return {
        domainName,
        entity,
        cudAction
    };
};

export const printJob = (job: Bull.Job) => {
    console.log(`Event Queue Name = ${job.queue.name}`);
    console.log(`Job ID = ${job.id}`);
    console.log(`Job Data = ${JSON.stringify(job.data)}`);
    console.log(`Failed Job Reason = ${JSON.stringify(job.failedReason)}`);
    console.log(`Job Count = ${job.attemptsMade} / ${job.opts.attempts}`);
};

export const printWorkJob = ({
    domainName,
    entity,
    cudAction
}: EventHandleParams) => {
    console.log(`DOMAIN NAME: ${domainName}`);
    console.log(`ENTITY: ${JSON.stringify(entity)}`);
    console.log(`CUD_ACTION: ${cudAction}`);
};
