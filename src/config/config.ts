import dotenv from "dotenv";

dotenv.config();

const DEFAULT_APP_PORT = 8000;

//SERVER
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
const SERVER_PORT = process.env.PORT || DEFAULT_APP_PORT;

//MONGODB
const MONGO_OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true };
const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_HOST = process.env.MONGODB_HOST;

const MONGODB = {
  host: MONGODB_HOST,
  username: MONGODB_USERNAME,
  password: MONGODB_PASSWORD,
  options: MONGO_OPTIONS,
  url: `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_HOST}`,
};

const SERVER = {
  port: SERVER_PORT,
  hostname: SERVER_HOSTNAME,
};

const config = {
  server: SERVER,
  mongodb: MONGODB,
};

export default config;
