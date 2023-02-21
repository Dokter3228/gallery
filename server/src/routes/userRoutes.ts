import express from "express";
import cookieParser from "cookie-parser";
import userController from "../controllers/userController";
import cookieController from "../controllers/cookieController";
const userRouter = express.Router();

userRouter.use(cookieParser("secret key"));

// FIXME why this looks wired in rest api and what is the correct endpoint path
userRouter.post("/newUser", userController.newUser);
userRouter.post("/login",  userController.login);
userRouter.post("/logout", userController.logout);
// FIXME patch user-meta/:id name/avatar -> user
// FIXME why this looks wired in rest api and what is the correct endpoint path
userRouter.post("/getUser", cookieController.checkAuth)
userRouter.post('/checkCookie', cookieController.authCheckCookie)
// FIXME add prettier
export{userRouter};
