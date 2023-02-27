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

imageRouter.get("/", imageController.getAllImages);
// TODO get image by id
imageRouter.post("/comments/", imageController.setImageComments);
imageRouter.delete("/:id/comments/", imageController.deleteComments); // delete comments by image id  when in body : string[]
imageRouter.patch("/:id/comments/", imageController.deleteComments); // delete comments by image id  when in body []
// FIXME  /image/:id patch -> add/remove/comments.
// example OF PATCH

// COME TO FRONT PART OF getImageById
// const comments = [
// {author: "123", text: "asdasd",}
// {author: "2", text: "asdfas", id: 'asdasd'} =>  {author: "2", text: "ASDASDASD", id: 'asdasd'}
// {author: "SADF", text: "ASDASD",}
// ]

// [
// {author: "2", text: "ASDASDASD", id: 'asdasd'}
// ]

// example OF POST

// COME TO FRONT PART OF getImageById
// const comments = [
// {author: "123", text: "asdasd",}
// {author: "2", text: "asdfas", id: 'asdasd'} =>  {author: "2", text: "ASDASDASD", id: 'asdasd'}
// {author: "SADF", text: "ASDASD",}
// ]

// [
// {author: "2", text: "ASDASDASD", id: 'asdasd'}
// ] this remains only one comment on the image cause verb was POST

imageRouter.post("/:id", imageController.setImage);
imageRouter.delete("/:id", imageController.deleteImage);

export { imageRouter };
