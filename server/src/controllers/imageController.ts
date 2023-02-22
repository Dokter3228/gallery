import Image from "../models/image";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { Comment } from "../models/comments";
class imageController {
  async setImage(req, res) {
    try {
      // const token = req.headers?.cookie.split('set-cookie=').join('');
      // const {login = "somebody"} = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // FIXME looks wierd
      const login = req.body.login;
      const comment = req.body.comment;
      // FIXME refactor to nanoid
      const uuid = uuidv4();
      let image;
      let uploadPath;
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }
      image = req.files.image;
      const fileExtension = image.name.split(".")[1];
      // FIXME looks wierd
      uploadPath =
        path.resolve(__dirname, "..", "..", "public/images") +
        "/" +
        uuid +
        "." +
        fileExtension;
      const date = new Date().toLocaleDateString();
      const imageDb = new Image({
        author: login,
        uuid: uuid,
        creationDate: date,
        comments: [],
        src: "http://localhost:17548/images/" + uuid + "." + fileExtension,
      });
      const imageToSave = await imageDb.save();
      image.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
        res.status(200).send(imageToSave);
      });
    } catch (e) {
      if (e.name === "TokenExpiredError") {
        res.status(400).send("Your jwt expired, login again");
      } else {
        res.status(400).send(e);
      }
    }
  }

  // FIXME resolve author, comments, dates
  async getImageMeta(req, res) {
    const uuid = req.params.id;
    const image = await Image.findOne({ uuid: uuid });
    res.status(200).json(image);
  }

  async changeImageMeta(req, res) {
    const { uuid, comment, author } = req.body;
    const image = await Image.findOne({ uuid: uuid });
    const commentDb = new Comment({
      author,
      text: comment,
    });
    await commentDb.save();
    // @ts-ignore
    await image.comments.push(commentDb);
    await image.save();
    res.status(200).json(image);
  }

  async getAllImages(req, res) {
    const imagesData = [];
    const imagesDb = await Image.find();
    for (const img of imagesDb) {
      const coms = [];
      for (const imgCom of img.comments) {
        const com = await Comment.findById(imgCom);
        coms.push({
          author: com.author,
          text: com.text,
        });
      }
      const imgData = {
        uuid: img.uuid,
        author: img.author,
        comments: coms,
        src: img.src,
        creationDate: img.creationDate,
      };
      imagesData.push(imgData);
    }
    res.status(200).json(imagesData);
  }
}

export default new imageController();
