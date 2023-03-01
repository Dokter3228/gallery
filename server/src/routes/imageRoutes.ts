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
// body []
// FIXME  /images/:id patch -> add/remove/comments.
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
export { imageRouter };

// [
// "63fe5358f5a2fff2d4297986",
// "63fe5358f5a2fff2d4297989"
// ];

// {
//     "author": "somebody",
//     "text": "some testing text",
//     "_id": "63fe5358f5a2fff2d4297986"
// },
// {
//     "author": "somebody",
//     "text": "some other testing text",
//     "_id": "63fe5358f5a2fff2d4297989"
// }
