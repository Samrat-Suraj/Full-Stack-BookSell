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
exports.sendPasswordResetEmail = exports.sendVerificationToEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const EnvVars_1 = __importDefault(require("./EnvVars"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: EnvVars_1.default.NODEMAILER_EMAIL_USER,
        pass: EnvVars_1.default.NODEMAILER_EMAIL_PASSWORD,
    },
});
transporter.verify((error, success) => {
    if (error) {
        console.log("Gmail Services Not Ready To Send Email");
    }
    else {
        console.log("Gmail Services Is Ready To Send Email");
    }
});
const sendEmail = (to, subject, body) => __awaiter(void 0, void 0, void 0, function* () {
    yield transporter.sendMail({
        from: `"Your BookSell" ${EnvVars_1.default.NODEMAILER_EMAIL_USER}`,
        to,
        subject,
        html: body
    });
});
const sendVerificationToEmail = (to, token) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationUrl = `${EnvVars_1.default.FRONTEND_URI}/verify-email/${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
        <h2 style="color: #2c3e50;">Welcome to BookSell!</h2>
        <p>Thank you for registering with BookSell.</p>
        <p>Please verify your email address by clicking the button below:</p>
        <a 
          href="${verificationUrl}" 
          style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px;"
        >
          Verify Email
        </a>
        <p>If you did not create an account with us, you can safely ignore this email.</p>
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply.</p>
      </div>
    `;
    yield sendEmail(to, "Please Verfiy Your Email To Access Your BookSell", html);
});
exports.sendVerificationToEmail = sendVerificationToEmail;
const sendPasswordResetEmail = (to, token) => __awaiter(void 0, void 0, void 0, function* () {
    const resetUrl = `${EnvVars_1.default.FRONTEND_URI}/reset-password/${token}`;
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
        <h2 style="color: #2c3e50;">Reset Your Password</h2>
        <p>We received a request to reset your password for your BookSell account.</p>
        <p>You can reset your password by clicking the button below:</p>
        <a 
          href="${resetUrl}" 
          style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #e67e22; color: white; text-decoration: none; border-radius: 5px;"
        >
          Reset Password
        </a>
        <p>If you did not request a password reset, please ignore this email. Your account is safe.</p>
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply.</p>
      </div>
    `;
    yield sendEmail(to, "Reset Your Password - BookSell", html);
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
