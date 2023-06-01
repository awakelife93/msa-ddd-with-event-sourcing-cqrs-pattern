import createServer from "../../common/server";
import config from "../../config";
import { createExpressApplication, createRoute } from "./common/express";
import routes from "./common/routes/routes";
import { connection } from "./database";

const startCommandServerApplication = async (): Promise<void> => {
    const application = createExpressApplication();

    await connection();
    await createRoute(application, routes);
    await createServer(
        application,
        "CommandServer",
        config.COMMAND_SERVER_PORT
    );
    console.log("Start Command Server");
};

export default startCommandServerApplication;
