import express from "express";
import {v4 as uuid} from "uuid";

import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import User from "../models/user";
import userController from "../controllers/userController";
const userRouter = express.Router();
import checkAuth from '../../middleware/auth'
const sessions = {};


userRouter.use(cookieParser("secret key"));

userRouter.post("/newUser", userController.newUser);
userRouter.post("/login",  userController.login);
userRouter.post("/logout", userController.logout);
userRouter.post("/getUser", checkAuth)
export{userRouter};
