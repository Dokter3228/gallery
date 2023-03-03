import mongoose, { mongo } from "mongoose";
import express from "express";
import morgan from "morgan";
import { config } from "dotenv";
const cors = require("cors");
config();

import { userRouter } from "./routes/userRoutes";
import { imageRouter } from "./routes/imageRoutes";
import { authMiddleware } from "./middleware/auth";
import * as process from "process";
import { authRouter } from "./routes/authRoutes";

// TODO -> rootisalie add proxy to cra => how does cors changes

const port = process.env.PORT;
const mongoUrl =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URL
    : process.env.MONGO_TESTURL;

console.log(mongoUrl);
mongoose.connect(mongoUrl).then();
const database = mongoose.connection;

database.on("error", (err) => {
  console.log(err);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const app = express();
const whitelist = ["http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(morgan("combined"));
app.use(express.json());
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server Started at port: ${port}`);
});

type ConfigResponse = {
  token: string; // bcrypt token
  domain: string; // localhost:PORT
};

app.use("/", authRouter);
app.use("/users", userRouter);
app.use("/images", authMiddleware, imageRouter);

export { app };
