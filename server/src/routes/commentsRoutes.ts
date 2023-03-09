import express from "express";
import commentsController from "../controllers/commentsController";

const commentsRouter = express.Router();

commentsRouter.get("/comments/", (req, res) => {
  void commentsController.getCommentsByEntityIds(req, res);
});
commentsRouter.get("/:id/comments/", (req, res) => {
  void commentsController.getImageComments(req, res);
});

commentsRouter.post("/:id/comments/", (req, res) => {
  void commentsController.postImageComments(req, res);
});

commentsRouter.patch("/:id/comments/", (req, res) => {
  void commentsController.updateImageComments(req, res);
});

export { commentsRouter };
