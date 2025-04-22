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
exports.GetCartByUser = exports.RemoveFromCart = exports.AddToCart = void 0;
const product_model_1 = __importDefault(require("../model/product.model"));
const cartItems_model_1 = __importDefault(require("../model/cartItems.model"));
const AddToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const { quantity, productId } = req.body;
        const product = yield product_model_1.default.findById(productId);
        if (!product) {
            return res.status(400).json({ success: false, message: "Product Not Found" });
        }
        if (userId && userId.toString() === product.seller._id.toString()) {
            return res.status(400).json({ success: false, message: "You cant't add to cart your own product" });
        }
        let cart = yield cartItems_model_1.default.findOne({ user: userId });
        if (!cart) {
            cart = new cartItems_model_1.default({
                user: userId,
                items: []
            });
        }
        const extingItem = cart === null || cart === void 0 ? void 0 : cart.items.find((item) => item.productId.toString() === productId);
        if (extingItem) {
            extingItem.quantity += 1;
        }
        else {
            cart === null || cart === void 0 ? void 0 : cart.items.push({ quantity, productId });
        }
        yield (cart === null || cart === void 0 ? void 0 : cart.save());
        return res.status(200).json({ success: true, message: "Product added to cart" });
    }
    catch (error) {
        console.error("Error in AddToCart Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.AddToCart = AddToCart;
const RemoveFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const { productId } = req.body;
        const cart = yield cartItems_model_1.default.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart MT" });
        }
        cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
        yield cart.save();
        return res.status(200).json({ success: true, message: "Product Removed From cart" });
    }
    catch (error) {
        console.error("Error in RemoveFromCart Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.RemoveFromCart = RemoveFromCart;
const GetCartByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID not found in request" });
        }
        const cart = yield cartItems_model_1.default.findOne({ user: userId }).populate("items.productId");
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart is empty", items: [] });
        }
        return res.status(200).json({ success: true, cart });
    }
    catch (error) {
        console.error("Error in GetCartByUser Controller:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.GetCartByUser = GetCartByUser;
