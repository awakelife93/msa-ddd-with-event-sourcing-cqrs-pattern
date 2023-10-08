import createServer from "../../common/server";
import config from "../../config";
import { connection } from "../mongoose";
import { createExpressApplication, createRoute } from "./common/express";
import routes from "./common/routes/Post";

const startQueryServerApplication = async (): Promise<void> => {
  const application = createExpressApplication();

  await connection();
  await createRoute(application, routes);
  await createServer(application, "QueryServer", config.QUERY_SERVER_PORT);
  console.log("Start Query Server");
};

export default startQueryServerApplication;
