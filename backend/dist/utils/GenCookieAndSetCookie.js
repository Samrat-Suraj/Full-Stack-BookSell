"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const EnvVars_1 = __importDefault(require("../config/EnvVars"));
const generateAndSetAuthCookie = (userId, res) => {
    const token = jsonwebtoken_1.default.sign({ userId }, EnvVars_1.default.JWT_SECRET, { expiresIn: "15d" });
    res.cookie("books", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
    });
    return token;
};
exports.default = generateAndSetAuthCookie;
