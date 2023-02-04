import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    author: {
        required: true,
        type: String,
    },
    uuid: {
        required: true,
        type: String,
    },
    date: {
        require: true,
        type: String
    },
    comment: {
        type: String
    }
});

export default mongoose.model("Image", imageSchema);
