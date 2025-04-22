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
exports.handleRazorPayWebHook = exports.createPayMentWithRazorPay = exports.GetOrderByUserId = exports.GetOrderById = exports.createOrUpdateOrder = void 0;
const cartItems_model_1 = __importDefault(require("../model/cartItems.model"));
const order_model_1 = __importDefault(require("../model/order.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const razorpay_1 = __importDefault(require("razorpay"));
const EnvVars_1 = __importDefault(require("../config/EnvVars"));
const crypto_1 = __importDefault(require("crypto"));
const razorpay = new razorpay_1.default({
    key_id: EnvVars_1.default.RAZORPAY_KEY_ID,
    key_secret: EnvVars_1.default.RAZORPAY_KEY_SECRET
});
const createOrUpdateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const { orderId, shippingAddress, paymentMethod, totalAmount, paymentDetails } = req.body;
        const cart = yield cartItems_model_1.default.findOne({ user: userId }).populate("items.productId");
        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(404).json({ success: false, message: "Cart is Empty" });
        }
        let order;
        if (orderId && mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            order = yield order_model_1.default.findOne({ _id: orderId });
        }
        // let order = await Order.findOne({ _id: orderId });
        if (!order) {
            order = new order_model_1.default({
                user: userId,
                items: cart.items,
                shippingAddress,
                paymentDetails,
                paymentMethod,
                paymentStatus: paymentDetails ? "complete" : "pending",
                totalAmount
            });
        }
        else {
            order.shippingAddress = shippingAddress || order.shippingAddress;
            order.paymentMethod = paymentMethod || order.paymentMethod;
            order.totalAmount = totalAmount || order.totalAmount;
            if (paymentDetails) {
                order.paymentDetails = paymentDetails;
                order.paymentStatus = "complete";
                order.status = "processing";
            }
        }
        yield order.save();
        if (paymentDetails) {
            yield cartItems_model_1.default.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
        }
        return res.status(200).json({ success: true, message: "Order Created or Updated Successfully", order });
    }
    catch (error) {
        console.log("Error In createOrUpdateOrder Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createOrUpdateOrder = createOrUpdateOrder;
const GetOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.orderId;
        const order = yield order_model_1.default.findById(orderId)
            .populate({ path: "user", select: "name email" })
            .populate("shippingAddress")
            .populate("items.productId");
        if (!order) {
            return res.status(400).json({ success: false, message: "Order not found" });
        }
        return res.status(200).json({ success: true, order });
    }
    catch (error) {
        console.log("Error In GetOrderByUserId Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.GetOrderById = GetOrderById;
const GetOrderByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const order = yield order_model_1.default.find({ user: userId })
            .sort({ createAt: -1 })
            .populate({ path: "user", select: "name email" })
            .populate("shippingAddress")
            .populate({ path: "items.productId", model: "Product" });
        if (!order) {
            return res.status(400).json({ success: false, message: "Order not found" });
        }
        return res.status(200).json({ success: true, order });
    }
    catch (error) {
        console.log("Error In GetOrderByUserId Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.GetOrderByUserId = GetOrderByUserId;
const createPayMentWithRazorPay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.body;
        const order = yield order_model_1.default.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order Not Found" });
        }
        const razorpayPayOrder = yield razorpay.orders.create({
            amount: Math.round(order.totalAmount * 100),
            currency: "INR",
            receipt: order._id.toString(),
        });
        return res.status(200).json({ success: true, message: "RazorPay Order And payment Created Successfully", order: razorpayPayOrder });
    }
    catch (error) {
        console.log("Error In createPayMentWithRazorPay Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createPayMentWithRazorPay = createPayMentWithRazorPay;
const handleRazorPayWebHook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const secret = EnvVars_1.default.RAZORPAY_WEBHOOK_SECRET;
        // Creating HMAC digest using Razorpay webhook secret
        const shasum = crypto_1.default.createHmac("sha256", secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex");
        const razorpaySignature = req.headers["x-razorpay-signature"];
        if (digest === razorpaySignature) {
            // Extracted paymentId and corrected orderId field path
            const paymentId = req.body.payload.payment.entity.id;
            const orderId = req.body.payload.payment.entity.order_id; // Changed from .order.id to .order_id (actual Razorpay structure)
            // Used $set to safely update nested fields in Mongoose
            yield order_model_1.default.findOneAndUpdate({ "paymentDetails.razorpay_order_id": orderId }, {
                paymentStatus: "complete",
                status: "processing",
                "paymentDetails.razorpay_payment_id": paymentId
            });
            return res.status(200).json({ success: true, message: "RazorPay WebHook Processed Successfully" });
        }
        else {
            return res.status(400).json({ success: false, message: "Invalid Signature" });
        }
    }
    catch (error) {
        console.error("Error in handleRazorPayWebHook:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.handleRazorPayWebHook = handleRazorPayWebHook;
