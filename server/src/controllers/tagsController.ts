import Image from "../models/image";
import { Tag } from "../models/tags";
import { type Request, type Response } from "express";

class TagsController {
  async postTags(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const id = req.params.id;
      const tags = req.body;
      const image = await Image.findById(id);
      if (image != null) {
        for (const tag of tags) {
          const tagDb = new Tag({
            name: tag.name,
            imageId: image._id,
            author: req.body.user,
          });
          await tagDb.save();
          image?.tags.push(tagDb._id.toString());
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

  async patchTags(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const tags = req.body;
      const result = [];
      for await (const tag of tags) {
        const tagDb = await Tag.findByIdAndUpdate(tag._id, tag, { lean: true });
        result.push(tagDb);
      }
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "id error") return res.status(400).json("tag can't be edited without '_id' property");
        if (error.message === "auth error") return res.status(401).json("you're not authorized to edit this comment");
        res.status(400).json({ message: error.message });
      }
    }
  }
}

export default new TagsController();
