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
exports.updateUserProfile = exports.loaderUser = exports.ResetPassword = exports.forGetPassword = exports.LogOut = exports.login = exports.verifyEmail = exports.register = void 0;
// Extend the Request interface to include the user property
const user_model_1 = __importDefault(require("../model/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const GenCookieAndSetCookie_1 = __importDefault(require("../utils/GenCookieAndSetCookie"));
const MailConfig_1 = require("../config/MailConfig");
// Auth Part
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, agreeTerms } = req.body;
        if (!name || !email || !password || !agreeTerms) {
            return res.status(400).json({ success: false, message: "All Fields Are Required" });
        }
        if (!agreeTerms) {
            return res.status(400).json({ success: false, message: "You Must Agree To Terms And Conditions" });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password Must Have atlest 6 or Chracters" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invaild Email Address" });
        }
        const existingUser = yield user_model_1.default.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User Already Register" });
        }
        if (agreeTerms !== true && agreeTerms !== "true") {
            return res.status(400).json({
                success: false,
                message: "You must agree to the terms and conditions.",
            });
        }
        // Gen Verification Token For Email
        const verificationToken = crypto_1.default.randomBytes(20).toString("hex");
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hassedPassword = yield bcryptjs_1.default.hash(password, salt);
        const newUser = new user_model_1.default({
            name,
            email,
            password: hassedPassword,
            verificationToken,
            agreeTerms: true
        });
        yield newUser.save();
        const result = yield (0, MailConfig_1.sendVerificationToEmail)(newUser.email, verificationToken);
        console.log(result);
        res.status(201).json({
            success: true, message: "User Created Successfully, PLease Check Mail To Verify Account ", user: Object.assign(Object.assign({}, newUser.toObject()), { password: null })
        });
    }
    catch (error) {
        console.log("Error In Register Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.register = register;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        if (!token) {
            return res.status(400).json({ message: "Verification token is required." });
        }
        const user = yield user_model_1.default.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification token." });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        (0, GenCookieAndSetCookie_1.default)(user._id, res);
        yield user.save();
        return res.status(200).json({
            success: true,
            message: "Email verified successfully.",
            user: Object.assign(Object.assign({}, user.toObject()), { password: undefined }),
        });
    }
    catch (error) {
        console.error("Error in verifyEmail controller:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
});
exports.verifyEmail = verifyEmail;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All Fields Are Required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password Must Have atlest 6 or Chracters" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invaild Email Address" });
        }
        const user = yield user_model_1.default.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" });
        }
        if (!(user === null || user === void 0 ? void 0 : user.password)) {
            return res.status(400).json({ success: false, message: "Password is missing for the user." });
        }
        const isPasswordCorrent = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrent) {
            return res.status(400).json({ success: false, message: "Incorrect Password" });
        }
        // Check User Verifyed Or Not
        const isUserVerfifyed = user.isVerified === true;
        if (!isUserVerfifyed) {
            return res.status(400).json({ success: false, message: "Please Verify Your Email Adresss" });
        }
        (0, GenCookieAndSetCookie_1.default)(user._id, res);
        return res.status(200).json({ success: true, message: "User Login Successfully", user: Object.assign(Object.assign({}, user.toObject()), { password: undefined }) });
    }
    catch (error) {
        console.log("Error In Login Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.login = login;
const LogOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("books", { maxAge: 0 });
        return res.status(200).json({ success: true, message: "LogOut User Successfully" });
    }
    catch (error) {
        console.log("Error In LogOut Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.LogOut = LogOut;
const forGetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(404).json({ success: false, message: "Email Is Required For Forget" });
        }
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        const resetPasswordToken = crypto_1.default.randomBytes(20).toString("hex");
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpairs = new Date(Date.now() + 3600000);
        yield user.save();
        yield (0, MailConfig_1.sendPasswordResetEmail)(user.email, resetPasswordToken);
        return res.status(200).json({ success: true, message: "A password reset link has been sent to your email." });
    }
    catch (error) {
        console.error("Error in forGetPassword controller:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
});
exports.forGetPassword = forGetPassword;
const ResetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        const { newPassword } = req.body;
        console.log(token);
        if (!newPassword) {
            return res.status(400).json({ success: false, message: "New password is required." });
        }
        if (!token) {
            return res.status(400).json({ message: "Reset token is required." });
        }
        const user = yield user_model_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpairs: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset password token." });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hassedPassword = yield bcryptjs_1.default.hash(newPassword, salt);
        user.password = hassedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpairs = undefined;
        yield user.save();
        return res.status(200).json({
            success: true,
            message: "Password changed successfully.",
        });
    }
    catch (error) {
        console.error("Error in ResetPassword controller:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
});
exports.ResetPassword = ResetPassword;
const loaderUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, user: Object.assign(Object.assign({}, user.toObject()), { password: undefined }) });
    }
    catch (error) {
        console.error("Error in loaderUser controller:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
});
exports.loaderUser = loaderUser;
// Profile Part
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const { name, email, phoneNumber } = req.body;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }
        const user = yield user_model_1.default.findById(userId).populate({ path: "address" });
        if (!user) {
            return res.status(401).json({ success: false, message: "User Not Found" });
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        yield user.save();
        return res.status(200).json({ success: true, message: "User Profile Updated Successfully", user: Object.assign(Object.assign({}, user.toObject()), { pasword: undefined, verificationToken: undefined, resetPasswordToken: undefined, resetPasswordExpairs: undefined }) });
    }
    catch (error) {
        console.log("Error In updateUserProfile Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateUserProfile = updateUserProfile;
