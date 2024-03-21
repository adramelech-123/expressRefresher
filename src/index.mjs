import express from 'express'

// Setup Express Application
const app = express()
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT} 😃!`)
})


// ROUTES
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

// GET all users
app.get("/api/users", (request, response) => {
  console.log(request.query)
  const { query: {filter, value} } = request


  if(filter && value) return response.send(
    mockUsers.filter((user) => user[filter].includes(value))
  )

  return response.send(mockUsers);

});

// GET single User
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