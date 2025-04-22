"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controller/cart.controller");
const protectRoute_1 = require("../middleware/protectRoute");
const router = express_1.default.Router();
router.post("/addtocart", protectRoute_1.protectRoute, cart_controller_1.AddToCart);
router.post("/removefromcart", protectRoute_1.protectRoute, cart_controller_1.RemoveFromCart);
router.get("/cart", protectRoute_1.protectRoute, cart_controller_1.GetCartByUser);
exports.default = router;
