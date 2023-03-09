import express from "express";
import cookieParser from "cookie-parser";
import userController from "../controllers/userController";
import { adminCheckMiddleware } from "../middleware/admin";
const userRouter = express.Router();

userRouter.use(cookieParser("secret key"));

userRouter.post("/", (req, res) => {
  void userController.createNewUser(req, res);
});
userRouter.get("/:id", (req, res) => {
  void userController.getUser(req, res);
});

userRouter.patch(
  "/",
  (req, res, next) => {
    void adminCheckMiddleware(req, res, next);
  },
  (req, res) => {
    void userController.patchUser(req, res);
  }
);

export { userRouter };
