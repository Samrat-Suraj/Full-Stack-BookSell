import express from "express"
import { protectRoute } from "../middleware/protectRoute"
import { CreateProduct, DeleteProductById, GetAllProduct, GetProductById, GetProductBySellerId } from "../controller/product.controller"
import upload from "../utils/multer"
const router = express.Router()

router.post("/create", upload.array("images", 5), protectRoute, CreateProduct)
router.get("/products", GetAllProduct)
router.get("/product/:productId", protectRoute, GetProductById)
router.delete("/product-remove/:productId", protectRoute, DeleteProductById)
router.get("/seller/:sellerId", protectRoute, GetProductBySellerId)

export default router