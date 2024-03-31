import express from 'express'
import routes from "./routes/index.mjs"
import cookieParser from 'cookie-parser'
import session from "express-session"
import passport from "passport"
// import "./strategies/local-strategy.mjs"
import "./strategies/local-strategy-mongo.mjs";

import mongoose from 'mongoose'

// Setup Express Application
const app = express()

// Setup Database Connection
mongoose.connect("mongodb://localhost:27017/express_tutorial")
  .then(() => console.log('Connected to Database 🖥️'))
  .catch((err) => console.log(`Error: ${err}`))


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT} 😃!`)
})

// MIDDLEWARE
app.use(express.json())
app.use(cookieParser("myCookieSignature"))
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


// Base/Home Route

app.get("/", (request, response) => {
  request.session.visited = true;
  response.status(200).send({msg: "Welcome to the Express Full Course! ⚒️"});
});

app.use(routes);




// Authentication Endpoints (Passport)

app.post(
  "/api/auth",
  passport.authenticate("local"),
  (request, response) => {
    response.sendStatus(200);
  }
);

app.get("/api/auth/status", (request, response) => {
  console.log(`Inside /auth/status endpoint`);
  console.log(request.user);

  return request.user ? response.send(request.user) : response.sendStatus(401);
});

app.post("/api/auth/logout", (request, response) => {
  if (!request.user) return response.sendStatus(401);

  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.sendStatus(200);
  });
});





// app.post("/api/auth", (request, response) => {
//   const {body: {username, password}} = request

//   const findUser = mockUsers.find(
//     user => user.username === username
//   )

//   if (!findUser || findUser.password !== password)
//     return response.status(401).send({ msg: "BAD CREDENTIALS!" });

//   request.session.user = findUser
  
//   return response.status(200).send(findUser)
  
// })

// app.get("/api/auth/status", (request, response) => {
//   return request.session.user 
//   ? response.status(200).send(request.session.user) 
//   : response.status(401).send({msg: "Not Authenticated"})
// })


// app.post("/api/cart", (request, response) => {

//   if(!request.session.user) return response.sendStatus(401)
//   const {body: item } = request
//   const {cart} = request.session

//   if(cart) {
//     cart.push(item)
//   }
//   else {
//     request.session.cart = [item]
//   }

//   return response.status(201).send(item)
// })

// app.get('/api/cart', (request, response) => {
//   if (!request.session.user) return response.sendStatus(401);
//   return response.send(request.session.cart ?? [])
// })


// apps



