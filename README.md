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

At some point we will need to organize our routes as our application grows. We want to group all related API endpoints based on what we call a `domain`. For example, all endpoints related to the `/api/users` domain are grouped together as one file whilst all endpoints related to the `/api/products` domain are grouped together in a separate file. We can use an `express-router` to group endpoints and access them. We do this by creating a `routes` folder to store all our router files. In the `routes` folder we create a `user.mjs` file and import the `Router` from express. We then define the router and access our HTTP Request methods fom the defined router.

```js
import { Router } from "express";
// Import other necessary libraries e.g express-validator, middleware, etc

// Define Router
const router = Router()

// GET
router.get("/api/users", requestHandler)


// **Ensure that the router is exported as default
export default router;

```
In the `routes` folder we can create an `index.mjs` file to manage all our route imports in a single file as follows:

```js
import { Router } from "express";
import usersRouter from "./users.mjs"
import productsRouter from "./products.mjs"

const router = Router()

router.use(usersRouter)
router.use(productsRouter);

export default router
```
In the `index.mjs` file located in the src folder we can then import the routes and `use` them as middleware:

```js
import express from 'express'
import routes from "./routes/index.mjs"

app.use(routes)
```
## 11. HTTP COOKIES

HTTP Cookies are small pieces of data stored on a user's device by websites they visit. These data files are exchanged between a web server and a web browser, enabling the server to recognize and remember specific information about the user or their interactions with the website.

Here's why HTTP cookies are needed and their key purposes:

1. **Session Management**: Cookies are commonly used to manage user sessions. When a user logs into a website, a session cookie is often created to store authentication tokens or session IDs. This allows the website to recognize the user as they navigate different pages or perform actions within the same session without needing to re-authenticate for every request.

2. **Personalization**: Cookies can be used to personalize the user experience. Websites can store preferences, settings, or other user-specific information in cookies, allowing them to tailor the content and functionality to individual users. For example, a website might remember a user's language preference or their selected theme.

3. **Tracking and Analytics**: Cookies are frequently utilized for tracking user behavior and gathering analytics data. By storing unique identifiers in cookies, websites can track users across multiple visits, monitor their browsing habits, and gather insights into how they interact with the site. This information can be valuable for improving website performance, targeting advertisements, and optimizing user experience.

4. **Shopping Carts and E-commerce**: In e-commerce websites, cookies are often used to maintain shopping cart state. When a user adds items to their cart, the selected items and quantities are stored in a cookie. This allows the items to persist between page views and even across sessions, ensuring a seamless shopping experience.

5. **Authentication and Security**: Cookies play a crucial role in authentication and security mechanisms. They are used to store authentication tokens, session IDs, or other credentials securely on the client side. Properly implemented cookies help prevent unauthorized access to sensitive information and protect against session hijacking or cross-site request forgery (CSRF) attacks.

6. **Targeted Advertising**: Cookies enable targeted advertising by tracking users' interests and behavior across websites. Advertisers can use this information to display relevant ads to specific audiences, increasing the likelihood of engagement and conversions.

We can create cookies using the following syntax `response.cookie(cookieName, cookieValue, options)`

```js
// CookieParser Middleware with a signature
app.use(cookieParser("myCookieSignature"))


app.get("/", (request, response) => {
  response.cookie('hello', 'world', {maxAge: 60000, signed: true })
});
```
To use the cookies, we will need to parse them using an external library called `cookie-parser`. To install `cookie-parser` we run the following command: `npm i cookie-parser`. The option `{maxAge}` defines the expiry period for the cookie in milliseconds. Once the expiry period is reached, the cookie will be deleted. The `{signed}` option is used to set a signature for the cookie. The signature can be registered in the `cookieParser()` as any string.

Suppose we only want to access the products data from the `/api/products` route if the `hello` cookie exists and is equal to `world`. In the products route file we write as follows:

```js
router.get("/api/products", (request, response) => {
    
    // We need to call the signedCookies method if a signature exists otherwise we can just use .cookies method
    if(request.signedCookies.hello && request.signedCookies.hello === 'world') {
        return response.send(mockProducts);
    }

    return response.status(403).send({msg: 'Sorry! You need the correct cookie 🍪'})
    
})

```
Given that the cookie expires after one minute, the products data will not be accessible after the cookie expires.

## 12. SESSIONS


Sessions in web development refer to the period of time during which a user interacts with a web application or website. Sessions allow the server to keep track of a user's activity from the time they log in until they log out or their session expires. 

Sessions are created by generating an object/cookie with a session ID. When an HTTP Request is sent to the server from the web browser, the response can return with instructions to set a cookie with the `session ID` so that it can be saved in the browser. This allows the browser to send the cookie on subsequent requests to the server. The server can then parse the cookies from text to Json then verify the session ID that was sent from the client and determine who the request was sent from. 

We can use the `express-session` library to manage sessions with express. To intsall express-session, we run the command `npm i express-session`. In the root `index.mjs` file, we need to `import session from "express-session"`. We then register the session as middleware and pass in some configuration options as follows:

```js
import session from "express-session"

app.use(session({
  secret: 'mysecretsessionkey',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60000 * 60
  }
}))

```

By default, everytime the a new new request is made, a new cookie and session ID are created, however this is not ideal as we will not be able to track who the actual user is. The cookie and session ID need to remain the same so we can identify the user. We can do this by using the `request.session.visited = true` in the route we want to access.

```js
// Base/Home Route
app.get("/", (request, response) => {
  // console.log(request.session)
  // console.log(`Session ID: ${request.sessionID}`)
  request.session.visited = true
  response.status(200).send({msg: "Welcome to the Express Full Course! ⚒️"});
});

```

### Configuration Options
1. `secret`: This is the secret used to sign the session cookie. This can be either a string for a single secret, or an array of multiple secrets. If an array of secrets is provided, only the first element will be used to sign the session ID cookie, while all the elements will be considered when verifying the signature in requests. The secret itself should be not easily parsed by a human and would best be a random set of characters

2. `saveUninitialized`: Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified. Choosing false is useful for implementing login sessions, reducing server storage usage, or complying with laws that require permission before setting a cookie. Choosing false will also help with race conditions where a client makes multiple parallel requests without a session.
   
3. `resave`: Forces the session to be saved back to the session store, even if the session was never modified during the request.



### **Session Storage**

When a user is authenticated, their user object is stored in the session as `request.session.user`. This session data is maintained by the server and associated with the user's session ID cookie. The session is set to expire after one hour (`maxAge: 60000 * 60`), as configured in the `cookie` object passed to `express-session`. Below is the code to authenticate a user using the `/api/auth` endpoint:

```js
app.post("/api/auth", (request, response) => {
  const {body: {username, password}} = request

  const findUser = mockUsers.find(
    user => user.username === username
  )

  if (!findUser || findUser.password !== password)
    return response.status(401).send({ msg: "BAD CREDENTIALS!" });

  request.session.user = findUser
  return response.status(200).send(findUser)
})
```
In the code above, the user passess the `username` and `password` in the body and the function `findUser` will skim through the array of users to find a username that has the same value as that entered in the request body. If the user does not exist in the array of users or the password in the request body does not match with the user's password then the system will not allow the authentication. Otherwise the authentication will proceed and the user object we found will be stored in the session store as `request.session.user`. 

Once we have an authenticated user session we can proceed to use other routes that only work when a `request.session.user` exists:

```js

// Route to check authentication status
app.get("/api/auth/status", (request, response) => {
  return request.session.user 
  ? response.status(200).send(request.session.user) 
  : response.status(401).send({msg: "Not Authenticated"})
})

// Route to add items to a cart
app.post("/api/cart", (request, response) => {

  if(!request.session.user) return response.sendStatus(401)
  const {body: item } = request
  const {cart} = request.session

  if(cart) {
    cart.push(item)
  }
  else {
    request.session.cart = [item]
  }

  return response.status(201).send(item)
})

// Route to retrieve cart items
app.get('/api/cart', (request, response) => {
  if (!request.session.user) return response.sendStatus(401);
  return response.send(request.session.cart ?? [])
})

```
## 13. PASSPORT JS (Authentication & Authorization)

Passport.js is a middleware for Node.js that simplifies the process of implementing authentication and authorization in web applications. It provides a flexible framework for managing user sessions, verifying user identities, and controlling access to resources. Here's an expanded explanation of the provided code snippet:

### 1. Installation:
To use Passport.js in your Node.js project, you need to install the `passport` and `passport-local` packages from npm. This can be done using the following command:

```bash
npm i passport passport-local
```

### 2. Setting up Passport:
Passport.js allows for various authentication strategies, but in this example, we're focusing on the local strategy, which involves using a username and password stored locally in your application. 

To set up Passport, you typically create a separate folder (e.g., `strategies`) to organize your authentication strategies. Within this folder, you create a file (e.g., `local-strategy.mjs`) to define and configure the local authentication strategy.

### 3. Serialization and Deserialization:
Passport requires two functions to serialize and deserialize user instances. These functions are used to manage user sessions. 

- **`serializeUser`**: This function is called during the login process to determine which data of the user object should be stored in the session. Here, it simply serializes the user's `id`.
  
- **`deserializeUser`**: This function is called whenever a request is made to the server. It retrieves the user's data from the session store based on the serialized user `id`. In this implementation, it fetches the user object from a mock user array based on the provided `id`.

### 4. Authentication Strategy:
The local authentication strategy is defined using the `Strategy` object from `passport-local`. This strategy validates user credentials against a locally defined set of users (in this case, stored in `mockUsers`). 

The `new Strategy()` constructor takes a callback function with the parameters `username`, `password`, and `done`. Inside this function:

- It searches for a user with the provided `username`.
- If the user is found, it compares the provided `password` with the user's stored password.
- If the credentials are valid, it invokes the `done` callback with `null` as the error and the authenticated user object.
- If the credentials are invalid, it invokes the `done` callback with an error message.

### 5. Exporting the Strategy:
Finally, the configured local authentication strategy is exported using `export default passport.use()`. This makes the strategy available for use in other parts of the application.

### Conclusion:
By following this setup, your Node.js application can now utilize Passport.js for user authentication using a local strategy. This implementation provides a basic foundation for adding user authentication to your application, and you can extend it further to meet your specific requirements, such as integrating with a database for user storage or implementing additional authentication strategies like OAuth.


```js
import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";


passport.serializeUser((user, done) => {
    console.log(`Inside Serialize user`)
    console.log(user)
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    console.log(`Inside Deserializer`);
    console.log(`Deserializing User ID: ${id}`)

    try {
        const findUser = mockUsers.find((user) => user.id === id);
        if (!findUser) throw new Error("User not found!");

        done(null, findUser)
    } catch (error) {
        done(error, null);
    }
})


export default passport.use(
    new Strategy((username, password, done) => {
        console.log(`Username: ${username}`)
        console.log(`Password: ${password}`)

        try {
            const findUser = mockUsers.find(user => user.username === username)
            if(!findUser) throw new Error('User not found!')
            if(findUser.password !== password) throw new Error("Invalid credentials!")

            done(null, findUser)

        } catch (error) {
            done(error, null)
        }
    })
)
```

We can now setup endpoints for authentication using our local strategy as follows. Note that we can use passport with `express-session`:

```js
import express from 'express'
import routes from "./routes/index.mjs"
import session from "express-session"
import passport from "passport"
import "./strategies/local-strategy.mjs"

// MIDDLEWARE
app.use(express.json())
app.use(session({
  secret: 'mysecretsessionkey',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60000 * 60
  }
}))
app.use(passport.initialize());
app.use(passport.session());

// Authentication Endpoint

app.post("/api/auth", passport.authenticate('local'), (request, response) => {
  response.sendStatus(200)
})

app.get("/api/auth/status", (request, response) => {
  
  console.log(request.user)
  return request.user ? response.send(request.user) : response.sendStatus(401)
})

app.post("/api/auth/logout", (request, response) => {
  if(!request.user) return response.sendStatus(401)

  request.logout((err) => {
    if(err) return response.sendStatus(400)
    response.sendStatus(200)
  })
})

```

## 14. DATABASE (MongoDB & Mongoose)

MongoDB is a popular NoSQL database that stores data in a flexible, JSON-like format. It's known for its scalability, performance, and ease of use. Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js that provides a higher level of abstraction for working with MongoDB databases.

Mongoose can be intalled by running `npm i mongoose` in the terminal.

### 1. MongoDB Setup:
Firstly, ensure you have MongoDB installed and running either locally or on a remote server. MongoDB is typically accessed via a connection string, which specifies the database's location, port, and authentication details if required. We can do the following in the `index.mjs` file located in the src folder:

```js
import mongoose from 'mongoose'


// Setup Database Connection
mongoose.connect("mongodb://localhost:27017/express_tutorial")
  .then(() => console.log('Connected to Database 🖥️'))
  .catch((err) => console.log(`Error: ${err}`))

```

In this case, the connection string `mongodb://localhost:27017/express_tutorial` indicates that the database is running on port 27017 on the local machine. Normally the connection string is stored as an environment variable in a `.env` file for security purposes.

### 2. Mongoose Integration:
Mongoose simplifies working with MongoDB by providing a schema-based solution for modeling application data. It also provides features like validation, query building, and middleware hooks.

```js
import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true
  },

  displayName: {
    type: mongoose.Schema.Types.String,
  },

  password: {
    type: mongoose.Schema.Types.String,
    required: true
  },

});

export const User = mongoose.model('User', UserSchema)
```

### 3. Defining a User Schema and Model:
In the provided code snippet:

- We import the `mongoose` library to utilize its functionality.
- We define a `UserSchema` using `mongoose.Schema()`, where we specify the structure of the user document in MongoDB.
- Inside the `UserSchema`, we define fields like `username`, `displayName`, and `password`, along with their respective data types and any additional properties like `required` and `unique`.
- We export a Mongoose model named `User`, which is created using `mongoose.model()`. This model is a constructor function that provides an interface for interacting with the `users` collection in the MongoDB database. It's conventionally named in PascalCase and represents a singular version of the collection name.

### 4. Usage in Express.js:
Once the user schema and model are defined, you can integrate them into your Express.js application. For example, you might have routes that handle user registration, login, profile updates, etc. Within these routes, you can use the `User` model to perform CRUD operations on the MongoDB database.

Here's a basic example of using the `User` model in an Express.js route:

```javascript
import express from 'express';
import { User } from './schemas/UserSchema';

const app = express();

// Route to create a new user (Check usersx.mjs file )
app.post('/users', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


```

In this example, when a POST request is made to `/users`, a new user is created in the MongoDB database using the `User.create()` method provided by Mongoose.

Note: Take a look at the `local-strategy-mongoose.mjs` file to see how passport is implemented on an existing MongoDB Database, including the auth routes in the `index.mjs` file.

## 15. PASSWORD HASHING

We will install a package called `bcrypt` to hash user passwords. We need to run `npm i bcrypt` in the terminal to install the package.

We can create a separate `helpers.mjs` file in our `utils` folder to handle password hashing as follows:

1. **Importing bcrypt**: This line imports the bcrypt library into the current file. 

2. **Salt Rounds**: A salt is a random value that is combined with the password before hashing, making it more difficult for attackers to crack passwords using techniques like rainbow tables. `saltRounds` defines the number of rounds of hashing that bcrypt will use. More rounds result in a more secure hash but also increase the time it takes to generate the hash. Its usually recommended to use 10 rounds.

   ```javascript
   const saltRounds = 10;
   ```

3. **Hashing Function**: This function, `hashPassword`, takes a password as input and hashes it using bcrypt.

   ```javascript
   export const hashPassword = (password) => {
   ```

4. **Generating Salt**: The `genSaltSync()` function generates a salt synchronously. It takes the `saltRounds` as an argument. Since this is synchronous, it will block the event loop until the salt is generated. We can also generate a salt asynchronously by using `genSalt` instead of using `genSaltSync` and using the async/await syntax.

   ```javascript
   const salt = bcrypt.genSaltSync(saltRounds);
   ```

5. **Hashing the Password**: The `hashSync()` function hashes the password synchronously using the generated salt. It takes two arguments: the password to hash and the salt to use for hashing. We can also hash a password asynchronously suing `hash`.

   ```javascript
   bcrypt.hashSync(password, salt);
   ```

6. **Returning the Hashed Password**: You would need to add a `return` statement to return the hashed password.

   ```javascript
   return bcrypt.hashSync(password, salt);
   ```

So, the complete function would look like this:

```javascript
export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}
```

Now, when you call `hashPassword("password123")`, it will return the hashed version of the password.

Whenever we authenticate a user we will need to compare the password entered and the hashed password, we do this by using the `compareSync` function as follows:

```js
export const comparePassword = (plain, hashed) => {
    // The compare function returns a boolean -> True if the passwords match
    return bcrypt.compareSync(plain, hashed)
}

```

The `comparePassword` function takes two parameters: `plain` (the plain-text password entered by the user) and `hashed` (the hashed password retrieved from the database). It uses `bcrypt.compareSync()` to compare the plain password with the hashed password. If they match, it returns `true`, indicating that the passwords match.

In our `local-strategy` file, we will need to implement the `comparePassowrd` function on the password entered by the user through the Passport authentication strategy. If the comparePassword function returns false it would men the plain-text password and hashed password do not match and therefore the credentials entered are invalid :

```js
export default passport.use(
  new Strategy( async (username, password, done) => {
    
    try {
      const findUser = await User.findOne({ username })
      if(!findUser) throw new Error('User not found!')

      if(!comparePassword(password, findUser.password)) throw new Error("Invalid Credentials!");   

      done(null, findUser);
    } catch (error) {
      done(error, null);
    }

  })
);

```
## 16. SESSION STORE

A session store is a mechanism for storing session data associated with a user's session. Sessions are used to maintain stateful information across HTTP requests in web applications. Session data typically includes user authentication status, user preferences, and other information relevant to the user's interaction with the application.

The session store is responsible for securely storing session data and making it accessible to the server on subsequent requests from the same client. There are several types of session stores available in Express.js, including:

1. **Memory Store**: The simplest session store implementation is the memory store, where session data is stored in memory on the server. However, this approach is not suitable for production environments as it does not scale well and session data is lost when the server restarts.

2. **Cookie-based Store**: Sessions can also be implemented using cookies, where session data is stored encrypted in client-side cookies. While this approach is convenient, it has limitations such as cookie size restrictions and vulnerability to certain types of attacks such as CSRF (Cross-Site Request Forgery).

3. **Database Store**: In a database store, session data is stored in a database (such as MongoDB or Redis) on the server. This approach is more scalable and secure than the memory store, as session data persists across server restarts and can be easily distributed across multiple servers in a clustered environment.

4. **Redis Store**: Redis is a popular in-memory data store that is commonly used as a session store in Express.js applications. Redis provides high performance and scalability, making it well-suited for storing session data in large-scale applications.

5. **Custom Store**: It's also possible to implement a custom session store by extending Express's session store interface. This allows developers to integrate with various data storage solutions or implement custom session management logic.

Configuring a session store in an Express.js application involves specifying the session middleware and configuring the store to be used. Here's an example of how to configure a session store using the `express-session` middleware with `connect-mongo` a MongoDB session store for express:

```js
import MongoStore from "connect-mongo"

app.use(session({
  secret: 'mysecretsessionkey',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60000 * 60
  },
  store: MongoStore.create({
    client: mongoose.connection.getClient()
  })
}))
```
By defining the store as MongoStore with the client set to `mongoose.connection.getClient()`, we are able to store our sessions in mongoDB rather than the default memory store, therefore we will not have challenges of losing session data when the server restarts.

## 17. OAUTH2

We can setup OAUTH2 with PassportJS for authentication with 3rd Party providers such as Github, Facebook, Discord etc. In this example we will setup OAuth2 with Discord. We will headover to discord.com and look for the developer section and create a new application, name it to `Express_OAuth2`, and look for the OAuth2 settings page to get the `Client ID` and `Client Secret`. We must also specify at least one URI (Redirect URL/ Callback URL) for authentication to work, in this case we use `http://localhost:3000/api/auth/discord/redirect` since we are in development mode, we may need to set a different redirect for production mode.

We should now go ahead with installing the strategy package for OAUTH2 for discord. Before installing ensure you have the base passport installed `npm i passport`. We install the strategy as follows `npm install passport-discord`. Once the installation is done, we setup a `discord-strategy.mjs` file to use `passport-discord`. Similar to what we did with the `local-strategy` we will need the strategy to validate our user, perform serialization of the user into the session and deserialization every time we visit a different endpoint.

```js
import passport from "passport";
import { Strategy } from "passport-discord";
import { config } from "dotenv";
import { DiscordUser } from "../mongoose/schemas/discord-user.mjs";

config()

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await DiscordUser.findById(id)
    
    return findUser ? done(null, findUser) :  done(null, null)
  } catch (error) {
    done(error, null);
  }
});


export default passport.use(
  new Strategy(
    {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/discord/redirect",
      scope: ['identify','email']
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        let findUser

        try {
            // Check if user already exists in DB
            findUser = await DiscordUser.findOne({ discordId: profile.id });
        } catch (error) {
            return done(error, null)
        }

        try {
            // If user does not exist in DB, create new user
            if (!findUser) {
              const newUser = new DiscordUser({
                username: profile.username,
                discordId: profile.id,
                email: profile.email,
              });

              const newSavedUser = await newUser.save();
              return done(null, newSavedUser);
            }

            return done(null, findUser)
        } catch (error) {
            console.error(error)
            return done(error, null)
        }
        

        
    }
  )
);

```

When we define our strategy we will need to pass in the strategy options as follows:

```js
 {
      clientID: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/discord/redirect",
      scope: ['identify','email']
  },
```
We define the client ID, client secret and callbackURL for redirects. The scope simply defines the type of data we want to get from the users discord e.g. avatar, username, email etc. The scope parameters can usually be found in the documentation of the developer documentation of discord. If you are usin Github as a strategy you can get information on scope from the github docs.

Now we can go ahead and create routes for the discord authentication as follows:

```js
import "./strategies/discord-strategy.mjs"

app.use(passport.initialize());
app.use(passport.session());

// Discord Auth Endpoints
app.get("/api/auth/discord", passport.authenticate('discord'))
app.get("/api/auth/discord/redirect", passport.authenticate('discord'), (request, response) => {
  console.log(request.session)
  console.log(request.user)
  response.sendStatus(200)
}
```


