import express from "express";
const fileUpload = require("express-fileupload");
import imageController from "../controllers/imageController";
import { commentsRouter } from "./commentsRoutes";
import { tagsRouter } from "./tagsRoutes";
const imageRouter = express.Router();

imageRouter.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 2000000, // 2mb limit
    },
    abortOnLimit: true,
  })
);

imageRouter.get("/", imageController.getImages);
imageRouter.post("/", imageController.postImage);
imageRouter.get("/:id", imageController.getImage);
imageRouter.delete("/:id", imageController.deleteImage);
imageRouter.use("/", commentsRouter);
imageRouter.use("/", tagsRouter);

export { imageRouter };
