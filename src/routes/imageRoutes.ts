import express from 'express';
const fileUpload = require('express-fileupload');
import { v4 as uuidv4 } from 'uuid';
import imageController from "../controllers/imageController";

const checkAuth = require('../../middleware/auth');

const imageRouter = express.Router();

imageRouter.use(checkAuth)

imageRouter.use(fileUpload({
    createParentPath: true
}));


imageRouter.post('/image/:id', imageController.setImage);

imageRouter.get('/image/:id', (req, res) => {
        const uuid = uuidv4();
        let image;
        let uploadPath;
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        image = req.files.image;
        uploadPath = "/home/linux/Desktop/gallery/src/testImages/" + image.name;
        console.log(req.files)
        // Use the mv() method to place the file somewhere on your server
        image.mv(uploadPath, function(err) {
            if (err)
                return res.status(500).send(err);

            res.status(301).send({uuid: uuid, name: image.name});
        });
})

export{imageRouter};