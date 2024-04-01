import { Router } from "express";
import { User } from "../mongoose/schemas/user.mjs"
import { validationResult, matchedData, checkSchema } from "express-validator";
import { userValidationSchema } from "../utils/validationSchemas.mjs";
import { hashPassword } from "../utils/helpers.mjs";

const router = Router();

// GET ALL USERS
router.get("/api/users", async (request, response) => {
  try {
    // Query MongoDB to fetch all users
    const users = await User.find({});
    response.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

// CREATE NEW USER
router.post("/api/users", checkSchema(userValidationSchema) ,async (request, response) => {
  
    const result = validationResult(request);

    if (!result.isEmpty()) {
      return response.status(400).send({ errors: result.array() });
    }

    const newUserData = matchedData(request);
    newUserData.password = hashPassword(newUserData.password)
 

    const newUser = new User(newUserData);

    try {
        const savedUser = await newUser.save();
        return response.status(201).send(savedUser);
    } catch (error) {
        console.log(error);
        return response.sendStatus(400);
    }
});


export default router;