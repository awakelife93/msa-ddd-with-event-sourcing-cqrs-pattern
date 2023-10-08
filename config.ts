import dotenv from "dotenv";

dotenv.config();
const config = {
  POST_DOMAIN_QUEUE_HOST: process.env["POST_DOMAIN_QUEUE_HOST"] ?? "localhost",
  POST_DOMAIN_QUEUE_PORT: process.env["POST_DOMAIN_QUEUE_PORT"]
    ? Number(process.env["POST_DOMAIN_QUEUE_PORT"])
    : 6379,
  COMMAND_SERVER_DATABASE_URL: process.env["COMMAND_SERVER_DATABASE_URL"],
  QUERY_SERVER_DATABASE_URL: process.env["QUERY_SERVER_DATABASE_URL"],
  DEFAULT_CONNECT_TIMEOUT: 5000,
  COMMAND_SERVER_PORT: process.env["COMMAND_SERVER_PORT"]
    ? Number(process.env["COMMAND_SERVER_PORT"])
    : 3000,
  QUERY_SERVER_PORT: process.env["QUERY_SERVER_PORT"]
    ? Number(process.env["QUERY_SERVER_PORT"])
    : 4000,
  IS_SINGLE_QUEUE: process.env["IS_SINGLE_QUEUE"] ?? true,
};

export default config;
