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

imageRouter.get("/", imageController.getImages); // get all images
imageRouter.post("/", imageController.postImage); // post one image
imageRouter.get("/comments/", imageController.getCommentsByEntityIds); // get comments by EntityId[]
imageRouter.get("/:id", imageController.getImage); // get one image by id
imageRouter.delete("/:id", imageController.deleteImage); // delete one image by id
imageRouter.get("/:id/comments/", imageController.getImageComments); // get image comments by ImageId
imageRouter.post("/:id/comments/", imageController.postImageComments); // change comments by image id  when string[]
imageRouter.patch("/:id/comments/", imageController.updateImageComments); // delete comments by image id  when in

export { imageRouter };
