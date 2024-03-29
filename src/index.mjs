import express from 'express'
import routes from "./routes/index.mjs"
import cookieParser from 'cookie-parser'

// Setup Express Application
const app = express()
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT} 😃!`)
})

// MIDDLEWARE
app.use(express.json())
app.use(cookieParser("myCookieSignature"))

// Base/Home Route
app.get("/", (request, response) => {
  response.cookie('hello', 'world', {maxAge: 60000, signed: true })
  response.status(200).send({msg: "Welcome to the Express Full Course! ⚒️"});
});

// Routers
app.use(routes)


