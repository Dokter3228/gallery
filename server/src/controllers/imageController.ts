import Image from "../models/image";
import path from "path";
import User from "../models/user";
import * as process from "process";
import { type Request, type Response } from "express";
import { v4 as uuid } from "uuid";
import { Comment } from "../models/comments";
import * as fs from "fs";
import { port } from "../index";

class ImageController {
  async getImages(req: Request, res: Response): Promise<void> {
    const imagesDb = await Image.find();
    res.status(200).json(imagesDb);
  }

  async postImage(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const { author } = req.body;
      const id = uuid();
      let uploadPath;
      if (req.files == null || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }
      const image = req.files.image;
      if (!Array.isArray(image)) {
        const fileExtension = image.name.split(".")[1];
        uploadPath =
          process.env.NODE_ENV === "production"
            ? path.join(process.cwd(), "/public/images") + `/${id}.${fileExtension}`
            : path.join(process.cwd(), "/public/testImages") + `/${id}.${fileExtension}`;
        const date = new Date().toLocaleDateString();
        const imageDb = new Image({
          author,
          creationDate: date,
          src: `http://localhost:${port}/${
            process.env.NODE_ENV === "production" ? "images" : "testImages"
          }/${id}.${fileExtension}`,
        });
        const user = await User.findOne({ login: author });
        user != null && (await user.save());
        const imageToSave = await imageDb.save();
        image.mv(uploadPath, function () {
          res.status(200).json(imageToSave);
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(403).json({ message: error.message });
      }
    }
  }

  async getImage(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const imageDb = await Image.findById(id);
      res.status(200).json(imageDb);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const image = await Image.findById(id);
      if (image != null) {
        const user = await User.findOne({ login: image.author });
        if (user != null) {
          for (const comment of image.comments) {
            await Comment.deleteOne({ _id: comment });
            const commentIndex = user.comments.indexOf(comment.toString());
            if (commentIndex !== -1) user.comments.splice(commentIndex, 1);
          }
          const imageIndex = user.images.indexOf(image._id.toString());
          if (imageIndex !== -1) user.images.splice(imageIndex, 1);

          void user.save();

          const deletedImage = await Image.findByIdAndDelete(id);
          if (deletedImage != null) {
            const deletePath =
              process.env.NODE_ENV === "production"
                ? path.join(process.cwd(), "/public/images") + `/${deletedImage.src.split("images/")[1]}`
                : path.join(process.cwd(), "/public/testImages") + `/${deletedImage.src.split("testImages/")[1]}`;
            console.log(deletePath);
            fs.unlink(deletePath, (err) => {
              if (err !== null) console.log(err);
            });
          }
          res.status(200).json(deletedImage);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: "Something went wrong while deleting the image" });
      }
    }
  }
}

export default new ImageController();
