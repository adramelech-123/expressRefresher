import express from 'express'
import usersRouter from "./routes/users.mjs"

// Setup Express Application
const app = express()
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT} 😃!`)
})

// MIDDLEWARE
app.use(express.json())

// Base Route
app.get("/", (request, response) => {
  response.status(200).send({msg: "Hello Express!"});
});

// Routers
app.use(usersRouter)


