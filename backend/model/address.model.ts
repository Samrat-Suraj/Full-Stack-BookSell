import mongoose, { Document } from "mongoose";

export interface IADDRESS extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    addressLine1: string;
    addressLine2?: string;
    phoneNumber: string;
    city: string;
    state: string;
    pincode: string;
}

const addressSchema = new mongoose.Schema<IADDRESS>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: "" },
    phoneNumber: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
}, { timestamps: true });

const Address = mongoose.model<IADDRESS>("Address", addressSchema);
export default Address;
