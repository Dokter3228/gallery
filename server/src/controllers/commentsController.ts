import Image from "../models/image";
import { Comment, type CommentType } from "../models/comments";
import User from "../models/user";
import { type Request, type Response } from "express";

class CommentsController {
  async updateImageComments(req: Request, res: Response): Promise<void> {
    try {
      const { comments }: { comments: CommentType[] } = req.body;

      const user = await User.findOne({ login: req.body.user });

      const updatedComments = [];
      for (const comment of comments) {
        const condition = "author" in comment || ("new" in comment && false) || "_id" in comment;
        if (!condition) {
          const error = {
            author: comment.author ?? "Author isn't provided",
            new: "new" in comment ? comment.new : "New isn't provided",
            _id: "_id" in comment ? comment._id : "_id isn't provided",
          };
          res.status(400).json(error);
          return;
        }
        if (user != null && "author" in comment && comment.author !== user.login && user.role !== "admin")
          throw new Error("You can't edit this comment");

        const commentDb = await Comment.findById(comment._id);
        if (commentDb != null) {
          commentDb.text = comment.text;
          updatedComments.push(commentDb);
          await commentDb.save();
        }
      }
      res.status(200).json(updatedComments);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "You can't edit this comment") {
          res.status(401).json({ message: error.message });
          return;
        }
        res.status(400).json({ message: error.message });
      }
    }
  }

  async postImageComments(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      const { comments }: { comments: CommentType[] } = req.body;

      const image = await Image.findById(id);
      for (const comment of comments) {
        if ("new" in comment && "_id" in comment) throw new Error("new error");
        const commentDb = new Comment({
          author: comment.author,
          text: comment.text,
        });

        const user = await User.findOne({ login: comment.author });

        if (user?.comments != null) user.comments.push(commentDb._id.toString());
        if (image?.comments != null) image.comments.push(commentDb._id.toString());
        await commentDb.save();
        user != null && (await user.save());
      }

      image != null && (await image.save());
      res.status(200).json(image);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "new error") {
          res.status(400).json({
            new: "property 'new' can't be in the comment together with 'id'",
          });
        } else {
          res.status(400).json({ message: error.message });
        }
      }
    }
  }

  async getImageComments(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const imageDb = await Image.findById(id);
      const comments = [];

      if (imageDb != null) {
        for await (const commentDb of imageDb.comments) {
          comments.push(await Comment.findById(commentDb));
        }
      }

      res.status(200).json(comments);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  async getCommentsByEntityIds(req: Request, res: Response): Promise<void> {
    try {
      const comments = req.body;

      const result = [];
      for (const commentId of comments) {
        const commentDb = await Comment.findById(commentId);
        result.push(commentDb);
      }

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
}

export default new CommentsController();
