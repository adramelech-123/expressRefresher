import { Router } from "express";
import { mockUsers } from "../utils/constants.mjs";

import {
  resolveIndexByUserId,
  loggingMiddleware,
} from "../utils/middlewares.mjs";
 
import {
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";

import {
  userValidationSchema,
  queryValidationSchema,
} from "../utils/validationSchemas.mjs";
import { getUserByIdHandler } from "../handlers/users.mjs";

const router = Router()

// GET ALL USERS
router.get(
  "/api/users",
  checkSchema(queryValidationSchema),
  (request, response) => {
  
    const result = validationResult(request);

    if (!result.isEmpty()) {
      return response.status(400).send({ errors: result.array() });
    }

    const {
      query: { filter, value },
    } = request;

    if (filter && value)
      return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
      );

    return response.send(mockUsers);
  
  }
);


// GET SINGLE USER
router.get(
  "/api/users/:id",
  loggingMiddleware,
  resolveIndexByUserId,
  getUserByIdHandler
);


// CREATE NEW USER - POST
router.post(
  "/api/users",
  checkSchema(userValidationSchema),
  (request, response) => {
    const result = validationResult(request);

    if (!result.isEmpty()) {
      return response.status(400).send({ errors: result.array() });
    }

    // The validated data is to be added as the newUser
    const newUserData = matchedData(request);
    console.log(newUserData);

    const newUser = {
      id: mockUsers[mockUsers.length - 1].id + 1,
      ...newUserData,
    };

    mockUsers.push(newUser);

    return response.status(201).send(newUser);
  }
);


// UPDATE USER - PUT 
router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const {body, findUserIndex} = request

  mockUsers[findUserIndex] = {
    id: mockUsers[findUserIndex].id, 
    ...body
  }

  return response.sendStatus(200)
})

// UPDATE USER - PATCH 

router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request;

    mockUsers[findUserIndex] = {
      ... mockUsers[findUserIndex], ...body
    };

    return response.sendStatus(200);
})

// DELETE USER

router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request
 
  mockUsers.splice(findUserIndex, 1)
  return response.sendStatus(200);
})


export default router