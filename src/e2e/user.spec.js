import request from "supertest";
import mongoose from "mongoose";
import { createApp } from "../createApp.mjs";

describe("Create user and login", () => {
  let app;

  beforeAll(() => {
    // Setup a onetime connection to test database
    mongoose
      .connect("mongodb://localhost:27017/express_tutorial_test")
      .then(() => console.log("Connected to Test Database 🖥️"))
      .catch((err) => console.log(`Error: ${err}`));

    app = createApp();
  });

  it("should create user", async () => {
    const response = await request(app).post('/api/users').send({
        username: 'tester',
        displayName: 'tester123',
        password: 'test123'
    })

    expect(response.statusCode).toBe(201)
  });

  it("should log the user in and visit /api/auth/status and return authenticated user ", async () => {
    const response = await request(app).post("/api/auth").send({
      username: "tester",
      password: "test123",
    }).then((res) => request(app).get('/api/auth/status').set('Cookie', res.headers['set-cookie']))

    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe('tester')
    expect(response.body.displayName).toBe("tester123");
  });

  
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
});
