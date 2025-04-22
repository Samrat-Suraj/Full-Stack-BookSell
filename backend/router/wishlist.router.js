"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wishlist_controller_1 = require("../controller/wishlist.controller");
const protectRoute_1 = require("../middleware/protectRoute");
const router = express_1.default.Router();
router.post("/add-remove-wishlist", protectRoute_1.protectRoute, wishlist_controller_1.AddToWishListAndRemove);
router.get("/wishlist", protectRoute_1.protectRoute, wishlist_controller_1.GetWishListByUser);
exports.default = router;
