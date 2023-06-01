import { PrismaClient } from "@prisma/client";
import config from "../../../config";

const client = new PrismaClient();

/**
 * @description
 * By default, Prisma automatically establishes a connection when called,
 * but there is a function created during the compilation phase to proactively check if the connection has failed.
 */
export const connection = async (): Promise<void> => {
    await client.$connect();
    console.log(
        `Connect Command Server Database ${config.COMMAND_SERVER_DATABASE_URL}`
    );
};

export default client;
