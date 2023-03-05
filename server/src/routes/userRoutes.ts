import express from "express";
import cookieParser from "cookie-parser";
import userController from "../controllers/userController";
import { adminCheckMiddleware } from "../middleware/admin";
import User from "../models/user";
const userRouter = express.Router();

userRouter.use(cookieParser("secret key"));

userRouter.post("/", userController.createNewUser);
userRouter.get("/:id", userController.getUser);
userRouter.patch("/", adminCheckMiddleware, userController.patchUser);
// FIXME patch user-meta/:id name/avatar -> user
export { userRouter };
