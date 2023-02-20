import mongoose from "mongoose";
import express from "express";

import {config} from "dotenv";
config();

import {userRouter} from "./routes/userRoutes";
import {imageRouter} from "./routes/imageRoutes";

const whitelist = ['http://localhost:3000'];

const cors=require("cors");
const corsOptions ={
  origin: "*",
  // origin: (origin, callback) => {
  //   if(whitelist.includes(origin))
  //     return callback(null, true)
  //
  //   callback(new Error('Not allowed by CORS'));
  // },
  // credentials:true,            //access-control-allow-credentials:true
  // optionSuccessStatus:200,
}



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

app.use(cors(corsOptions))

app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});

app.use("/users", userRouter);
app.use("/images", imageRouter);

app.get('/api', (req,res) => {
  res.json({
    name: "suck"
  })
})

export{app};
