import express from "express"
import { protectRoute } from "../middleware/protectRoute"
import { CreateUpdateAddressByUserId, GetAddressAddressId, GetAddressByUserId } from "../controller/address.controller"
const router = express.Router()

router.post("/createupdate" , protectRoute, CreateUpdateAddressByUserId)
router.get("/" , protectRoute, GetAddressByUserId)
router.get("/address" , protectRoute, GetAddressAddressId)

export default router