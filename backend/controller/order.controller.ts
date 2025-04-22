import { Request, Response } from "express"
import Cart from "../model/cartItems.model"
import Order from "../model/order.model"
import mongoose from "mongoose";
import Razorpay from "razorpay";
import EnvVars from "../config/EnvVars";
import crypto from "crypto"



const razorpay = new Razorpay({
    key_id: EnvVars.RAZORPAY_KEY_ID,
    key_secret: EnvVars.RAZORPAY_KEY_SECRET
})


export const createOrUpdateOrder = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.user;
        const { orderId, shippingAddress, paymentMethod, totalAmount, paymentDetails } = req.body;
        const cart = await Cart.findOne({ user: userId }).populate("items.productId");

        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(404).json({ success: false, message: "Cart is Empty" });
        }


        let order;
        if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
            order = await Order.findOne({ _id: orderId });
        }

        

        // let order = await Order.findOne({ _id: orderId });
        if (!order) {
            order = new Order({
                user: userId,
                items: cart.items,
                shippingAddress,
                paymentDetails,
                paymentMethod,
                paymentStatus: paymentDetails ? "complete" : "pending",
                totalAmount
            });
        } else {
            order.shippingAddress = shippingAddress || order.shippingAddress;
            order.paymentMethod = paymentMethod || order.paymentMethod;
            order.totalAmount = totalAmount || order.totalAmount;
            if (paymentDetails) {
                order.paymentDetails = paymentDetails;
                order.paymentStatus = "complete";
                order.status = "processing";
            }
        }

        await order.save();
        if (paymentDetails) {
            await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
        }

        return res.status(200).json({ success: true, message: "Order Created or Updated Successfully", order });
    } catch (error: any) {
        console.log("Error In createOrUpdateOrder Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const GetOrderById = async (req: Request, res: Response): Promise<any> => {
    try {
        const orderId = req.params.orderId
        const order = await Order.findById(orderId)
            .populate({ path: "user", select: "name email" })
            .populate("shippingAddress")
            .populate("items.productId")

        if (!order) {
            return res.status(400).json({ success: false, message: "Order not found" })
        }

        return res.status(200).json({ success: true, order })
    } catch (error: any) {
        console.log("Error In GetOrderByUserId Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}


export const GetOrderByUserId = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.user
        const order = await Order.find({ user: userId })
            .sort({ createAt: -1 })
            .populate({ path: "user", select: "name email" })
            .populate("shippingAddress")
            .populate({ path: "items.productId", model: "Product" })

        if (!order) {
            return res.status(400).json({ success: false, message: "Order not found" })
        }

        return res.status(200).json({ success: true, order })
    } catch (error: any) {
        console.log("Error In GetOrderByUserId Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}


export const createPayMentWithRazorPay = async (req: Request, res: Response): Promise<any> => {
    try {
        const { orderId } = req.body
        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(404).json({ success: false, message: "Order Not Found" })
        }

        const razorpayPayOrder = await razorpay.orders.create({
            amount: Math.round(order.totalAmount * 100),
            currency: "INR",
            receipt: order._id.toString(),
        })

        return res.status(200).json({ success: true, message: "RazorPay Order And payment Created Successfully", order: razorpayPayOrder })
    } catch (error: any) {
        console.log("Error In createPayMentWithRazorPay Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}


export const handleRazorPayWebHook = async (req: Request, res: Response): Promise<any> => {
    try {
        const secret = EnvVars.RAZORPAY_WEBHOOK_SECRET;

        // Creating HMAC digest using Razorpay webhook secret
        const shasum = crypto.createHmac("sha256", secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex");

        const razorpaySignature = req.headers["x-razorpay-signature"] as string;
        if (digest === razorpaySignature) {
            // Extracted paymentId and corrected orderId field path
            const paymentId = req.body.payload.payment.entity.id;
            const orderId = req.body.payload.payment.entity.order_id; // Changed from .order.id to .order_id (actual Razorpay structure)

            // Used $set to safely update nested fields in Mongoose
            await Order.findOneAndUpdate(
                { "paymentDetails.razorpay_order_id": orderId },
                {
                    paymentStatus: "complete",
                    status: "processing",
                    "paymentDetails.razorpay_payment_id": paymentId
                }
            );

            return res.status(200).json({ success: true, message: "RazorPay WebHook Processed Successfully" });
        } else {
            return res.status(400).json({ success: false, message: "Invalid Signature" });
        }

    } catch (error: any) {
        console.error("Error in handleRazorPayWebHook:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


