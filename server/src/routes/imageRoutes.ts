import express from "express";
const fileUpload = require("express-fileupload");
import imageController from "../controllers/imageController";
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
// Rest api
imageRouter.get("/", imageController.getAllImages);
imageRouter.post("/comments/", imageController.setImageComments);
imageRouter.delete("/:id/comments/", imageController.deleteComments);
imageRouter.post("/:id", imageController.setImage);
imageRouter.delete("/:id", imageController.deleteImage);
// FIXME  /image/:id patch -> add/remove/comments.

// add comment -> new uuid
// patch comment -> new uuid
// remove comment of image -> UUID[]

export { imageRouter };
