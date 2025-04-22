import express from "express";
import { AddToWishListAndRemove, GetWishListByUser } from "../controller/wishlist.controller";
import { protectRoute } from "../middleware/protectRoute";
const router = express.Router()

router.post("/add-remove-wishlist", protectRoute, AddToWishListAndRemove)
router.get("/wishlist", protectRoute, GetWishListByUser)

export default router