import express from "express"
import { AddToCart, GetCartByUser, RemoveFromCart } from "../controller/cart.controller"
import { protectRoute } from "../middleware/protectRoute"
const router = express.Router()

router.post("/addtocart", protectRoute, AddToCart)
router.post("/removefromcart",protectRoute, RemoveFromCart)
router.get("/cart", protectRoute, GetCartByUser)

export default router