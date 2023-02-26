import Image from "../models/image";
import path from "path";
import { Comment, CommentType } from "../models/comments";
import User from "../models/user";
import * as process from "process";
class imageController {
  async setImage(req, res) {
    try {
      const { login, uuid } = req.body;
      let image;
      let uploadPath;
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }
      image = req.files.image;
      const fileExtension = image.name.split(".")[1];
      uploadPath =
        path.resolve(__dirname, "..", "../public/images") +
        `/${uuid}.${fileExtension}`;
      const date = new Date().toLocaleDateString();
      const imageDb = new Image({
        author: login,
        uuid: uuid,
        creationDate: date,
        comments: [],
        src: `http://localhost:${process.env.PORT}/images/${uuid}.${fileExtension}`,
      });
      const user = await User.findOne({ login });
      // @ts-ignore
      user.images.push(imageDb);
      await user.save();
      const imageToSave = await imageDb.save();
      image.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
        res.status(200).send(imageToSave);
      });
    } catch (e) {
      res.status(402).send(e);
    }
  }

  async deleteImage(req, res) {
    try {
      const uuid = req.params.id;
      const image = await Image.findOne({ uuid: uuid });
      const user = await User.findOne({ login: image.author });
      for (let comment of image.comments) {
        const commentDb = await Comment.deleteOne({ _id: comment });
        // @ts-ignore
        const index = user.comments.indexOf(comment._id);
        if (index != -1) {
          user.comments.splice(index, 1);
        }
      }
      // @ts-ignore
      const imageIndex = user.images.indexOf(image._id);
      if (imageIndex != -1) {
        user.images.splice(imageIndex, 1);
      }
      user.save();
      const deletedImage = await Image.deleteOne({ uuid: uuid });
      res.status(200).json({ message: "Success" });
    } catch (e) {
      res
        .status(400)
        .json({ error: "Something went wrong when deleting the image" });
    }
  }

  async setImageComments(req, res) {
    const { comments } = req.body;
    for (let comment of comments) {
      const image = await Image.findOne({ uuid: comment.uuid });
      const user = await User.findOne({ login: comment.author });
      const commentDb = new Comment({
        author: comment.author,
        text: comment.text,
      });
      await commentDb.save();
      user.comments.push(commentDb);
      // @ts-ignore
      image.comments.push(commentDb);
      await image.save();
      await user.save();
    }
    res.status(200).json({ mes: "cool" });
  }

  async getAllImages(req, res) {
    const imagesData = [];
    const imagesDb = await Image.find();
    for (const img of imagesDb) {
      const comments: CommentType[] = [];
      for (const imgCom of img.comments) {
        const com = await Comment.findById(imgCom);
        comments.push({
          author: com.author,
          text: com.text,
        });
      }
      const imgData = {
        uuid: img.uuid,
        author: img.author,
        comments: comments,
        src: img.src,
        creationDate: img.creationDate,
      };
      imagesData.push(imgData);
    }
    res.status(200).json(imagesData);
  }
}

export default new imageController();
