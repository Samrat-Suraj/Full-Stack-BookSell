"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetWishListByUser = exports.AddToWishListAndRemove = void 0;
const product_model_1 = __importDefault(require("../model/product.model"));
const wishlist_model_1 = __importDefault(require("../model/wishlist.model"));
const AddToWishListAndRemove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const { productId } = req.body;
        const product = yield product_model_1.default.findById(productId);
        if (!product) {
            return res.status(400).json({ success: false, message: "Product Not Found" });
        }
        let wishlist = yield wishlist_model_1.default.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new wishlist_model_1.default({
                user: userId,
                products: [],
            });
        }
        const isAlreadyInWishList = wishlist.products.includes(productId);
        if (isAlreadyInWishList) {
            yield wishlist_model_1.default.findByIdAndUpdate(wishlist._id, {
                $pull: { products: productId },
            });
            return res.status(200).json({
                success: true,
                message: "Product removed from wishlist",
            });
        }
        else {
            yield wishlist_model_1.default.findByIdAndUpdate(wishlist._id, { $push: { products: productId } });
            yield wishlist.save();
            return res.status(200).json({
                success: true,
                message: "Product added to wishlist",
            });
        }
    }
    catch (error) {
        console.log("Error in AddToWishListAndRemove Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.AddToWishListAndRemove = AddToWishListAndRemove;
const GetWishListByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID not found in request" });
        }
        const wishlist = yield wishlist_model_1.default.findOne({ user: userId }).populate("products");
        if (!wishlist) {
            return res.status(404).json({ success: false, message: "wishlist is empty", items: [] });
        }
        return res.status(200).json({ success: true, wishlist });
    }
    catch (error) {
        console.error("Error in GetWishListByUser Controller:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.GetWishListByUser = GetWishListByUser;
