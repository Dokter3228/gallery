import mongoose from "mongoose";
import { app } from "./server";
import request from "supertest";
import User from "./models/user";
import path from "path";
import jwt from "jsonwebtoken";
import Image from "./models/image";

// mocks
import {
  mockUser,
  mockCommentsWithNew,
  mockAnotherCommentsWithNew,
  mockCommentsWithNewAndId,
  mockUserAdmin,
  mockUser2,
  mockUser3,
  mockTags,
} from "../mocks/mockData";
import { Tag } from "./models/tags";

const mockImagePath = path.join(
  process.cwd(),
  "/mocks/images/thomas-shelby.jpg"
);

describe("main tests", () => {
  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  describe("users", () => {
    describe("/users (registration), /login, /logout, /users/:id (getUser) ", () => {
      afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
      });

      test("/users (registration) (simple user)", async () => {
        const res = await request(app).post("/users").send(mockUser);

        User.findOne({ login: mockUser.login }, (err, user) => {
          user.comparePassword(mockUser.password, function (err, isMatch) {
            if (err) throw err;
            expect(isMatch).toBe(true);
          });
        });

        expect(res.status).toBe(200);
        expect(res.body.login).toBe(mockUser.login);
        expect(res.body.comments.length).toBe(0);
        expect(res.body.images.length).toBe(0);
        expect(res.body.role).toBe("user");

        const savedUser = await User.findById(res.body._id);

        expect(savedUser.login).toBe(res.body.login);
        expect(savedUser.password).toBe(res.body.password);
        expect(savedUser.comments.length).toBe(0);
        expect(savedUser.images.length).toBe(0);
        expect(res.headers["set-cookie"][0].includes("token=;")).toBeFalsy();
      });

      test("/users (registration) (admin) ", async () => {
        const res = await request(app).post("/users").send(mockUserAdmin);

        User.findOne({ login: mockUserAdmin.login }, (err, user) => {
          user.comparePassword(mockUserAdmin.password, function (err, isMatch) {
            if (err) throw err;
            expect(isMatch).toBe(true);
          });
        });

        expect(res.status).toBe(200);
        expect(res.body.login).toBe(mockUserAdmin.login);
        expect(res.body.comments.length).toBe(0);
        expect(res.body.images.length).toBe(0);
        expect(res.body.role).toBe("admin");

        const savedUser = await User.findById(res.body._id);

        expect(savedUser.login).toBe(res.body.login);
        expect(savedUser.password).toBe(res.body.password);
        expect(savedUser.comments.length).toBe(0);
        expect(savedUser.images.length).toBe(0);
        expect(res.headers["set-cookie"][0].includes("token=;")).toBeFalsy();
      });

      test("/users (register when the user is already registered)", async () => {
        const res = await request(app).post("/users").send(mockUser);

        expect(res.status).toBe(409);
      });

      test("/login", async () => {
        const res = await request(app)
          .post("/login")
          .send({ login: mockUser.login, password: mockUser.password });

        expect(res.status).toBe(200);

        const user = await User.findById(res.body._id);

        expect(user.login).toBe(res.body.login);
        expect(res.headers["set-cookie"][0].includes("token=;")).toBeFalsy();
      });

      test("/login (with random credentials, user is not signed up)", async () => {
        const res = await request(app).post("/login").send({
          login: "Equsfoa21241doi21jwfaw",
          password: "12owie1fj@oifj2332",
        });

        expect(res.status).toBe(401);
      });

      test("/users/:id (get user by ObjectId)", async () => {
        const savedUser = await User.findOne({ login: mockUser.login });
        const id = savedUser._id.toString();

        const res = await request(app).get(`/users/${id}`);

        expect(res.status).toBe(200);
        expect(res.body.login).toBe(savedUser.login);
      });

      test("/logout", async () => {
        const res = await request(app).post("/logout");

        expect(res.status).toBe(200);
        expect(res.headers["set-cookie"][0].includes("token=;")).toBeTruthy();
      });
    });
  });

  describe("/images", () => {
    beforeAll(async () => {
      const res = await request(app).post("/users").send(mockUser);

      expect(res.status).toBe(200);
    });

    afterAll(async () => {
      await mongoose.connection.db.dropDatabase();
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
        .set("token", token)
        .attach("image", mockImagePath)
        .field("author", mockUser.login);

      expect(res.status).toBe(200);

      const postedImage = await Image.findById(res.body._id.toString());
      imageId = res.body._id.toString();

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
        .set("token", token);

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

      const res = await request(app).get("/images/").set("token", token);

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

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
        .set("token", token)
        .send({
          comments: mockCommentsWithNew,
        });

      expect(res.status).toBe(200);
      expect(res.body.comments.length).toEqual(mockCommentsWithNew.length);
      expect(res.body.comments[0].new).not.toBeDefined();

      const res2 = await request(app)
        .post(`/images/${imageId}/comments`)
        .set("token", token)
        .send({
          comments: mockCommentsWithNewAndId,
        });

      expect(res2.status).toBe(400);
      expect(res2.body.new).toBe(
        "property 'new' can't be in the comment together with 'id'"
      );
    });

    let mockCommentsWithIdsForPatch;
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
        .set("token", token);

      expect(res.status).toBe(200);
      expect(res.body.length).toEqual(mockCommentsWithNew.length);
      expect(res.body[0]._id).toBeDefined();

      expect(
        res.body.every((comment) => comment?.author && comment?.text)
      ).toBe(true);

      mockCommentsWithIdsForPatch = res.body;
    });

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
        .set("token", token)
        .send({
          comments: [{ text: "new comment" }],
        });

      expect(res.status).toBe(400);
      expect(res.body.author).toBe("Author isn't provided");
      expect(res.body.new).toBe("New isn't provided");

      const res2 = await request(app)
        .patch(`/images/${imageId}/comments`)
        .set("token", token)
        .send({
          comments: [{ text: "new comment", new: true }],
        });

      expect(res2.status).toBe(400);
      expect(res2.body.author).toBe("Author isn't provided");

      const res3 = await request(app)
        .patch(`/images/${imageId}/comments`)
        .set("token", token)
        .send({
          comments: mockCommentsWithIdsForPatch.map((comment) => {
            return {
              ...comment,
              text: "new updated text",
              new: true,
            };
          }),
        });

      expect(res3.status).toBe(200);
      expect(res3.body[0].text).toBe("new updated text");
      expect(res3.body[0].new).not.toBeDefined();

      const res4 = await request(app)
        .patch(`/images/${imageId}/comments`)
        .set("token", token)
        .send({
          comments: mockCommentsWithIdsForPatch.map((comment) => {
            return {
              ...comment,
              text: "new updated text",
              new: true,
              author: "some dude who isn't the author",
            };
          }),
        });

      expect(res4.status).toBe(401);
    });

    test("another POST /images/:id/comments", async () => {
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
        .set("token", token)
        .send({
          comments: mockAnotherCommentsWithNew,
        });

      expect(res.status).toBe(200);
      expect(res.body.comments.length).toEqual(
        mockAnotherCommentsWithNew.length + mockCommentsWithNew.length
      );
      expect(res.body._id).toBe(imageId);
    });

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
        .set("token", token);

      expect(res.status).toBe(200);

      const user = await User.findOne({ login: mockUser.login });
      expect(res.body.author).toBe(mockUser.login);
      expect(user.comments.length).toBe(0);
      expect(user.images.length).toBe(0);
    });
  });

  describe("tags functionality", () => {
    let imageId;
    beforeAll(async () => {
      const res = await request(app).post("/users").send(mockUser);

      expect(res.status).toBe(200);
      expect(res.body.role).toBe("user");

      const token = jwt.sign(
        {
          login: mockUser.login,
          password: mockUser.password,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" }
      );
      const res2 = await request(app)
        .post("/images/")
        .set("token", token)
        .attach("image", mockImagePath)
        .field("author", mockUser.login);

      expect(res2.status).toBe(200);

      const postedImage = await Image.findById(res2.body._id.toString());
      imageId = res2.body._id.toString();
      expect(postedImage._id.toString()).toBe(res2.body._id.toString());
      expect(postedImage.author).toBe(mockUser.login);
    });

    afterAll(async () => {
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
        .set("token", token);

      expect(res.status).toBe(200);

      await mongoose.connection.db.dropDatabase();
    });

    let tagsIds = [];
    test("POST tags /images/id/tags", async () => {
      const token = jwt.sign(
        {
          login: mockUser.login,
          password: mockUser.password,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" }
      );

      const res = await request(app)
        .post(`/images/${imageId}/tags`)
        .set("token", token)
        .send(mockTags);

      expect(res.status).toBe(200);
      const tag1 = await Tag.findById(res.body.tags[0]);
      expect(tag1.name).toBe(mockTags[0].name);
      const tag2 = await Tag.findById(res.body.tags[1]);
      expect(tag2.name).toBe(mockTags[1].name);
      tagsIds.push(tag1);
      tagsIds.push(tag2);
    });

    test("PATCH tags /images/id/tags", async () => {
      const token = jwt.sign(
        {
          login: mockUser.login,
          password: mockUser.password,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" }
      );

      const res = await request(app)
        .patch(`/images/${imageId}/tags`)
        .set("token", token)
        .send([
          {
            _id: tagsIds[0]._id,
            name: "changed name",
          },
          {
            _id: tagsIds[1]._id,
            name: "another changed name",
          },
        ]);

      expect(res.status).toBe(200);

      const tag = await Tag.findById(res.body[0]._id);
      expect(tag.name).toBe("changed name");

      const tag2 = await Tag.findById(res.body[1]._id);
      expect(tag2.name).toBe("another changed name");
    });

    test("PATCH (delete) tags /images/id/tags", async () => {
      const token = jwt.sign(
        {
          login: mockUser.login,
          password: mockUser.password,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" }
      );

      const res = await request(app)
        .patch(`/images/${imageId}/tags`)
        .set("token", token)
        .send([
          {
            _id: tagsIds[0]._id,
            name: "change name again here",
          },
        ]);

      expect(res.status).toBe(200);

      const tag = await Tag.findById(res.body[0]._id);
      expect(tag.name).toBe("change name again here");

      expect(res.body.length).toBe(1);
    });
  });

  describe("admin functionality", () => {
    let userId;
    let user2Id;
    let user3Id;
    beforeAll(async () => {
      const resAdmin = await request(app).post("/users").send(mockUserAdmin);

      expect(resAdmin.status).toBe(200);
      expect(resAdmin.body.role).toBe("admin");

      const res = await request(app).post("/users").send(mockUser);

      expect(res.status).toBe(200);
      expect(res.body.role).toBe("user");
      userId = res.body._id;

      const res2 = await request(app).post("/users").send(mockUser2);

      expect(res2.status).toBe(200);
      expect(res2.body.role).toBe("user");
      user2Id = res2.body._id;

      const res3 = await request(app).post("/users").send(mockUser3);

      expect(res3.status).toBe(200);
      expect(res3.body.role).toBe("user");
      user3Id = res3.body._id;
    });

    afterAll(async () => {
      await mongoose.connection.db.dropDatabase();
    });

    test("PATCH /users/ changing a role", async () => {
      const token = jwt.sign(
        {
          login: mockUserAdmin.login,
          password: mockUserAdmin.password,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" }
      );

      const res = await request(app)
        .patch(`/users/`)
        .set("token", token)
        .send([
          {
            _id: userId,
            role: "admin",
          },
          {
            _id: user2Id,
            role: "admin",
          },
          {
            _id: user3Id,
            role: "admin",
          },
        ]);

      expect(res.status).toBe(200);
      expect(res.body[0].role).toBe("admin");
      expect(res.body[1].role).toBe("admin");
      expect(res.body[2].role).toBe("admin");

      const res2 = await request(app)
        .patch(`/users/`)
        .set("token", token)
        .send([
          {
            _id: userId,
            role: "user",
          },
          {
            _id: user2Id,
            role: "user",
          },
          {
            _id: user2Id,
            role: "user",
          },
        ]);

      expect(res2.status).toBe(200);
      expect(res2.body[0].role).toBe("user");
      expect(res2.body[1].role).toBe("user");
      expect(res2.body[2].role).toBe("user");
    });

    test("PATCH /users/ changing a login", async () => {
      const token = jwt.sign(
        {
          login: mockUserAdmin.login,
          password: mockUserAdmin.password,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" }
      );

      const res = await request(app)
        .patch(`/users/`)
        .set("token", token)
        .send([
          {
            _id: userId,
            login: "changedLogin",
          },
          {
            _id: user2Id,
            login: "changedLogin2",
          },
          {
            _id: user3Id,
            login: "changedLogin3",
          },
        ]);

      expect(res.status).toBe(200);
      expect(res.body[0].login).toBe("changedLogin");
      expect(res.body[1].login).toBe("changedLogin2");
      expect(res.body[2].login).toBe("changedLogin3");

      const res2 = await request(app)
        .patch(`/users/`)
        .set("token", token)
        .send([
          {
            _id: userId,
            login: "anotherChangedLoginHere",
          },
          {
            _id: user2Id,
            login: "anotherChangedLoginHere2",
          },
          {
            _id: user3Id,
            login: "anotherChangedLoginHere3",
          },
        ]);

      expect(res2.status).toBe(200);
      expect(res2.body[0].login).toBe("anotherChangedLoginHere");
      expect(res2.body[1].login).toBe("anotherChangedLoginHere2");
      expect(res2.body[2].login).toBe("anotherChangedLoginHere3");
    });

    test("PATCH /users/ by not an admin (error 401)", async () => {
      const token = jwt.sign(
        {
          login: mockUser.login,
          password: mockUser.password,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" }
      );

      const res = await request(app)
        .patch(`/users/`)
        .set("token", token)
        .send([
          {
            _id: userId,
            login: "some request",
          },
        ]);

      expect(res.status).toBe(401);

      const res2 = await request(app)
        .patch(`/users/`)
        .set("token", token)
        .send([
          {
            _id: userId,
            login: "some request",
          },
        ]);

      expect(res2.status).toBe(401);
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
