import mongoose from "mongoose";
import express from "express";
import routes from "./routes/routes";
import {config} from "dotenv";

config();
const port = process.env.PORT;
const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl);
const database = mongoose.connection;

database.on("error", (err) => {
  console.log(err);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const app = express();

app.use(express.json());

app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});

app.use("/users", routes);

export{app};
