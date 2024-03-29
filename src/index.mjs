import express from 'express'
import routes from "./routes/index.mjs"

// Setup Express Application
const app = express()
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT} 😃!`)
})

// MIDDLEWARE
app.use(express.json())

// Base/Home Route
app.get("/", (request, response) => {
  response.status(200).send({msg: "Welcome to the Express Full Course! ⚒️"});
});

// Routers
app.use(routes)


