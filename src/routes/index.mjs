import { Router } from "express";
// import usersRouter from "./users.mjs"
// import productsRouter from "./products.mjs"
import usersMongoRouter from "./usersx.mjs"


const router = Router()

// router.use(usersRouter)
// router.use(productsRouter);

// Working with MongoDB

router.use(usersMongoRouter)



export default router