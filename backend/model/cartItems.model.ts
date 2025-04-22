import mongoose, { Document } from "mongoose";

export interface ICARTITEM extends Document {
    productId: mongoose.Schema.Types.ObjectId;
    quantity: number;
}

export interface ICART extends Document {
    user: mongoose.Schema.Types.ObjectId;
    items: ICARTITEM[];
}

const cartItemSchema = new mongoose.Schema<ICARTITEM>({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 }
})

const cartSchema = new mongoose.Schema<ICART>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [cartItemSchema]
}, { timestamps: true })


const Cart = mongoose.model<ICART>("Cart", cartSchema)
export default Cart