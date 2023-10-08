import mongoose from "mongoose";
import config from "../../config";

export const connection = async (): Promise<void> => {
  await mongoose.connect(config.QUERY_SERVER_DATABASE_URL ?? "", {
    serverSelectionTimeoutMS: config.DEFAULT_CONNECT_TIMEOUT,
  });
  console.log(
    `Connect Query Server Database ${config.QUERY_SERVER_DATABASE_URL}`,
  );
};
