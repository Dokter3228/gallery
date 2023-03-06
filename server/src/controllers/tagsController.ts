import Image from "../models/image";
import { Tag } from "../models/tags";
import { type Request, type Response } from "express";

class tagsController {
  async postTags(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const tags = req.body;
      const image = await Image.findById(id);
      if (image != null) {
        for (const tag of tags) {
          if (!tag.new) throw new Error("new error");
          const tagDb = new Tag({
            name: tag.name,
            imageId: image._id,
            author: req.body.user,
          });

          await tagDb.save();
          image && image.tags.push(tagDb._id.toString());
        }

        await image.save();
        res.status(200).json(image);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "new error") return res.status(400).json("tag can't be added without 'new' property");
        res.status(400).json({ message: error.message });
      }
    }
  }

  async patchTags(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const tags = req.body;

      const image = await Image.findById(id);

      const result = [];
      // if (image) {
      //   for (let tag of tags) {
      //     let index: number;
      //
      //     const doesTagExist = image.tags.findIndex((imgTag, ind) => {
      //       index = ind;
      //       return imgTag === tag._id;
      //     });
      //     if (doesTagExist === -1) {
      //       image.tags.splice(index, 1);
      //     }
      //
      //     if (!tag._id) throw new Error("id error");
      //
      //     const tagDb = await Tag.findById(tag._id.toString());
      //
      //     if (tagDb && tagDb.author !== req.body.user)
      //       throw new Error("auth error");
      //
      //     if (tagDb) {
      //       tagDb.name = tag.name;
      //       await tagDb.save();
      //       result.push(tagDb);
      //     }
      //   }
      //
      //   await image.save();
      //   res.status(200).json(result);
      // }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "id error") return res.status(400).json("tag can't be edited without '_id' property");
        if (error.message === "auth error") return res.status(401).json("you're not authorized to edit this comment");
        res.status(400).json({ message: error.message });
      }
    }
  }
}

export default new tagsController();
