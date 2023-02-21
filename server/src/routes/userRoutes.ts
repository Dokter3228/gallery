import express from "express";
import cookieParser from "cookie-parser";
import userController from "../controllers/userController";
const userRouter = express.Router();
import checkAuth from '../middleware/auth'
import {authMiddleware} from "../middleware/authMiddleware";


userRouter.use(cookieParser("secret key"));

// FIXME why this looks wired in rest api and what is the correct endpoint path
userRouter.post("/newUser", userController.newUser);
userRouter.post("/login",  userController.login);
userRouter.post("/logout", userController.logout);
// FIXME patch user-meta/:id name/avatar -> user
// FIXME why this looks wired in rest api and what is the correct endpoint path
userRouter.post("/getUser", checkAuth)
userRouter.post('/checkCookie', authMiddleware)
// FIXME add prettier
export{userRouter};
