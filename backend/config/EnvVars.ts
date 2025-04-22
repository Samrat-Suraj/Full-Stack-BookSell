import dotenv from "dotenv";
dotenv.config();

interface EnvType {
    PORT: string;
    MONGO_URI: string;
    FRONTEND_URI: string
    JWT_SECRET: string
    CLOUDINARY_CLOUD_NAME: string
    CLOUDINARY_API_KEY: string
    CLOUDINARY_API_SECRET: string
    NODEMAILER_EMAIL_PASSWORD : string
    NODEMAILER_EMAIL_USER : string
    GOOGLE_CLIENT_ID : string,
    GOOGLE_CLIENT_SECRET : string,
    GOOGLE_CALLBACK_URL : string,
    RAZORPAY_KEY_SECRET : string,
    RAZORPAY_KEY_ID : string,
    RAZORPAY_WEBHOOK_SECRET : string,
}

const EnvVars: EnvType = {
    PORT: process.env.PORT || "5000",
    MONGO_URI: process.env.MONGO_URI || "",
    FRONTEND_URI: process.env.FRONTEND_URI || "",
    JWT_SECRET: process.env.JWT_SECRET || "",

    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
    
    NODEMAILER_EMAIL_PASSWORD: process.env.NODEMAILER_EMAIL_PASSWORD || "",
    NODEMAILER_EMAIL_USER: process.env.NODEMAILER_EMAIL_USER || "",

    GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET || "",
    GOOGLE_CALLBACK_URL : process.env.GOOGLE_CALLBACK_URL || "",


    RAZORPAY_KEY_ID : process.env.RAZORPAY_KEY_ID || "",
    RAZORPAY_KEY_SECRET : process.env.RAZORPAY_KEY_SECRET || "",
    RAZORPAY_WEBHOOK_SECRET : process.env.RAZORPAY_WEBHOOK_SECRET || "",
};

export default EnvVars;
