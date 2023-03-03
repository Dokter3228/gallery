import mongoose, { Schema } from "mongoose";
import { Comment, CommentType } from "./comments";
import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10;

export type UserType = {
  login: string;
  password: string;
  name?: string;
  avatar?: string;
  isAdmin?: boolean;
  images: [string];
  comments: CommentType[];
};

const userSchema = new mongoose.Schema<UserType>({
  login: {
    required: true,
    type: String,
  },
  name: {
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  avatar: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  comments: [String],
  // but RETAINS FULL COMMENT ARRAY! NOT OBJECT IDS ARRAY
  // {
  //   type: Schema.Types.ObjectId,
  //       ref: "Comment",
  // },
  // but RETAINS FULL COMMENT ARRAY! NOT OBJECT IDS ARRAY
  images: [String],
});

userSchema.pre("save", function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

export default mongoose.model<UserType>("User", userSchema);
