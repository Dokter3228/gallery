import express from "express";
import commentsController from "../controllers/commentsController";

const commentsRouter = express.Router();

commentsRouter.get("/comments/", commentsController.getCommentsByEntityIds);
commentsRouter.get("/:id/comments/", commentsController.getImageComments);
commentsRouter.post("/:id/comments/", commentsController.postImageComments);
commentsRouter.patch("/:id/comments/", commentsController.updateImageComments);

export { commentsRouter };
