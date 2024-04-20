import mongoose from 'mongoose'
import { createApp } from './createApp.mjs'


// Setup Database Connection
mongoose.connect("mongodb://localhost:27017/express_tutorial")
  .then(() => console.log('Connected to Database 🖥️'))
  .catch((err) => console.log(`Error: ${err}`))

const app = createApp()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT} 😃!`)
})









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



