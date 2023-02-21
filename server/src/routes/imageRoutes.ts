import express from 'express';
const fileUpload = require('express-fileupload');
import imageController from "../controllers/imageController";
import {authMiddleware} from "../middleware/authMiddleware";
const imageRouter = express.Router();


imageRouter.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 1000000 // 1mb limit
    },
    abortOnLimit: true
}));


// Rest api
imageRouter.post('/image/:id', imageController.setImage);
imageRouter.get('/image/:id', imageController.getImageMeta)
// FIXME why this looks wired in rest api and what is the correct endpoint path
// FIXME  /image/:id patch -> add/remove/comments.
// add comment -> new uuid
// patch comment -> new uuid
// remove comment of image -> UUID[]
imageRouter.get('/allImages/', imageController.getAllImages)
imageRouter.put('/image/:id', imageController.changeImageMeta)

export{imageRouter};