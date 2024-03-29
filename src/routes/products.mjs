import { Router } from "express";
import { mockProducts } from "../utils/constants.mjs";

const router = Router()

router.get("/api/products", (request, response) => {
    console.log(request.headers.cookie)
    // console.log(request.cookies)
    console.log(request.signedCookies);

    if(request.signedCookies.hello && request.signedCookies.hello === 'world') {
        return response.send(mockProducts);
    }

    return response.status(403).send({msg: 'Sorry! You need the correct cookie 🍪'})
    
})

export default router