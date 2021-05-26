import express, { Application, Request } from "express";
import mongoose from "mongoose";
import session from "express-session";
import cors from "cors";
import mongoDBSession from "connect-mongodb-session";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import helmet from "helmet";

import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import categoryRoutes from "./routes/category";
import contactRoutes from "./routes/contact";
import uploadedContactRoutes from "./routes/uploadedContact";
import filingRoutes from "./routes/filing";
import messagingRoutes from "./routes/messaging";

import config from "./config/config";

dotenv.config();

const { mongodb, server } = config;

const TWO_HOUR = 1000 * 60 * 60 * 2;
const DEFAULT_SESSION_LIFETIME = TWO_HOUR;
const DEFAULT_SECRET = "my_secret";

const APP_PORT = server.port;
const NAMESPACES = {
  SERVER: "Server",
  DB_SESSIONS_COLLECTION_NAME: "sessions",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  SESSION_NAME: process.env.NODE_ENV,
  SESSION_LIFETIME: process.env.SESSION_LIFETIME || DEFAULT_SESSION_LIFETIME,
  SESSION_SECRET: process.env.SESSION_SECRET || DEFAULT_SECRET,
};
const app: Application = express();

const mongoDBStore = mongoDBSession(session);
const store = new mongoDBStore({
  uri: mongodb.url,
  collection: NAMESPACES.DB_SESSIONS_COLLECTION_NAME,
});

//resave: false => if cookie will never change
//
app.use(helmet());
app.use(bodyParser.json());
app.use(
  session({
    secret: NAMESPACES.SESSION_SECRET,
    name: NAMESPACES.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      // new Date(Date.now() + 24 * 60 * 60 * 1000) => 24 h
      //parseInt
      maxAge: 600000,
      secure: NAMESPACES.IS_PRODUCTION,
      sameSite: false,
      httpOnly: false,
    },
  })
);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", contactRoutes);
app.use("/api", uploadedContactRoutes);
app.use("/api", filingRoutes);
app.use("/api", messagingRoutes);

mongoose.connect(mongodb.url, mongodb.options).then((result) => {
  console.log(`${NAMESPACES.SERVER} connected`);
  app.listen(APP_PORT, () => {
    console.log(`Server run on: ${APP_PORT} port.`);
  });
});
mongoose.connection.on("error", (error) => {
  console.log(`DB connection error: ${error.message}`);
});
