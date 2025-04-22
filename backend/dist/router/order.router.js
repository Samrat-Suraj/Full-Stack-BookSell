"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controller/order.controller");
const protectRoute_1 = require("../middleware/protectRoute");
const router = express_1.default.Router();
router.post("/", protectRoute_1.protectRoute, order_controller_1.createOrUpdateOrder);
router.get("/", protectRoute_1.protectRoute, order_controller_1.GetOrderByUserId);
router.get("/orderId/:orderId", protectRoute_1.protectRoute, order_controller_1.GetOrderById);
router.post("/razorpay", protectRoute_1.protectRoute, order_controller_1.createPayMentWithRazorPay);
exports.default = router;
