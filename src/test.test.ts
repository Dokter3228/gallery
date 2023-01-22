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
      jest.setTimeout(60000)
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
    test('Successfully uploads jpg image', (done) => {
        const req = request(app)
            .post(`${ROOT_URL}${endpoints.add_image.route}`)
            .set('Authorization', `Bearer ${process.env.testUserJWT}`)
            .set('content-type', 'application/octet-stream')

        const imgStream = fs.createReadStream(testImage);
        imgStream.on('end', () => req.end(done));
        imgStream.pipe(req, {end: false})
    })
})

    describe("/images", () => {
        describe("if logged in", () => {
            it(" in can post image", async () => {
                const req = await request(app).post("/image/1")
                    // FIXME
                    .attach('files', `${__dirname}/test.jpg`)
                expect(req.headers["set-cookie"]).toBeTruthy();
                expect(req.status).toBe(301);
                expect(req.body.uuid).toBe("string");
            });
            it("can get image meta", async () => {
                const res = await request(app).get("/image/meta/1");
                expect(res.headers["set-cookie"]).toBeFalsy();
                expect(res.body.id).toBe(1);
                expect(res.body.uuid).toBe("string");
                expect(res.body.author).toBe(mockUser.login);
                expect(res.body.date).toBeTruthy();
                expect(res.body.comments).toBe('');
            });
            it("can change image meta", async () => {
                const res = await request(app).put("/image/meta/1")
                    .send({ author: 'Jon', comment: 'HELLO WORLD' });
                expect(res.headers["set-cookie"]).toBeFalsy();
                expect(res.body.id).toBe(1);
                expect(res.body.uuid).toBe("string");
                expect(res.body.author).toBe("Jon");
                expect(res.body.date).toBeTruthy();
                expect(res.body.comment).toBe('HELLO WORLD');
            });
            it("in can get image", async () => {
                const res = await request(app).get("/image/1");
                expect(res.status).toBe(200);
                expect(res.headers["set-cookie"]).toBeTruthy();
                expect(res.headers["contentType"]).toBe('png');
            });

        })
        describe("if  not logged in", () => {

        it("image can't be post", async () => {
            const res = await request(app).post("/image/1");
            expect(res.headers["set-cookie"]).toBeFalsy();
            expect(res.status).toBe(401);
        });
        it("i image can't be got", async () => {
            const res = await request(app).get("/image/1");
            expect(res.headers["set-cookie"]).toBeFalsy();
            expect(res.status).toBe(401);
        });
    });
});
