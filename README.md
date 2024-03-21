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

## 3. Setup Routes
The routes are basically different paths in our application that allow us to either Create, Read, Update or Delete data. There are different methods that can be applied on the express application based on whether we want to create, read, update or delete data. 

- **Create**: To create data we usually use the `post()` method
- **Read**: To read/display data we usually use the `get()` method
- **Update**: To update data we can either use the `put()` or `patch()` methods
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
## 4. Route Parameters/Params

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
These are params we can feed into the url to envoke certain queries on the data we recieve from the server. For example a query to sort data.