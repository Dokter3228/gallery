import express from "express";
import cookieParser from "cookie-parser";
import userController from "../controllers/userController";
const userRouter = express.Router();

userRouter.use(cookieParser("secret key"));

userRouter.post("/", userController.createNewUser);
userRouter.get("/:id", userController.getUser);

// FIXME patch user-meta/:id name/avatar -> user
export { userRouter };
