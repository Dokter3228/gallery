import mongoose from "mongoose";

import {app} from "./server";
import request from "supertest";

import User from "./models/user";
import * as fs from "fs";


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
      jest.setTimeout(60000);
    const res =  await request(app)
        .post("/users/login")
        .send({ login: mockUser.login, password: mockUser.password });
    expect(res.status).toBe(200);
    expect(res.body.login).toBe(mockUser.login);
    expect(res.body.password).toBe(mockUser.password);
    expect(res.headers["set-cookie"]).toBeTruthy();
  });

  it("logout", async () => {
    const res = await request(app).post("/users/logout");
    expect(res.status).toBe(200);
    console.log(res.headers["set-cookie"]);
    expect(res.headers["set-cookie"]).toBeTruthy();
  });

    it("check user authorisation", async () => {
        const res = await request(app).post("/users/checkauth");
        expect(res.status).toBe(401);
        expect(res.headers["set-cookie"]).toBeFalsy();
    });
})

describe('/images', ( )=> {
    beforeAll(async () => {
        mongoose.connect(process.env.MONGO_URL, {
        });
        const res =  await request(app)
            .post("/users/login")
            .send({ login: mockUser.login, password: mockUser.password });
    });
    afterAll(async () => {
        await mongoose.connection.close();
    })
    describe("if logged in", () => {

        it.only("can post image", async () => {
            const req = await request(app).post("/images/image/1").set('set-cookie', 'asdfaskjdfhaskjldfhalk')
                // FIXME
                .attach('image', `${__dirname}/car.jpg`)
            console.log(req)
            expect(req.headers['set-cookie']).toBeDefined();
            expect(req.status).toBe(301);
            expect(req.body.uuid).toBe("string");
        });

        it("can get image meta", async () => {
            const res = await request(app).get("/images/image/meta/1");
            expect(res.headers["set-cookie"]).toBeFalsy();
            expect(res.body.id).toBe(1);
            expect(res.body.uuid).toBe("string");
            expect(res.body.author).toBe(mockUser.login);
            expect(res.body.date).toBeTruthy();
            expect(res.body.comments).toBe('');
        });
        it("can change image meta", async () => {
            const res = await request(app).put("/images/image/meta/1")
                .send({ author: 'Jon', comment: 'HELLO WORLD' });
            expect(res.headers["set-cookie"]).toBeFalsy();
            expect(res.body.id).toBe(1);
            expect(res.body.uuid).toBe("string");
            expect(res.body.author).toBe("Jon");
            expect(res.body.date).toBeTruthy();
            expect(res.body.comment).toBe('HELLO WORLD');
        });
        it("in can get image", async () => {
            const res = await request(app).get("/images/image/1");
            expect(res.status).toBe(200);
            expect(res.headers["set-cookie"]).toBeTruthy();
            expect(res.headers["contentType"]).toBe('png');
        });
    })

    describe("if  not logged in", () => {
        beforeAll(() => {
            mongoose.connect(process.env.MONGO_URL, {
            });
        });
        afterAll(async () => {
            await mongoose.connection.close();
        })
        it("image can't be posted", async () => {
            const res = await request(app).post("/images/image/1");
            expect(res.headers["set-cookie"]).toBeFalsy();
            expect(res.status).toBe(401);
        });
        it("image can't be got", async () => {
            const res = await request(app).get("/images/image/1");
            expect(res.headers["set-cookie"]).toBeFalsy();
            expect(res.status).toBe(401);
        });
    });


});

