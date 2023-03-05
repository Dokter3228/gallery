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
      fileSize: 1000000, // 1mb limit
    },
    abortOnLimit: true,
  })
);

imageRouter.get("/", imageController.getImages); // get all images
imageRouter.post("/", imageController.postImage); // post one image
imageRouter.get("/:id", imageController.getImage); // get one image by id
imageRouter.delete("/:id", imageController.deleteImage); // delete one image by id
imageRouter.use("/", commentsRouter);
imageRouter.use("/", tagsRouter);

export { imageRouter };
