import { UserType } from "../src/models/user";
import { CommentType } from "../src/models/comments";
import { TagType } from "../src/models/tags";

export const mockUser: UserType = {
  login: "Vladimir",
  password: "putin228",
  role: "user",
};

export const mockUser2: UserType = {
  login: "Abdul",
  password: "abrakadabra2018",
  role: "user",
};

export const mockUser3: UserType = {
  login: "Caren",
  password: "kasparov1337",
  role: "user",
};

export const mockUserAdmin: UserType = {
  login: "Admin",
  password: "admin228",
  role: "admin",
};

export const mockCommentsWithNew: CommentType[] = [
  {
    author: mockUser.login,
    text: "South Africa",
    new: true,
  },
  {
    author: mockUser.login,
    text: "Italy",
    new: true,
  },
  {
    author: mockUser.login,
    text: "United States",
    new: true,
  },
  {
    author: mockUser.login,
    text: "Singapore",
    new: true,
  },
  {
    author: mockUser.login,
    text: "Philippines",
    new: true,
  },
];

export const mockCommentsWithNewAndId: CommentType[] = [
  {
    author: "Vladimir",
    text: "South Africa",
    new: true,
    _id: "aos;fijaw;oefiawef",
  },
  {
    author: "Vladimir",
    text: "Italy",
    new: true,
  },
  {
    author: "Vladimir",
    text: "United States",
    new: true,
    _id: "aos;fijaw;oefiawef",
  },
  {
    author: "Vladimir",
    text: "Singapore",
    new: true,
  },
  {
    author: "Vladimir",
    text: "Philippines",
    new: true,
    _id: "aos;fijaw;oefiawef",
  },
];

export const mockAnotherCommentsWithNew: CommentType[] = [
  {
    author: "Vladimir",
    text: "Austria",
    new: true,
  },
  {
    author: "Vladimir",
    text: "India",
    new: true,
  },
  {
    author: "Vladimir",
    text: "Vietnam",
    new: true,
  },
];

export const mockTags: TagType[] = [
  {
    author: "Vladimir",
    name: "first tag",
    new: true,
  },
  {
    author: "Vladimir",
    name: "second tag",
    new: true,
  },
  {
    author: "Vladimir",
    name: "third tag",
    new: true,
  },
];
