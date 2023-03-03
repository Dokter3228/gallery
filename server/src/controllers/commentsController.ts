import Image from "../models/image";
import path from "path";
import { Comment, CommentType } from "../models/comments";
import User from "../models/user";
import * as process from "process";
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";

// Split to image and comment controller
class commentsController {
  async updateImageComments(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { comments } = req.body;
      for (let comment of comments) {
        if (!comment.author || !comment.new || !comment._id) {
          const error: {
            author?: string;
            new?: boolean | string;
            text?: string;
            _id?: string;
          } = {};
          const error2 = {
            author: comment.author || "Author isn't provided",
            new: comment.new || "New isn't provided",
            _id: comment._id || "Id isn't provided",
            text: comment.text,
          };
          if (!comment.author) error.author = "Author isn't provided";
          if (!comment.new) error.new = "New isn't provided";
          if (!comment._id) error._id = "Id isn't provided";
          throw error2;
        }
      }
      // const result = [];
      // for (let comment of comments) {
      //   // FIXME comment can't be string at all
      //   if (typeof comment === "string") {
      //     const commentDb = await Comment.findById(comment);
      //     result.push(commentDb);
      //   } else {
      //     const commentDb = new Comment({
      //       author,
      //       text: comment.text,
      //     });
      //     await commentDb.save();
      //     result.push(commentDb._id);
      //   }
      // }
      // console.log("sadfasdfczxczaasdfasdfasfasczxcz!!!asdfads", result);
      // const image = await Image.findByIdAndUpdate(
      //   id,
      //   { comments: result },
      //   { new: true },
      //   (e, docs) => {
      //     if (e) {
      //       console.log(e);
      //     } else {
      //       console.log("Updated User : ", docs);
      //     }
      //   }
      // )
      //   .clone()
      //   .catch(function (err) {
      //     console.log(err);
      //   });
      // console.log(image);
      // res.status(200).json(image);
    } catch (e) {
      res.status(400).json(e);
    }
  }

  async postImageComments(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { comments } = req.body;
      let image = await Image.findById(id);
      for (let comment of comments) {
        if (comment.new && comment._id) throw new Error("new error");
        const commentDb = new Comment({
          author: comment.author,
          text: comment.text,
        });
        const user = await User.findOne({ login: comment.author });
        if (user?.comments) user.comments.push(commentDb);
        if (image?.comments) image.comments.push(commentDb);
        await commentDb.save();
        await user.save();
      }
      await image.save();
      res.status(200).json(image);
    } catch (e) {
      if (e.message === "new error") {
        res
          .status(400)
          .json({ new: "property 'new' can't be in the comment with 'id'" });
      } else {
        res.status(400).json({ message: e.message });
      }
    }
  }

  async getImageComments(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const imageDb = await Image.findById(id);
      const comments = [];
      for await (let commentDb of imageDb.comments) {
        comments.push(await Comment.findById(commentDb));
      }
      res.status(200).json(comments);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async getCommentsByEntityIds(req: Request, res: Response) {
    try {
      const comments = req.body;
      const result = [];
      for (let commentId of comments) {
        const commentDb = await Comment.findById(commentId);
        result.push(commentDb);
      }
      res.status(200).json(result);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}

export default new commentsController();
