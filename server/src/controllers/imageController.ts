import Image from "../models/image";
import path from "path";
import User from "../models/user";
import * as process from "process";
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";

class imageController {
  async getImages(req: Request, res: Response) {
    const imagesDb = await Image.find();
    res.status(200).json(imagesDb);
  }

  async postImage(req: Request, res: Response) {
    try {
      const { author } = req.body;
      const id = uuid();
      let image;
      let uploadPath;
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }
      image = req.files.image;
      const fileExtension = image.name.split(".")[1];
      uploadPath =
        path.join(process.cwd(), "/public/images") + `/${id}.${fileExtension}`;
      const date = new Date().toLocaleDateString();
      const imageDb = new Image({
        author: author,
        creationDate: date,
        src: `http://localhost:${process.env.PORT}/images/${id}.${fileExtension}`,
      });
      const user = await User.findOne({ login: author });
      await user.save();
      const imageToSave = await imageDb.save();
      image.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
        res.status(200).json(imageToSave);
      });
    } catch (e) {
      res.status(403).json({ message: e.message });
    }
  }

  async getImage(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const imageDb = await Image.findById(id);
      res.status(200).json(imageDb);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async deleteImage(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const image = await Image.findById(id);
      const user = await User.findOne({ login: image.author });
      // TODO add this realization

      // for (let comment of image.comments) {
      //   const commentDb = await Comment.deleteOne({ _id: comment });
      //   // @ts-ignore

      //   const index = user.comments.indexOf(comment._id);
      //   if (index != -1) {
      //     user.comments.splice(index, 1);
      //   }
      // }
      // @ts-ignore
      // const imageIndex = user.images.indexOf(image._id);
      // if (imageIndex != -1) {
      //   user.images.splice(imageIndex, 1);
      // }
      // user.save();
      const deletedImage = await Image.findByIdAndDelete(id);
      res.status(200).json(deletedImage);
    } catch (e) {
      res
        .status(400)
        .json({ error: "Something went wrong when deleting the image" });
    }
  }
}

export default new imageController();
