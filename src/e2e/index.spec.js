import request from "supertest";
import mongoose from "mongoose";
import { createApp } from "../createApp.mjs";


describe('/api/auth', () => {

    let app

    beforeAll(() => {
      // Setup a onetime connection to test database
      mongoose
        .connect("mongodb://localhost:27017/express_tutorial_test")
        .then(() => console.log("Connected to Test Database 🖥️"))
        .catch((err) => console.log(`Error: ${err}`));

      app = createApp();

    })

    it('should return 401 when not logged in', async () => {
        const response = await request(app).get('/api/auth/status')
        expect(response.statusCode).toBe(401)
    })

    afterAll(async () => {
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
    })
})
