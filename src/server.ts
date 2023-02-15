import mongoose from "mongoose";
import express from "express";

import {config} from "dotenv";
config();

import {userRouter} from "./routes/userRoutes";
import {imageRouter} from "./routes/imageRoutes";

const port = process.env.PORT;
const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl).then();
const database = mongoose.connection;

database.on("error", (err) => {
  console.log(err);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.listen(port, () => {
});

app.use("/users", userRouter);


export{app};
