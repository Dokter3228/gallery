import Image from "../models/image";
import path from "path";
import { Comment, CommentType } from "../models/comments";
import User from "../models/user";
import * as process from "process";
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";

class commentsController {
  async updateImageComments(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { comments } = req.body;
      const user = User.findById({ login: req.body.user });
      for (let comment of comments) {
        if (comment?.author !== user.login && user.role !== "admin") continue;
        if (!comment.author || !comment.new || !comment._id) {
          const error = {
            author: comment.author || "Author isn't provided",
            new: comment.new || "New isn't provided",
            _id: comment._id || "Id isn't provided",
            text: comment.text,
          };
          throw error;
        }
      }
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
