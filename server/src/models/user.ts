import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  login: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  avatar: {
    type: String
  },
  comments: {
    type: []
  }
});

export default mongoose.model("User", userSchema);
