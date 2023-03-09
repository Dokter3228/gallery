import express from "express";
import imageController from "../controllers/imageController";
import { commentsRouter } from "./commentsRoutes";
import { tagsRouter } from "./tagsRoutes";
import fileUpload from "express-fileupload";
const imageRouter = express.Router();

imageRouter.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 2000000, // 2mb limit
    },
    abortOnLimit: true,
  })
);

imageRouter.get("/", (req, res) => {
  void imageController.getImages(req, res);
});

imageRouter.post("/", (req, res) => {
  void imageController.postImage(req, res);
});

imageRouter.get("/:id", (req, res) => {
  void imageController.getImage(req, res);
});

imageRouter.delete("/:id", (req, res) => {
  void imageController.deleteImage(req, res);
});
imageRouter.use("/", commentsRouter);
imageRouter.use("/", tagsRouter);

export { imageRouter };
