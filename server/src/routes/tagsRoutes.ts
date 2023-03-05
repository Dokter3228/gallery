import express from "express";
import tagsController from "../controllers/tagsController";

const tagsRouter = express.Router();

tagsRouter.post("/:id/tags", tagsController.postTags);
tagsRouter.patch("/:id/tags", tagsController.patchTags);

export { tagsRouter };
