"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    profilePicture: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: "" },
    resetPasswordToken: { type: String, default: "" },
    resetPasswordExpairs: { type: Date, default: "" },
    agreeTerms: { type: Boolean, default: false },
    address: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Address" }],
}, { timestamps: true });
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
