import Image from "../models/image";
import { v4 as uuidv4 } from 'uuid';
import path from "path";
import jwt from "jsonwebtoken";

class imageController {
    async setImage (req,res ) {
        try {
            // const token = req.headers?.cookie.split('set-cookie=').join('');
            // const {login = "somebody"} = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const login = req.body.login
            const comment = req.body.comment;
            const uuid = uuidv4();
            let image;
            let uploadPath;
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send('No files were uploaded.');
            }
            image = req.files.image;
            const fileExtension = image.name.split('.')[1]
            uploadPath = path.resolve(__dirname, '..', '..', "public/images" ) + "/" + uuid + "."+  fileExtension;
            const date = new Date().toLocaleDateString();
            // Use the mv() method to place the file somewhere on your server
            const imageDb = new Image({
                author: login,
                uuid: uuid,
                date: date,
                comment: comment
            })
            const imageToSave = await imageDb.save();
            image.mv(uploadPath, function (err) {
                if (err)
                    return res.status(500).send(err);
                res.status(200).send(imageToSave);
            })
        } catch (e) {
            if(e.name === 'TokenExpiredError') {
                res.status(400).send("Your jwt expired, login again")
            } else {
                res.status(400).send(e)
            }

        }
    }

    async getImageMeta (req,res) {
        const uuid = req.params.id;
        const image = await Image.findOne(
            { uuid: uuid }
        )
        res.status(200).json(image)
    }

    async changeImageMeta(req,res) {
        const uuid = req.params.id;
        const {author, comment} = req.body;
        const image = await Image.findOne(
            { uuid: uuid }
        )
        image.author = author;
        image.comment = comment;
        await image.save()
        res.json(image);
    }

    async getAllImages(req,res) {
        const uuidsArray = []
        const images = await Image.find();
        images.forEach(img => {
            uuidsArray.push(img.uuid)
        })
        res.send(uuidsArray)
    }
}


export default new imageController();