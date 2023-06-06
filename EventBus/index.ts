import Bull from "bull";
import { selectEventQueue } from "../EventQueue";
import QueryEntityHandler from "../Query/src/common/database/QueryEntityHandler";
import { getErrorItem } from "../common/error";
import { CudAction, EventHandleParams } from "../common/type";
import {
    EventHandlerByDomain,
    generateEventParams,
    printFailedJob,
    printWorkJob
} from "./helpers";

const publisher = async ({
    domainName,
    cudAction,
    entity
}: EventHandleParams): Promise<void> => {
    const EventQueue = selectEventQueue(domainName, cudAction);

    console.log("============== EventBus Publisher Work Start ==============");
    printWorkJob({
        domainName,
        cudAction,
        entity
    });

    await EventQueue.add(
        {
            domainName,
            cudAction,
            entity
        },
        { attempts: 3 }
    );
    console.log("============== EventBus Publisher Work End ==============");
};

const subscriber = async (): Promise<void> => {
    await EventHandlerByDomain((EventQueue: Bull.Queue) => {
        EventQueue.process(async (job: Bull.Job, done: Bull.DoneCallback) => {
            try {
                const { domainName, entity, cudAction } =
                    generateEventParams(job);

                console.log(
                    "============== EventBus SubScriber Work Start =============="
                );
                printWorkJob({
                    domainName,
                    cudAction,
                    entity
                });

                await QueryEntityHandler({
                    domainName,
                    cudAction,
                    entity
                });
                await done();
                console.log(
                    "============== EventBus SubScriber Work End =============="
                );
            } catch (error: unknown) {
                const _error = getErrorItem(error);
                await done(new Error(_error.message));
            }
        });
    });
};

export const onEventQueueHandler = async (): Promise<void> => {
    /**
     * @description
     * Check the status of the event queue.
     */
    await eventQueueHealthHandler();

    /**
     * @description
     * Register event listeners for each task in the event queue.
     */
    await EventHandlerByDomain(async (EventQueue: Bull.Queue) => {
        EventQueue.on("failed", async (job: Bull.Job) => {
            printFailedJob(job);
        });

        EventQueue.on("removed", async (job: Bull.Job) => {
            console.log(`========= Removed Job ${job.id} =========`);
        });

        EventQueue.on("completed", async (job: Bull.Job) => {
            console.log(`========= Completed Job ID: ${job.id} =========`);
        });
    });
};

const eventQueueHealthHandler = async (): Promise<void> => {
    await EventHandlerByDomain(async (EventQueue: Bull.Queue) => {
        const isPaused = await EventQueue.isPaused();

        if (isPaused) {
            console.log("EventQueue is Paused, So Resume Start");
            const failedJobs = await getFailedJobs();
            console.log(`These are the currently failed sync jobs.`);
            failedJobs.forEach((failedJob: Bull.Job) => {
                printFailedJob(failedJob);
            });
            await EventQueue.resume();
        }
    });
};

/**
 * @description
 * Since the situation was normally committed in the Command Server,
 * you must somehow register it in the Query Server or remove it from the Command Server.
 */
const printFailedJobs = async (): Promise<void> => {
    const failedJobs = await getFailedJobs();
    console.log("========= Failed Jobs =========");
    failedJobs.forEach((failedJob) => {
        printFailedJob(failedJob);
    });
    console.log("===============================");
};

const getFailedJobs = async (): Promise<Bull.Job[]> => {
    const failedJobs: Bull.Job[] = [];
    await EventHandlerByDomain(async (EventQueue: Bull.Queue) => {
        failedJobs.push(...(await EventQueue.getFailed()));
    });
    return failedJobs;
};

const rePublisher = async (job: Bull.Job): Promise<void> => {
    await publisher(generateEventParams(job));
};

const pauseQueue = async (
    domainName: string,
    cudAction: CudAction
): Promise<void> => {
    const eventQueuesByDomain = selectEventQueue(domainName, cudAction);
    await eventQueuesByDomain.pause();
};

const removeFailedJob = async ({
    jobId,
    cleanupFailures = false
}: {
    jobId?: string;
    cleanupFailures: boolean;
}): Promise<void> => {
    const failedJobs = await getFailedJobs();

    for (const failedJob of failedJobs) {
        if (cleanupFailures) await failedJob.remove();
        else {
            if (failedJob.id === jobId) {
                await failedJob.remove();
            }
        }
    }
};

const EventBus = {
    publisher,
    subscriber,
    onEventQueueHandler,
    printFailedJobs,
    rePublisher,
    getFailedJobs,
    pauseQueue,
    removeFailedJob
};

export default EventBus;
