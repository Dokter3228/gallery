import express from 'express';
const fileUpload = require('express-fileupload');
import { v4 as uuidv4 } from 'uuid';
import imageController from "../controllers/imageController";

const checkAuth = require('../../middleware/auth');

const imageRouter = express.Router();

// imageRouter.use(checkAuth)

imageRouter.use(fileUpload({
    createParentPath: true
}));


imageRouter.post('/image/:id', imageController.setImage);
imageRouter.get('/image/:id', imageController.getImageMeta)
imageRouter.put('/image/:id', imageController.changeImageMeta)

export{imageRouter};