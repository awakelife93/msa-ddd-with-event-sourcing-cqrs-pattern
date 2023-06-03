## Event Bus

### Description

**Event Stream**\
This is a common function created to register events for each event queue managed by bull.js and handle the received business logic.

```typescript
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
```

**Event queue and task status management logic**

```typescript
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
    await EventHandlerByDomain((EventQueue: Bull.Queue) => {
        EventQueue.on("failed", async (job: Bull.Job) => {
            printFailedJob(job);
        });

        EventQueue.on("removed", async (job: Bull.Job) => {
            console.log(`Removed Job ${job.id}`);
        });

        EventQueue.on("completed", async (job: Bull.Job) => {
            console.log(`Completed Job ${job.id}`);
        });
    });

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
};
```
