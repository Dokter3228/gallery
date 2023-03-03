import express from "express";
import cookieParser from "cookie-parser";
import authController from "../controllers/authController";

const authRouter = express.Router();

authRouter.use(cookieParser("secret key"));

authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.post("/checkAuth", authController.checkAuth);

export { authRouter };
