import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import { config } from "dotenv";
import cors from "cors";

import { userRouter } from "./routes/userRoutes";
import { imageRouter } from "./routes/imageRoutes";
import { authMiddleware } from "./middleware/auth";
import * as process from "process";
import { authRouter } from "./routes/authRoutes";

config();
export const jwtSecretKey = process.env.JWT_SECRET_KEY ?? "default-secret-key";
export const port = process.env.PORT ?? 10000;

const mongoUrl = process.env.NODE_ENV === "production" ? process.env.MONGO_URL : process.env.MONGO_TESTURL;
void mongoose.connect(mongoUrl ?? "some backup link").then();
const database = mongoose.connection;

database.on("error", (err) => {
  console.log(err);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const app = express();
const whitelist = ["http://localhost:3000"];
const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (origin == null || whitelist.includes(origin)) {
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

app.use("/", authRouter);
app.use("/users", userRouter);
app.use("/images", authMiddleware, imageRouter);

export { app };
