const mongoose = require("mongoose");
// FIXME
const User = require("./models/user");
const supertest = require("supertest");
const app = require("./index");
const request = supertest(app);

const mockUser = {
  login: "Vladimir",
  password: "putin228",
};

const mockUsers = [
  {
    login: "Evgeniy",
    password: "zelensky322",
  },
  {
    login: "Vladimir",
    password: "putin228",
  },
];

describe("/users", () => {
  beforeAll(() => {
    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    let userName = new User(mockUser);
    await userName.save();
  });

  afterEach(async () => {
    User.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("creating user", async () => {
    const res = await request
      .post("/users/newUser")
      .send({ login: mockUser.login, password: mockUser.password });

    expect(res.status).toBe(301);
    expect(res.body.login).toBe(mockUser.login);
    expect(res.body.password).toBe(mockUser.password);

    // айди из монги
    // expect(res.body._id).toBe("user");
    const savedUser = await User.findById(res.body._id);
    expect(savedUser.login).toBe(res.body.login);
    expect(savedUser.password).toBe(res.body.password);
  });

  test("login user", async () => {
    try {
      const res = await request
        .post("/users/login")
        .send({ login: mockUser.login, password: mockUser.password });
      expect(res.status).toBe(200);
      expect(res.body.login).toBe(mockUser.login);
      expect(res.body.password).toBe(mockUser.password);

      const cookies = res.headers["Set-Cookie"];

      // cookies : { [key:string] : string}
    } catch (error) {
      res.send(error);
    }
  });

  // it("user/logout GET ", async () => {
  //   const res = await request.get("/user/logout");

  //   const cookies = resp.headers["set-cookie"];

  //   expect(res.status).toBe(200);
  //   expect(res.body.login).toBe(userName.login);
  //   expect(res.body.password).toBe(userName.password);

  //   // айди из монги
  //   expect(res.body._id).toBe("user");

  //   const savedUser = await User.findById(res.body._id);
  //   expect(savedUser.login).toBe(res.body.login);
  //   expect(savedUser.password).toBe(res.body.password);

  //   expect(cookies.token).toBeFalsy();
  //   done();
  // });
});
