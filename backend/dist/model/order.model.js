"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderItemSchema = new mongoose_1.default.Schema({
    productId: { type: mongoose_1.default.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
});
const orderSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number },
    shippingAddress: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Address" },
    paymentStatus: { type: String, enum: ["pending", "failed", "complete"] },
    paymentMethod: { type: String },
    paymentDetails: {
        razorpay_order_id: { type: String },
        razorpay_payment_id: { type: String },
        razorpay_signature: { type: String },
    },
    status: { type: String, enum: ["processing", "shipped", "delivered", "cancelled"] },
});
const Order = mongoose_1.default.model("Order", orderSchema);
exports.default = Order;
