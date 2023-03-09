import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10;

export type UserType = {
  login: string;
  password: string;
  name?: string;
  avatar?: string;
  role: "user" | "admin";
  images: string[];
  comments: string[];
  _id?: string;
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
  role: {
    type: String,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  images: [
    {
      type: Schema.Types.ObjectId,
      ref: "Image",
    },
  ],
});

userSchema.pre("save", function (next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    next();
    return;
  }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err != null) {
      next(err);
      return;
    }

    // hash the password using our new salt
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err != null) {
        next(err);
        return;
      }
      // override the cleartext password with the hashed one
      this.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword: string | Buffer, cb: Comparer) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err != null) {
      cb(err);
      return;
    }
    cb(null, isMatch);
  });
};

export type Comparer = (err: Error | null, issMatch?: boolean) => void;

export default mongoose.model<UserType>("User", userSchema);
