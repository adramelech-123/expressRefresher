# Full EXPRESSJS Course

## 1. Installation

- Initialize Node Package Manager (NPM) - `npm init -y`
- Install Express - `npm i express`
- Install Nodemon Dev dependency to watch application changes during development - `npm i -D nodemon`
- Create Dev Script in **package.json** file to run nodemon on an **index.js** file - `"start:dev": "nodemon ./src/index.js"`
- To use the **ESM module** we include the following setting in the **package.json** file - `"type": "module" `. Since we are using ESM Module our **index.js** has to renamed as **`index.mjs`** including in the **package.json**.
- Finally create the source folder and the `index.mjs` file - `./src/index.mjs`

## 2. Create Express Application

The code below is a basic structure of an express server (without routes). We import express and create the app by calling the `express()` function. The `listen` method allows us to listen for the application on a specified PORT who's value can come from an environment variable. Now we can run our application by calling our `npm run start:dev` script. However when we visit the `localhost:3000` base route we will get a `Cannot GET /` error message because we have not setup any routes yet.

```js
import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT} 😃!`)
})

```

## 3. HTTP Requests
Routes/Endpoints are basically different paths in our application that allow us to either Create, Read, Update or Delete data. There are different methods that can be applied on the express application based on whether we want to create, read, update or delete data. 

- **Create**: To create data we usually use the `post()` method
- **Read**: To read/display data we usually use the `get()` method
- **Update**: To update data we can either use the `put()` or `patch()` methods. `put()` updates an entire record even if you change one thing in the record whilst `patch()` updates a record partially, it only updates the data point you want to change e.g. The user's address.
- **Delete**: To delete data we use the `delete()` method in our express application
  
In an express application, a route is normally structured as follows: `app.method(route , requestHandler)`
For example:

```js
// Get method on our base route which sends a response of basic `Hello World` text
app.get("/", (request, response) => {
    response.send("Hello World!")
})
```
The route is basically a string specifying the path our method is applied on and then the requestHandler is a callback function that takes in the request and the response objects as arguments. 

When creating APIs it is always standard practice to prefix routes with `/api`, for example a route to get a list of users should be defined as `/api/users`. Example below:

```js
app.get("/api/users", (request, response) => {
  response.send([
    {
      id: 1,
      username: "Carl",
    },
    {
      id: 2,
      username: "Leah",
    },
    {
      id: 3,
      username: "Jack",
    },
    {
      id: 4,
      username: "Leo",
    },
    {
      id: 5,
      username: "Tracy",
    },
    {
      id: 6,
      username: "Meruem",
    },
  ]);
});
```
## 4. Route Params

Route Params enable us to recieve or manipulate data dynamically. For example, rather than retrieve all users from a database, we can retrieve a particular user based on their id.

```js
app.get("/api/users/:id", (request, response) => {
  const parsedId = parseInt(request.params.id);

  //  Check if the parsed ID is valid i.e. An Integer
  if (isNaN(parsedId))
    return response
      .status(400)
      .send({ msg: "Bad Request. Invalid params! 😞" });

  //  Find a user whose id is equal to the parsed ID
  const findUser = mockUsers.find((user) => user.id === parsedId);

  // If the user with the specified id is not found then return 'Not Found'
  if (!findUser) return response.sendStatus(404);

  return response.send(findUser);
});
```
## 5. Query Params
These are params we can feed into the url to envoke certain queries on the data we recieve from the server. For example a query to sort data. Queries can be made in the url after a `?`. There various queries that we can use such as `filter` and `sort`.  For example, we make the following query to return user data with usernames that contain the string of the following sequence of letters: `ack`. 

`http://localhost:3000/api/users?filter=username&value=ack`

This query would return the following data since only the username **Jack** has the letters `ack` in sequence:

```
[
  {
    "id": 3,
    "username": "Jack",
    "displayName": "Japhael"
  }
]

```

The code below enables us to dictate what happens when the queries above are applied. In order to be able to use queries, we can use the `query` method which we can destructure to the different queries we want to apply on our data.

```js
app.get("/api/users", (request, response) => {
  console.log(request.query)

  // Destructuring of the query method into the filter and value queries
  // 1. Filter - Applies a filter on the variable we want to filter by
  // 2. value - The value we want to filter by
  const { query: {filter, value} } = request


  if(filter && value) return response.send(
    mockUsers.filter((user) => user[filter].includes(value))
  )

  return response.send(mockUsers);

});
```

## 5. POST Request

The client makes a `POST` Request to the server to allow us to upload data/resources to the backend via a payload/request body. The backend will  implement the necessary validation and checks on the data before saving it to the database. If the resource is successfully created we normally get a `201` response. In order to make and test out HTTP Requests we need to use and `HTTP Client` like `Postman` `Insomnia` or `Thunder Client`. A basic request is made as follows:

```js

// Middleware - Functions that have access to the request-response cycle
// We usually need to execute Middleware early on before anything else
// We use the `use` method to register the middleware which allows us to parse json data in our request body
app.use(express.json())

app.post("/api/users", (request, response) => {
    console.log(request.body)
    return response.sendStatus(200)
})

``` 
 - **Middleware** - Before we can access anything in the request body we will need to create Middleware to access what is in the request body. Middleware are basically functions that have access to the request-response cycle and are typically executed early on in the cycle to perform specific operations on the data before returning a result from the request. We use the `use()` method to register our middleware. In this case `app.use(express.json())` allows us to parse json data in our request body before sending it to the server.

Below is a POST request to add a new user to the users database:

```js
app.post("/api/users", (request, response) => {
    
    const {body} = request
    const newUser = {
      id: mockUsers[mockUsers.length - 1].id + 1, ...body 
    }

    mockUsers.push(newUser)
     
    return response.status(201).send(newUser)
})

```

## 6. PUT & PATCH Request

The `PUT` Request updates the data record as a whole. The code below is an example of how we can implement the PUT Request:

```js
app.put("/api/users/:id", (request, response) => {
  // From the request object we are going to grab the body as it contains the data we want to update into the user
  // We also grab the params from the request object and destructure the params to grab the id because we will be updating a single specific user
  const {body, params: {id}} = request

  const parsedId = parseInt(id)
  if(isNaN(parsedId)) return response.sendStatus(400)

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId)
  // If we fail to find the user.id the findUserIndex will return -1
  if(findUserIndex === -1) return response.sendStatus(404)

  mockUsers[findUserIndex] = {
    id: parsedId, 
    ...body
  }

  return response.sendStatus(200)

})

```
The `PATCH` Request updates the record partially (i.e. It only updates the part of the record you specify e.g. username).

```js
app.patch("/api/users/:id", (request, response) => {
    const {
      body,
      params: { id },
    } = request;

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return response.sendStatus(400);

    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if (findUserIndex === -1) return response.sendStatus(404);

      // Update existing data in the record with content in the body
      mockUsers[findUserIndex] = {
        ... mockUsers[findUserIndex], ...body
      };

      return response.sendStatus(200);
})
```
## 7. DELETE Request

The `DELETE` request is used to delete records from the backend server. It is quite simple to use, as it only requires us to identify the record by ID and implement the delete.

```js

app.delete("/api/users/:id", (request, response) => {
  const { params: {id}} = request
  const parsedId = parseInt(id)
  if (isNaN(parsedId)) return response.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  mockUsers.splice(findUserIndex, 1)

  return response.sendStatus(200);
})

```


## 8. MIDDLEWARE

`Middleware` refers to an intermediary process between two or more functions/processes. A Middleware function can also have access to request and response methods as well. Below is a typical structure of a Middleware function: 

```js
const middleWare = (request, response, next ) => {
  // your code here
  next()
}
```
The `next` method/function is basically called when the middleware has finished or completed executing.

Middleware can be invoked globally (to be executed before calling any/all API Routes) or locally (for a specific API route).

To register a middleware function globally we simply call it before all API Routes in the `index.mjs` file as follows:

```js

// 1. Define Middleware Function
const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} ->> ${request.url}`)
  next()
}

// 2. Invoke Middleware Globally
app.use(loggingMiddleware)

// 3. Define Routes

```

To invoke middleware for a specific route, you can pass it as an argument for that specific route as follows: 

```js
// GET single User
app.get("/api/users/:id", loggingMiddleware, (request, response) => {
  // Code here
});
```

In this case, the loggingMiddleware is only called when we do a `GET` Request to the `/api/users/:id` route. We should take note that you we can pass in as many middleware we want and they will be executed in sequential order. In order for that to happen, we need to make sure that the `next()` method is called in each middleware fuction.

## 9. VALIDATION 

For Validatig our API we will use **express-validator**. `express-validator` is a set of express.js middlewares that wraps the extensive collection of validators and sanitizers. It allows us to combine them in many ways so that we can validate and sanitize our express requests, and offers tools to determine if the request is valid or not, which data was matched according to our validators, and so on.

To install `express-validator` we need to run the command `npm i express-validator`

### a. Validating Queries

To use the express-validator, we need to import the middleware function we want to use from the express-validator package:



```js
import {query, validationResult} from "express-validator"
```
In this case we are importing the `query` middleware function from the express-validator to validate query parameters.

Suppose we use the `query` middleware function to check if the query is a string and is not empty. We would implement as follows: 

```js
// GET all users
app.get("/api/users", query('filter').isString().notEmpty().withMessage('Must not be empty!'), (request, response) => {
  const result = validationResult(request)

  // Logging errors from the result Object
  console.log(`Error: ${result['errors'][0]?.msg}`)

});

```
In the code above, we are utilizing the query middleware on the filter query and we can access various methods/validators that we can chain together to perform the validation. However, the query middleware function alone will not return any validation results e.g. if any errors occur, therefore we need to import the `validationResult` middleware from `express-validator` in order to be able to return validation results e.g errors etc.

The validators we chained on the `query` middleware are the `isString()` and the `notEmpty()` methods. These check if the query is a string and the query is not empty. If both are not true then we expect 2 errors to be logged. We can use the `withMessage()` method to create custom error messages for the validators, e.g in this case we have a custom message for the `notEmpty()` validator. If the query is empty, the error message will be `Must not be empty!` as defined in the code above.

### b. Validating the Request Body

To validate the body we will need to import the `body` function from `express-validator`.

```js
import {body, matchedData, validationResult } from "express-validator"

// Create New User
app.post(
  "/api/users",
  [body("username")
    .notEmpty()
    .withMessage("Username cannot be empty!")
    .isLength({ min: 5, max: 32 })
    .withMessage("Username must be 5 - 32 characters!")
    .isString()
    .withMessage('Only strings allowed!'),
  
    body("displayName")
    .notEmpty()
    .withMessage("DisplayName cannot be empty!")
  ],
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

```

In the example above, we applied the `body` validation on the `username` and the `displayName`, therefore we had to use an array to apply the fuction to two items. We also imported the `validationResult` function to get access to our validation results, then we also imported the `matchedData` function to access the validated data in the request body.

### c. Clean Validation
We can use a schema to apply cleaner validation. The schema is an object that holds all the validators we want to use. To do this we create a `utils` folder in the `src` folder an within the utils folder we create a `validationSchemas.mjs` file since we are using the EJS Module system. within the `validationSchemas.mjs` file, we define our user validation schema as an object and export it as follows:

```js
export const userValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: "Username must be 5 - 32 characters!",
    },
    notEmpty: {
      errorMessage: "Username cannot be empty!",
    },
    isString: {
      errorMessage: "Username must be a string!",
    },
  },

  displayName: {
    notEmpty: {
      errorMessage: "Display Name cannot be empty!",
    },
    isString: true
  },
};

```

Basically this schema will do validation checks on the `body` username and displayName.

In the `index.mjs` file we import a function called `checkSchema` to allow us to use the validation schema on our HTTP Request method (In this case POST). The `checkSchema` function is called as an argument in the `post` method.

```js
import {query, validationResult, body, matchedData, checkSchema} from 'express-validator'
import { userValidationSchema } from "./utils/validationSchemas.mjs"

// Create New User
app.post(
  "/api/users",
  checkSchema(userValidationSchema),
  (request, response) => {
    const result = validationResult(request)
  

    if(!result.isEmpty()) {
      return response.status(400).send({errors: result.array()})
    }

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
```

## 10. ROUTERS

