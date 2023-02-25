import express from "express";
const fileUpload = require("express-fileupload");
import imageController from "../controllers/imageController";
import {authMiddleware} from "../middleware/auth";
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
imageRouter.get("/:id", imageController.getImageMeta);
imageRouter.post("/comments/", imageController.setImageComments)
imageRouter.post("/:id", imageController.setImage);
imageRouter.put("/:id", imageController.setImageComment);
imageRouter.delete("/:id");
// FIXME why this looks wired in rest api and what is the correct endpoint path
// FIXME  /image/:id patch -> add/remove/comments.
// add comment -> new uuid
// patch comment -> new uuid
// remove comment of image -> UUID[]

export { imageRouter };
