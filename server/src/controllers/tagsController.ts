import Image from "../models/image";
import { Tag } from "../models/tags";

class tagsController {
  async postTags(req, res) {
    try {
      const id = req.params.id;
      const tags = req.body;
      const image = await Image.findById(id);

      for (let tag of tags) {
        if (!tag.new) throw new Error("new error");
        const tagDb = new Tag({
          name: tag.name,
          imageId: image._id,
          author: req.body.user,
        });
        await tagDb.save();
        image.tags.push(tagDb._id.toString());
      }
      await image.save();

      res.status(200).json(image);
    } catch (e) {
      if (e.message === "new error")
        return res
          .status(400)
          .json("tag can't be added without 'new' property");
      res.status(400).json({ message: e.message });
    }
  }

  async patchTags(req, res) {
    try {
      const id = req.params.id;
      const tags = req.body;

      const image = await Image.findById(id);

      const result = [];
      for (let tag of tags) {
        let index;
        const doesTagExist = image.tags.findIndex((imgTag, ind) => {
          index = ind;
          return imgTag === tag._id;
        });
        if (doesTagExist === -1) {
          image.tags.splice(index, 1);
        }
        if (!tag._id) throw new Error("id error");
        const tagDb = await Tag.findById(tag._id.toString());
        if (tagDb.author !== req.body.user) throw new Error("auth error");
        tagDb.name = tag.name;
        await tagDb.save();
        result.push(tagDb);
      }
      await image.save();
      res.status(200).json(result);
    } catch (e) {
      if (e.message === "id error")
        return res
          .status(400)
          .json("tag can't be edited without '_id' property");
      if (e.message === "auth error")
        return res
          .status(401)
          .json("you're not authorized to edit this comment");
      res.status(400).json({ message: e.message });
    }
  }
}

export default new tagsController();
