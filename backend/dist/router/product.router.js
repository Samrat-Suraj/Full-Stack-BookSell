"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectRoute_1 = require("../middleware/protectRoute");
const product_controller_1 = require("../controller/product.controller");
const multer_1 = __importDefault(require("../utils/multer"));
const router = express_1.default.Router();
router.post("/create", multer_1.default.array("images", 5), protectRoute_1.protectRoute, product_controller_1.CreateProduct);
router.get("/products", product_controller_1.GetAllProduct);
router.get("/product/:productId", protectRoute_1.protectRoute, product_controller_1.GetProductById);
router.delete("/product-remove/:productId", protectRoute_1.protectRoute, product_controller_1.DeleteProductById);
router.get("/seller/:sellerId", protectRoute_1.protectRoute, product_controller_1.GetProductBySellerId);
exports.default = router;
