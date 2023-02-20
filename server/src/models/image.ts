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
    // comments: String[]

});


// {
//     href: "http://localhost:17214/image3434l;jkl"
//     author: "Vasia",
//     uuid: "123123asd",
//     creationDate: Date.now(),
//     updatedDate: Date.now(),
//     comments: ['sadfasdas',"SADASDSA"]
// }

export type Comment = {
    author: string,
    text: string
    // id: EntityId;
}

export type Author = {
    login: string,
    name?: string,
    avatar?: string,
    // images: EntityId[];
    // comments: EntityId[];
}


export default mongoose.model("Image", imageSchema);
