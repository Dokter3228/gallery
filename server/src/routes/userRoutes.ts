import express from "express";
import cookieParser from "cookie-parser";
import userController from "../controllers/userController";
import cookieController from "../controllers/cookieController";
const userRouter = express.Router();

userRouter.use(cookieParser("secret key"));

userRouter.get("/:id", userController.getUser);
userRouter.post("/register", userController.createNewUser);
userRouter.post("/login", userController.login);
userRouter.post("/logout", userController.logout);
userRouter.post("/checkAuth", cookieController.checkAuth);
// FIXME patch user-meta/:id name/avatar -> user
export { userRouter };
