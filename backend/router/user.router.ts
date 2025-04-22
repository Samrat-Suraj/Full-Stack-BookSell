import express, { NextFunction, Request, response, Response } from "express";
import { forGetPassword, loaderUser, login, LogOut, register, ResetPassword, updateUserProfile, verifyEmail } from "../controller/user.controller";
import { protectRoute } from "../middleware/protectRoute";
import passport from "passport";
import EnvVars from "../config/EnvVars";
import User, { IUSER } from "../model/user.model";
import generateAndSetAuthCookie from "../utils/GenCookieAndSetCookie";

const router = express.Router();

router.post("/register", register);
router.post("/verify/:token", verifyEmail);
router.post("/login", login);
router.post("/logout", LogOut);
router.post("/forget", forGetPassword);
router.post("/reset-password/:token", ResetPassword);


router.get("/", protectRoute, loaderUser);
router.put("/user-update", protectRoute, updateUserProfile);

router.get("/google", passport.authenticate("google", {
    scope: ["email", "profile"]
}))

//Google CallBack Route
router.get("/google/callback", passport.authenticate("google", { failureRedirect: `${EnvVars.GOOGLE_CALLBACK_URL}`, session: false }),
    async (req : Request, res : Response, next : NextFunction) => {
        try {
            const user = req.user as IUSER
            await generateAndSetAuthCookie(user._id as string , res)
            res.redirect(`${EnvVars.FRONTEND_URI}`)
        } catch (error) {
            next(error)
        }
    }
)

export default router;
