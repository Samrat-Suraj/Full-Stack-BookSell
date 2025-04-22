import express from "express"
import { createOrUpdateOrder, createPayMentWithRazorPay, GetOrderById, GetOrderByUserId } from "../controller/order.controller"
import { protectRoute } from "../middleware/protectRoute"
const router = express.Router()

router.post("/", protectRoute, createOrUpdateOrder)
router.get("/", protectRoute, GetOrderByUserId)
router.get("/orderId/:orderId", protectRoute, GetOrderById)
router.post("/razorpay", protectRoute, createPayMentWithRazorPay)

export default router