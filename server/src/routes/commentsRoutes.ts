import express from "express";
import commentsController from "../controllers/commentsController";

const commentsRouter = express.Router();

commentsRouter.get("/comments/", commentsController.getCommentsByEntityIds); // get comments by EntityId[]
commentsRouter.get("/:id/comments/", commentsController.getImageComments); // get image comments by ImageId
commentsRouter.post("/:id/comments/", commentsController.postImageComments); // change comments by image id  when string[]
commentsRouter.patch("/:id/comments/", commentsController.updateImageComments); // delete comments by image id  when in

export { commentsRouter };
