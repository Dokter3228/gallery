import mongoose from "mongoose";

import {app} from "./server";
import request from "supertest";

import User from "./models/user";


const mockUser = {
  login: "Vladimir",
  password: "putin228",
};

describe("/users", () => {
  beforeAll(() => {
    mongoose.connect(process.env.MONGO_URL, {
    });
  });

  beforeEach(async () => {
    let userName = new User(mockUser);
    await userName.save();
  });

  afterAll(async () => {
    await User.deleteMany();
    await mongoose.connection.close();
  });

  test("creating user",
      async () => {
        const res = await request(app)
            .post("/users/newUser")
            .send({login: mockUser.login, password: mockUser.password});

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
    const res =  await request(app)
        .post("/users/login")
        .send({ login: mockUser.login, password: mockUser.password });
    expect(res.status).toBe(200);
    expect(res.body.login).toBe(mockUser.login);
    expect(res.body.password).toBe(mockUser.password);
    expect(res.headers["set-cookie"]).toBeTruthy();
  });

  it("logout ", async () => {
    const res = await request(app).post("/users/logout");
    expect(res.status).toBe(200);
    console.log(res.headers["set-cookie"]);
    expect(res.headers["set-cookie"]).toBeFalsy();
  });
});