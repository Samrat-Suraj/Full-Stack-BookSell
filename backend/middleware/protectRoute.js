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
exports.protectRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const EnvVars_1 = __importDefault(require("../config/EnvVars"));
const user_model_1 = __importDefault(require("../model/user.model"));
const protectRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies["books"];
        if (!token) {
            return res.status(401).json({ success: false, message: "Access denied. No token provided." });
        }
        const decoded = jsonwebtoken_1.default.verify(token, EnvVars_1.default.JWT_SECRET);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ success: false, message: "Invalid token. Authorization failed." });
        }
        const user = yield user_model_1.default.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found. Access denied." });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error. Please try again later." });
    }
});
exports.protectRoute = protectRoute;
