import express from "express";
import tagsController from "../controllers/tagsController";

const tagsRouter = express.Router();

tagsRouter.post("/:id/tags", (req, res) => {
  void tagsController.postTags(req, res);
});
tagsRouter.patch("/:id/tags", (req, res) => {
  void tagsController.patchTags(req, res);
});

export { tagsRouter };
