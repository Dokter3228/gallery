import express from "express";
import cookieParser from "cookie-parser";
import authController from "../controllers/authController";

const authRouter = express.Router();

authRouter.use(cookieParser("secret key"));

authRouter.post("/login", (req, res) => {
  void authController.login(req, res);
});
authRouter.post("/logout", (req, res) => {
  void authController.logout(req, res);
});
authRouter.post("/check-auth", authController.checkAuth);

export { authRouter };
