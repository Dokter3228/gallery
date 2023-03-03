export const mockUser = {
  login: "Vladimir",
  password: "putin228",
  role: "user",
};

export const mockUserAdmin = {
  login: "Admin",
  password: "admin228",
  role: "admin",
};

export const mockCommentsWithNew = [
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

export const mockCommentsWithNewAndId = [
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

export const mockChangedComments = [
  {
    author: "Vladimir",
    text: "Austria",
  },
  {
    author: "Vladimir",
    text: "India",
  },
  {
    author: "Vladimir",
    text: "Vietnam",
  },
];
