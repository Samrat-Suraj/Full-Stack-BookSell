import mongoose, { Document } from "mongoose";

export interface IUSER extends Document {
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    profilePicture?: string;
    phoneNumber?: string;
    isVerified: boolean;
    verificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpairs? : Date;
    agreeTerms: boolean;
    address?: mongoose.Schema.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<IUSER>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String},
    googleId: { type: String },
    profilePicture: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: "" },
    resetPasswordToken: { type: String, default: "" },
    resetPasswordExpairs: { type: Date, default: "" },
    agreeTerms: { type: Boolean, default: false },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
}, { timestamps: true });

const User = mongoose.model<IUSER>("User", userSchema);
export default User;
