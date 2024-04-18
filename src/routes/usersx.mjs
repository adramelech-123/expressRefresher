import { Router } from "express";
import { User } from "../mongoose/schemas/user.mjs"
import { checkSchema } from "express-validator";
import { userValidationSchema } from "../utils/validationSchemas.mjs";
import { createUserHandlerX } from "../handlers/users.mjs";

const router = Router();

// GET ALL USERS
router.get("/api/users", async (request, response) => {
  console.log(request.session.id)

  request.sessionStore.get(request.session.id, (err, sessionData) => {
    if(err) {
      console.log(err)
      throw err
    }

    console.log('Inside session store Get')
    console.log(sessionData)
    
  })

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
router.post("/api/users", checkSchema(userValidationSchema), createUserHandlerX);


export default router;