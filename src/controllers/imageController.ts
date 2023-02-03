
import { v4 as uuidv4 } from 'uuid';

class imageController {
    async setImage (req,res ){
        const uuid = uuidv4();
        let image;
        let uploadPath;
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        image = req.files.image;
        const fileExtension = image.name.split('.')[1]
        uploadPath = "/home/linux/Desktop/gallery/src/testImages/" + uuid + "."+  fileExtension;
        // Use the mv() method to place the file somewhere on your server
        image.mv(uploadPath, function (err) {
            if (err)
                return res.status(500).send(err);
            res.status(301).send({uuid: uuid, name: image.name});
        })
    }
}


export default new imageController();