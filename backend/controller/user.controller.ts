import { Request, Response } from "express"

// Extend the Request interface to include the user property

import User from "../model/user.model"
import bcryptjs from "bcryptjs"
import crypto from "crypto"
import GenCookieAndSetCookie from "../utils/GenCookieAndSetCookie"
import { sendPasswordResetEmail, sendVerificationToEmail } from "../config/MailConfig"


// Auth Part
export const register = async (req: Request, res: Response) : Promise<any> => {
    try {
        const { name, email, password, agreeTerms } = req.body
        if (!name || !email || !password || !agreeTerms) {
            return res.status(400).json({ success: false, message: "All Fields Are Required" })
        }
        if (!agreeTerms) {
            return res.status(400).json({ success: false, message: "You Must Agree To Terms And Conditions" })
        }

        if(password.length < 6){
            return res.status(400).json({ success: false, message: "Password Must Have atlest 6 or Chracters" })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invaild Email Address" })
        }

        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User Already Register" })
        }

        if (agreeTerms !== true && agreeTerms !== "true") {
            return res.status(400).json({
                success: false,
                message: "You must agree to the terms and conditions.",
            });
        }

        // Gen Verification Token For Email
        const verificationToken = crypto.randomBytes(20).toString("hex")
        const salt = await bcryptjs.genSalt(10)
        const hassedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            name,
            email,
            password: hassedPassword,
            verificationToken,
            agreeTerms : true
        })

        await newUser.save()
        const result  = await sendVerificationToEmail(newUser.email , verificationToken)
        console.log(result)
        res.status(201).json({
            success: true, message: "User Created Successfully, PLease Check Mail To Verify Account ", user: {
                ...newUser.toObject(),
                password: null
            }
        })

    } catch (error: any) {
        console.log("Error In Register Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
export const verifyEmail = async (req: Request, res: Response): Promise<any> => {
    try {
        const token = req.params.token;

        if (!token) {
            return res.status(400).json({ message: "Verification token is required." });
        }

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification token." });
        }

        user.isVerified = true;
        user.verificationToken = undefined;

        GenCookieAndSetCookie(user._id as string, res);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully.",
            user: {
                ...user.toObject(),
                password: undefined,
            },
        });
    } catch (error: any) {
        console.error("Error in verifyEmail controller:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};
export const login = async (req : Request , res : Response) : Promise<any> => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All Fields Are Required" })
        }

        if(password.length < 6){
            return res.status(400).json({ success: false, message: "Password Must Have atlest 6 or Chracters" })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invaild Email Address" })
        }

        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        if (!user?.password) {
            return res.status(400).json({ success: false, message: "Password is missing for the user." });
        }
        
        const isPasswordCorrent = await bcryptjs.compare(password, user.password);
        if(!isPasswordCorrent){
            return res.status(400).json({ success: false, message: "Incorrect Password" })
        }

        // Check User Verifyed Or Not
        const isUserVerfifyed = user.isVerified === true
        if(!isUserVerfifyed){
            return res.status(400).json({ success: false, message: "Please Verify Your Email Adresss" })
        }

        GenCookieAndSetCookie(user._id as string , res)
        return res.status(200).json({success : true , message : "User Login Successfully" , user : {
            ...user.toObject(),
            password : undefined
        }})
        
    } catch (error : any) {
        console.log("Error In Login Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
export const LogOut = async (req : Request , res : Response) : Promise<any> => {
    try {
        res.clearCookie("books", {maxAge: 0})
        return res.status(200).json({success : true , message : "LogOut User Successfully"})
    } catch (error : any) {
        console.log("Error In LogOut Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
export const forGetPassword = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email } = req.body;
        if(!email){
            return res.status(404).json({ success: false, message: "Email Is Required For Forget" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const resetPasswordToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpairs = new Date(Date.now() + 3600000);
        await user.save();

        await sendPasswordResetEmail(user.email, resetPasswordToken);
        return res.status(200).json({ success: true, message: "A password reset link has been sent to your email." });
    } catch (error: any) {
        console.error("Error in forGetPassword controller:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};
export const ResetPassword = async (req: Request, res: Response): Promise<any> => {
    try {
        const token = req.params.token;
        const { newPassword } = req.body;
        console.log(token)

        if (!newPassword) {
            return res.status(400).json({ success : false , message: "New password is required." });
        }

        if (!token) {
            return res.status(400).json({ message: "Reset token is required." });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpairs: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset password token." });
        }

        const salt = await bcryptjs.genSalt(10)
        const hassedPassword = await bcryptjs.hash(newPassword , salt)

        user.password = hassedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpairs = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully.",
        });
    } catch (error: any) {
        console.error("Error in ResetPassword controller:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};
export const loaderUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.user
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({success : false , message : "User not found"})
        }

        return res.status(200).json({success : true , user : {
            ...user.toObject(),
            password: undefined,
        }})
    } catch (error: any) {
        console.error("Error in loaderUser controller:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};


// Profile Part

export const updateUserProfile = async (req : Request , res : Response) : Promise<any> => {
    try {
        const userId = req.user
        const {name , email , phoneNumber} = req.body

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }

        const user = await User.findById(userId).populate({path : "address"})
        if (!user) {
            return res.status(401).json({ success: false, message: "User Not Found" });
        }

        user.name = name || user.name
        user.email = email || user.email
        user.phoneNumber = phoneNumber || user.phoneNumber
        await user.save() 
        return res.status(200).json({success : true , message : "User Profile Updated Successfully" , user : {
            ...user.toObject(),
            pasword : undefined,
            verificationToken : undefined,
            resetPasswordToken : undefined,
            resetPasswordExpairs : undefined,
        }})

    } catch (error : any) {
        console.log("Error In updateUserProfile Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
