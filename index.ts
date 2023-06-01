import startCommandServerApplication from "./Command/src";
import { getErrorItem } from "./common/error";
import EventBus from "./EventBus";
import { validateRedisConnection } from "./EventQueue";
import startQueryServerApplication from "./Query/src";

const initialization = async (): Promise<void> => {
    try {
        await validateRedisConnection();

        await startCommandServerApplication();

        await startQueryServerApplication();

        EventBus.onEventQueueHandler();

        EventBus.subscriber();

        EventBus.printFailedJobs();

        // Only Test cleanup Method
        // EventBus.removeFailedJob({
        //     cleanupFailures: true
        // });
    } catch (error: unknown) {
        const _error = getErrorItem(error);
        console.log(`Process Error ${_error.message}`);
    }
};

initialization();
