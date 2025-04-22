import mongoose, { Document, Schema } from "mongoose";

export interface IPRODUCT extends Document {
    title: string;
    images: string[];
    subject: string;
    category: string;
    condition: string;
    classType: string;
    price: number;
    author: string;
    bookInterformation?: {
        author?: string
        edition?: string,
    };
    description?: string;
    finalPrice: number;
    shippingCharge?: number;
    seller: mongoose.Types.ObjectId;
    paymentMode: "UPI" | "Bank Account";
    paymentDetails: {
        upiId?: string;
        bankDetails?: {
            accountNumber: string;
            ifscCode: string;
            bankName: string;
        };
    };
    isShippingFree?:boolean
}

const productSchema = new Schema<IPRODUCT>(
    {
        title: { type: String, required: true },
        images: [{ type: String, required: true }],
        subject: { type: String, required: true },
        category: { type: String, required: true },
        condition: { type: String, required: true },
        classType: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        author: { type: String, required: true },
        bookInterformation: {
            author: { type: String },
            edition: { type: String },
        },
        isShippingFree : {type : Boolean , default : false},
        description: { type: String },
        finalPrice: { type: Number, required: true, min: 0 },
        shippingCharge: { type: Number},
        seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        paymentMode: {
            type: String,
            enum: ["UPI", "Bank Account"],
            required: true,
        },
        paymentDetails: {
            upiId: { type: String },
            bankDetails: {
                accountNumber: { type: String },
                ifscCode: { type: String },
                bankName: { type: String },
            },
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model<IPRODUCT>("Product", productSchema);
export default Product;