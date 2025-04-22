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
exports.GetProductBySellerId = exports.DeleteProductById = exports.GetProductById = exports.GetAllProduct = exports.CreateProduct = void 0;
const DataUri_1 = __importDefault(require("../utils/DataUri"));
const cloudinaryConfig_1 = __importDefault(require("../utils/cloudinaryConfig"));
const product_model_1 = __importDefault(require("../model/product.model"));
const CreateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const { title, subject, category, condition, classType, price, author, edition, description, finalPrice, shippingCharge, paymentMode, paymentDetails } = req.body;
        if (!title || !subject || !category || !condition || !classType || !price || !author || !finalPrice || !paymentMode || !paymentDetails || !shippingCharge) {
            return res.status(400).json({ success: false, message: "Please fill Required fields" });
        }
        // Check if paymentMode is valid
        const parsedpaymentDetails = JSON.parse(paymentDetails);
        if (paymentMode === "UPI" && (!parsedpaymentDetails || !parsedpaymentDetails.upiId)) {
            return res.status(400).json({ success: false, message: "Please provide UPI ID" });
        }
        if (paymentMode === "Bank Account" &&
            (!parsedpaymentDetails.bankDetails ||
                !parsedpaymentDetails.bankDetails.accountNumber ||
                !parsedpaymentDetails.bankDetails.ifscCode ||
                !parsedpaymentDetails.bankDetails.bankName)) {
            return res.status(400).json({ success: false, message: "Please provide Bank Details" });
        }
        const files = req.files;
        let uploadedImagesUri = [];
        if (!files || files.length < 0) {
            return res.status(400).json({ success: false, message: "Please upload at least one image." });
        }
        const uris = files.map((file) => (0, DataUri_1.default)(file));
        for (let uri of uris) {
            if (!uri) {
                return res.status(400).json({ success: false, message: "Invalid file data." });
            }
            let cloudinaryResponse = yield cloudinaryConfig_1.default.uploader.upload(uri);
            uploadedImagesUri.push(cloudinaryResponse.secure_url);
        }
        const newProduct = new product_model_1.default({
            images: uploadedImagesUri,
            title,
            subject,
            category,
            condition,
            classType,
            price,
            edition,
            author,
            description,
            finalPrice,
            shippingCharge,
            paymentMode,
            paymentDetails: parsedpaymentDetails,
            seller: userId,
        });
        yield newProduct.save();
        return res.status(200).json({ success: true, newProduct, message: "Product Created Successfully" });
    }
    catch (error) {
        console.log("Error In CreateProduct Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.CreateProduct = CreateProduct;
const GetAllProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const products = yield ((_a = product_model_1.default.find({})
            .sort({ createAt: -1 })) === null || _a === void 0 ? void 0 : _a.populate({ path: "seller", select: "name email" }));
        if (products.length < 0) {
            return res.status(200).json({ success: true, message: "No Products", products: [] });
        }
        return res.status(200).json({ success: true, products });
    }
    catch (error) {
        console.log("Error In Get All Products Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.GetAllProduct = GetAllProduct;
const GetProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        const product = yield product_model_1.default.findById(productId)
            .sort({ createAt: -1 })
            .populate({
            path: "seller",
            select: "name email phoneNumber address profilePicture",
            populate: { path: "address", model: "Address" }
        });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product Not Found" });
        }
        return res.status(200).json({ success: true, product });
    }
    catch (error) {
        console.log("Error In GetProductById Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.GetProductById = GetProductById;
const DeleteProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        const product = yield product_model_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product Not Found" });
        }
        const oldPublicIds = product.images.map(image => { var _a; return ((_a = image.split("/").pop()) === null || _a === void 0 ? void 0 : _a.split(".")[0]) || ""; });
        for (const publicId of oldPublicIds) {
            yield cloudinaryConfig_1.default.uploader.destroy(publicId);
        }
        yield product_model_1.default.findByIdAndDelete(productId);
        return res.status(200).json({ success: true, message: "Product Deleted Successfully" });
    }
    catch (error) {
        console.log("Error In DeleteProductById Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.DeleteProductById = DeleteProductById;
const GetProductBySellerId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellerId = req.params.sellerId;
        if (!sellerId) {
            return res.status(404).json({ success: false, message: "Seller Not Found" });
        }
        const product = yield product_model_1.default.find({ seller: sellerId })
            .sort({ createAt: -1 })
            .populate({ path: "seller", select: "name email profilePicture phoneNumber address" });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product Not Found for This Seller" });
        }
        return res.status(200).json({ success: true, product });
    }
    catch (error) {
        console.log("Error In GetProductBySellerId Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.GetProductBySellerId = GetProductBySellerId;
