import express from 'express'
import {query, validationResult, body, matchedData, checkSchema} from 'express-validator'
import { userValidationSchema, queryValidationSchema } from "./utils/validationSchemas.mjs"

// Setup Express Application
const app = express()
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT} 😃!`)
})

// MIDDLEWARE
app.use(express.json())

const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} ->> ${request.url}`)
  next()
}

// Middleware to use in our GET, PUT, PATCH & DELETE Request Methods which need the user ID
const resolveIndexByUserId = (request, response, next) => {
  const {
    params: { id },
  } = request;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);

  request.findUserIndex = findUserIndex
  next()
}


// ROUTES

// BaseUrl
app.get("/", (request, response) => {
  response.status(200).send({msg: "Hello Express!"});
});

const mockUsers = [
  {
    id: 1,
    username: "Carl",
    displayName: "Castiel",
  },
  {
    id: 2,
    username: "Leah",
    displayName: "Leaheal",
  },
  {
    id: 3,
    username: "Jack",
    displayName: "Japhael",
  },
  {
    id: 4,
    username: "Leo",
    displayName: "Leoriel",
  },
  {
    id: 5,
    username: "Tracy",
    displayName: "Traphael",
  },
  {
    id: 6,
    username: "Meruem",
    displayName: "Meruel",
  },
];

// GET All users
app.get(
  "/api/users",
  checkSchema(queryValidationSchema),
  (request, response) => {
    const result = validationResult(request);
    
    // if (!result.isEmpty()) {
    //   return response.status(400).send({ errors: result.array() });
    // }

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

// GET Single User
app.get(
  "/api/users/:id",
  loggingMiddleware,
  resolveIndexByUserId,
  (request, response) => {
    const { findUserIndex } = request;
    const findUser = mockUsers[findUserIndex];

    if (!findUser) return response.sendStatus(404);
    return response.send(findUser);
  }
);

// Create New User

app.post(
  "/api/users",
  checkSchema(userValidationSchema),
  (request, response) => {
    const result = validationResult(request)
  

    if(!result.isEmpty()) {
      return response.status(400).send({errors: result.array()})
    }

    // The validated data is to be added as the newUser
    const newUserData = matchedData(request)
    console.log(newUserData)

    const newUser = {
      id: mockUsers[mockUsers.length - 1].id + 1,
      ...newUserData,
    };

    mockUsers.push(newUser);

    return response.status(201).send(newUser);
  }
);

// PUT Request
app.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const {body, findUserIndex} = request

  mockUsers[findUserIndex] = {
    id: mockUsers[findUserIndex].id, 
    ...body
  }

  return response.sendStatus(200)
})

// PATCH REQUEST

app.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request;

    mockUsers[findUserIndex] = {
      ... mockUsers[findUserIndex], ...body
    };

    return response.sendStatus(200);
})

// DELETE

app.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request
 
  mockUsers.splice(findUserIndex, 1)
  return response.sendStatus(200);
})