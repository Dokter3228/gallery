import mongoose from "mongoose";
import { app } from "./server";
import request from "supertest";
import User from "./models/user";
import path from "path";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import Image from "./models/image";
import mock = jest.mock;
const mockUser = {
  login: "Vladimir",
  password: "putin228",
};

// FIXME
const mockComments = [
  {
    text: "1111111111111111111111111",
  },
  {
    text: "2222222222222222222222222222222",
  },
  {
    text: "33333333333333333333333333333333333",
  },
  {
    text: "444444444444444444444444444444444444",
  },
  {
    text: "5555555555555555555555555555555555555555",
  },
];

const mockChangedComments = [
  {
    text: "8888888888888888888888888888888888888",
  },
  {
    text: "1212121212121212121212121212121212121212",
  },
];

const mockImagePath = path.resolve(
  __dirname,
  "../mocks/images/thomas-shelby.jpg"
);

describe("main tests", () => {
  describe("/users", () => {
    describe("/register, /login, /logout, /:id(getUser) ", () => {
      beforeAll(async () => {
        // TODO add connection to test mongo server on 27020
        await mongoose.connect(process.env.MONGO_URL);
      });
      afterAll(async () => {
        await User.deleteOne({ login: mockUser.login }, (err, res) => {
          if (err) {
            res.status(500).send(err);
            return;
          }
          return true;
        })
          .clone()
          .catch(function (err) {
            console.log(err);
          });
        await mongoose.connection.close();
      });

      test("/register", async () => {
        const res = await request(app)
          //TODO change /users/register to /users
          .post("/users/register")
          .send({ login: mockUser.login, password: mockUser.password });

        expect(res.status).toBe(200);
        expect(res.body.login).toBe(mockUser.login);
        expect(res.body.password).toBe(mockUser.password);
        expect(res.body.comments.length).toBe(0);
        expect(res.body.images.length).toBe(0);
        const savedUser = await User.findById(res.body._id);
        expect(savedUser.login).toBe(res.body.login);
        expect(savedUser.password).toBe(res.body.password);
        expect(savedUser.comments.length).toBe(0);
        expect(savedUser.images.length).toBe(0);
        expect(
          res.headers["set-cookie"][0].includes("set-cookie=;")
        ).toBeFalsy();
      });

      test("/register when the user is already registered", async () => {
        const res = await request(app)
          .post("/users/register")
          .send({ login: mockUser.login, password: mockUser.password });
        expect(res.status).toBe(409);
      });

      test("/login", async () => {
        const res = await request(app)
          //TODO change to /login
          .post("/users/login")
          .send({ login: mockUser.login, password: mockUser.password });

        expect(res.status).toBe(200);
        const savedUser = await User.findById(res.body._id);
        expect(savedUser.login).toBe(res.body.login);
        // TODO this test must failed. to salt the password you need to use bcrypt
        // https://www.npmjs.com/package/mongoose-bcrypt
        expect(savedUser.password).toBe(res.body.password);
        // TODO change cookie name from set-cookie to "token"
        expect(
          res.headers["set-cookie"][0].includes("set-cookie=;")
        ).toBeFalsy();
      });

      test("/login with random credentials(user is not signed up)", async () => {
        const res = await request(app)
          .post("/users/login")
          // TODO add wrong credentials
          .send({ login: uuid(), password: uuid() });
        expect(res.status).toBe(401);
      });

      test("/:id get user by ObjectId", async () => {
        const savedUser = await User.findOne({ login: mockUser.login });
        const id = savedUser._id.toString();
        const res = await request(app).get(`/users/${id}`);
        expect(res.status).toBe(200);
        expect(res.body.login).toBe(savedUser.login);
        // TODO why do we send a user password. UNSAFE!
        expect(res.body.password).toBe(savedUser.password);
      });

      test("/logout", async () => {
        const res = await request(app).post("/users/logout");

        expect(res.status).toBe(200);
        // TODO remove this message
        expect(res.body.message).toBe("you logged out");
        expect(
          res.headers["set-cookie"][0].includes("set-cookie=;")
        ).toBeTruthy();
      });
    });
  });

  describe("/images/", () => {
    // TODO merge before all where you can
    beforeAll(async () => {
      await mongoose.connect(process.env.MONGO_URL);
      const res = await request(app)
        .post("/users/register")
        .send({ login: mockUser.login, password: mockUser.password });
      expect(res.status).toBe(200);
    });

    // TODO clear afterAll clear DB
    afterAll(async () => {
      await User.deleteOne({ login: mockUser.login }, (err, res) => {
        if (err) {
          res.status(500).send(err);
          return;
        }
        return true;
      })
        .clone()
        .catch(function (err) {
          console.log(err);
        });
      await mongoose.connection.close();
    });

    let imageId;
    test("POST / (one image)", async () => {
      const token = jwt.sign(
        {
          login: mockUser.login,
          password: mockUser.password,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" }
      );
      const res = await request(app)
        .post("/images/")
        .set("set-cookie", token)
        .attach("image", mockImagePath)
        .field("author", mockUser.login);

      imageId = res.body._id.toString();
      expect(res.status).toBe(200);
      const postedImage = await Image.findById(res.body._id.toString());
      expect(postedImage._id.toString()).toBe(res.body._id.toString());
      expect(postedImage.author).toBe(mockUser.login);
    });

    test("GET /:id (one image)", async () => {
      const token = jwt.sign(
        {
          login: mockUser.login,
          password: mockUser.password,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" }
      );
      const res = await request(app)
        .get(`/images/${imageId}`)
        .set("set-cookie", token);
      expect(res.status).toBe(200);
      expect(res.body.author).toBe(mockUser.login);
    });

    test("GET / (all images)", async () => {
      const token = jwt.sign(
        {
          login: mockUser.login,
          password: mockUser.password,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" }
      );
      const res = await request(app).get("/images/").set("set-cookie", token);
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    // TODO new POST
    test("POST /images/:id/comments", async () => {
      const token = jwt.sign(
        {
          login: mockUser.login,
          password: mockUser.password,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" }
      );

      const res = await request(app)
        .post(`/images/${imageId}/comments`)
        .set("set-cookie", token)
        .send({
          author: mockUser.login,
          comments: mockComments,
        });

      expect(res.status).toBe(200);
      expect(res.body.comments.length).toEqual(mockComments.length);
    });

    test("GET /images/:id/comments", async () => {
      const token = jwt.sign(
        {
          login: mockUser.login,
          password: mockUser.password,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" }
      );

      const res = await request(app)
        .get(`/images/${imageId}/comments`)
        .set("set-cookie", token);

      for (let comment of res.body.slice(0, 2)) {
        mockChangedComments.push(comment);
      }

      expect(res.status).toBe(200);
      expect(res.body.length).toEqual(mockComments.length);

      expect(
        res.body.every((comment) => {
          "author" in comment && "text" in comment;
        })
      ).toBe(true);
    });

    // TODO same as POST
    test("PATCH /images/:id/comments", async () => {
      const token = jwt.sign(
        {
          login: mockUser.login,
          password: mockUser.password,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" }
      );
      const res = await request(app)
        .patch(`/images/${imageId}/comments`)
        .set("set-cookie", token)
        .send({
          author: mockUser.login,
          comments: mockChangedComments,
        });
      expect(res.status).toBe(200);
      expect(res.body.comments.length).toEqual(4);
      expect(res.body._id).toBe(imageId);
    });
    // test("POST /images/:id/comments", async () => {
    //   const token = jwt.sign(
    //     {
    //       login: mockUser.login,
    //       password: mockUser.password,
    //     },
    //     process.env.JWT_SECRET_KEY,
    //     { expiresIn: "15m" }
    //   );
    //
    //   const res = await request(app)
    //     .post(`/images/${imageId}/comments`)
    //     .set("set-cookie", token)
    //     .send({
    //       author: mockUser.login,
    //       comments: [{ text: "new comment" , new: true, author:mockUser.login}],
    //     });
    //
    //   expect(res.status).toBe(200);
    //   expect(res.body.comments.length).toEqual(1);
    //
    //   const testId = res.body.comments[0].id;
    //
    //   const res2 = await request(app)
    //     .post(`/images/${imageId}/comments`)
    //     .set("set-cookie", token)
    //     .send({
    //       author: mockUser.login,
    //       comments: [{ text: "UPDATED TEXT", id: testId, new: true }],
    //     });
    //   expect(res2.status).toBe(400);
    //   expect(res2.body.new).toBe("property 'new' can't be in comment with 'id'");
    // });
    //
    // test("PATCH /images/:id/comments", async () => {
    //   const token = jwt.sign(
    //     {
    //       login: mockUser.login,
    //       password: mockUser.password,
    //     },
    //     process.env.JWT_SECRET_KEY,
    //     { expiresIn: "15m" }
    //   );
    //
    //   const res = await request(app)
    //     .post(`/images/${imageId}/comments`)
    //     .set("set-cookie", token)
    //     .send({
    //       author: mockUser.login,
    //       comments: [{ text: "new comment" }],
    //     });
    //
    //   expect(res.status).toBe(400);
    //   expect(res.body.author).toBe('Not exists');
    //   expect(res.body.new).toBe('Not exists');
    //
    //
    //
    //   const res2 = await request(app)
    //       .post(`/images/${imageId}/comments`)
    //       .set("set-cookie", token)
    //       .send({
    //         author: mockUser.login,
    //         comments: [{ text: "new comment", new: true }],
    //       });
    //
    //   expect(res2.status).toBe(400);
    //   expect(res2.body.author).toBe('Not exists');
    // });
    //
    //
    // test("correct POST /images/:id/comments", async () => {
    //   const token = jwt.sign(
    //     {
    //       login: mockUser.login,
    //       password: mockUser.password,
    //     },
    //     process.env.JWT_SECRET_KEY,
    //     { expiresIn: "15m" }
    //   );
    //   const res = await request(app)
    //     .patch(`/images/${imageId}/comments`)
    //     .set("set-cookie", token)
    //     .send({
    //       author: mockUser.login,
    //       comments: mockChangedComments,
    //     });
    //   expect(res.status).toBe(200);
    //   expect(res.body.comments.length).toEqual(mockChangedComments.length);
    //   expect(res.body._id).toBe(imageId);
    // });

    test("DELETE /:id (one image)", async () => {
      const token = jwt.sign(
        {
          login: mockUser.login,
          password: mockUser.password,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" }
      );
      const res = await request(app)
        .delete(`/images/${imageId}`)
        .set("set-cookie", token);
      expect(res.status).toBe(200);
      expect(res.body.author).toBe(mockUser.login);
      // TODO check db of user object
    });
  });
});

//
//   beforeEach(async () => {
//     let userName = new User(mockUser);
//     await userName.save();
//   });
//
//   afterEach(async () => {
//     User.deleteOne({ login: mockUser.login }, (err, res) => {
//       if (err) {
//         res.status(500).send(err);
//         return;
//       }
//       return true;
//     });
//   });
//
//   afterAll(async () => {
//     await User.deleteMany({ login: mockUser.login }, (err, res) => {
//       if (err) {
//         res.status(500).send(err);
//         return;
//       }
//       return true;
//     });
//     await mongoose.connection.close();
//   });
//
//   test.only("creating user", async () => {
//     const res = await request(app)
//       .post("/users/registration")
//       .send({ login: mockUser.login, password: mockUser.password });
//
//     expect(res.status).toBe(301);
//
//     expect(res.body.login).toBe(mockUser.login);
//     expect(res.body.password).toBe(mockUser.password);
//
//     // айди из монги
//     // expect(res.body._id).toBe("user");
//     const savedUser = await User.findById(res.body._id);
//     expect(savedUser.login).toBe(res.body.login);
//     expect(savedUser.password).toBe(res.body.password);
//   });
//
//   test("login user", async () => {
//     jest.setTimeout(60000);
//     const res = await request(app)
//       .post("/users/login")
//       .send({ login: mockUser.login, password: mockUser.password });
//     expect(res.status).toBe(200);
//     expect(res.body.login).toBe(mockUser.login);
//     expect(res.body.password).toBe(mockUser.password);
//     expect(res.headers["set-cookie"]).toBeTruthy();
//   });
//
//   it("logout", async () => {
//     const res = await request(app).post("/users/logout");
//     expect(res.status).toBe(200);
//     console.log(res.headers["set-cookie"]);
//     expect(res.headers["set-cookie"]).toBeTruthy();
//   });
//
//   // it("check user authorisation", async () => {
//   //     const res = await request(app).post("/users/checkauth");
//   //     expect(res.status).toBe(401);
//   //     expect(res.headers["set-cookie"]).toBeFalsy();
//   // });
// });
//
// describe("/images", () => {
//   beforeAll(async () => {
//     mongoose.connect(process.env.MONGO_URL, {});
//     const res = await request(app)
//       .post("/users/login")
//       .send({ login: mockUser.login, password: mockUser.password });
//     expect(res.status).toBe(200);
//   });
//   afterAll(async () => {
//     await mongoose.connection.close();
//   });
//
//   describe("if logged in", () => {
//     it("can post image", async () => {
//       const req = await request(app)
//         .post("/images/image/1")
//         .set("set-cookie", "your-cookie-name=your-cookie-value")
//         .attach("image", `${__dirname}/car.jpg`);
//       console.log(req.header);
//       expect(req.header["set-cookie"]).toBeDefined();
//       expect(req.status).toBe(301);
//       expect(req.body.uuid).toBe("string");
//     });
//
//     it("can get image meta", async () => {
//       const res = await request(app).get("/images/image/meta/1");
//       expect(res.headers["set-cookie"]).toBeFalsy();
//       expect(res.body.id).toBe(1);
//       expect(res.body.uuid).toBe("string");
//       expect(res.body.author).toBe(mockUser.login);
//       expect(res.body.date).toBeTruthy();
//       expect(res.body.comments).toBe("");
//     });
//     it("can change image meta", async () => {
//       const res = await request(app)
//         .put("/images/image/meta/1")
//         .send({ author: "Jon", comment: "HELLO WORLD" });
//       expect(res.headers["set-cookie"]).toBeFalsy();
//       expect(res.body.id).toBe(1);
//       expect(res.body.uuid).toBe("string");
//       expect(res.body.author).toBe("Jon");
//       expect(res.body.date).toBeTruthy();
//       expect(res.body.comment).toBe("HELLO WORLD");
//     });
//     it("can get image", async () => {
//       const res = await request(app).get("/images/image/1");
//       expect(res.status).toBe(200);
//       expect(res.headers["set-cookie"]).toBeTruthy();
//       expect(res.headers["contentType"]).toBe("png");
//     });
//   });
//
//   describe("if  not logged in", () => {
//     beforeAll(() => {
//       mongoose.connect(process.env.MONGO_URL, {});
//     });
//     afterAll(async () => {
//       await mongoose.connection.close();
//     });
//     it("image can't be posted", async () => {
//       const res = await request(app).post("/images/image/1");
//       expect(res.headers["set-cookie"]).toBeFalsy();
//       expect(res.status).toBe(401);
//     });
//     it("image can't be got", async () => {
//       const res = await request(app).get("/images/image/1");
//       expect(res.headers["set-cookie"]).toBeFalsy();
//       expect(res.status).toBe(401);
//     });
//   });
