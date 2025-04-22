import mongoose, { Document } from "mongoose";
import { IADDRESS } from "./address.model";

export interface IORDERITEM extends Document {
    productId : mongoose.Schema.Types.ObjectId;
    quantity: number;
}

export interface IORDER extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    items: IORDERITEM[];
    totalAmount: number;
    shippingAddress: mongoose.Schema.Types.ObjectId | IADDRESS;
    paymentStatus: "pending" | "success" | "complete";
    paymentMethod: string;
    paymentDetails: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    };
    status: "processing" | "shipped" | "delivered" | "cancelled";
}

const orderItemSchema = new mongoose.Schema<IORDERITEM>({
    productId : { type: mongoose.Types.ObjectId, ref: "Product" , required : true},
    quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema<IORDER>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number },
    shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    paymentStatus: { type: String, enum: ["pending", "failed", "complete"] },
    paymentMethod: { type: String },
    paymentDetails: {
        razorpay_order_id: { type: String },
        razorpay_payment_id: { type: String },
        razorpay_signature: { type: String },
    },
    status: { type: String, enum: ["processing", "shipped", "delivered", "cancelled"] },
});

const Order = mongoose.model<IORDER>("Order", orderSchema);
export default Order;
