import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20"
import EnvVars from "../../config/EnvVars";
import { Request } from "express";
import User, { IUSER } from "../../model/user.model";


passport.use(new GoogleStrategy({
    clientID: EnvVars.GOOGLE_CLIENT_ID,
    clientSecret: EnvVars.GOOGLE_CLIENT_SECRET,
    callbackURL: EnvVars.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
},
    async (req: Request,accessToken,refreshToken,profile: Profile,cb: (error: any, user?: IUSER | false) => void) => {
        const { emails, photos, displayName } = profile;

        try {
            let user = await User.findOne({ email: emails?.[0].value });

            if (user) {
                if (!user.profilePicture && photos?.[0].value) {
                    user.profilePicture = photos[0].value;
                    await user.save();
                }
                return cb(null, user);
            }

            // If user doesn't exist, create a new one
            const newUser = new User({
                googleId: profile.id,
                name: displayName,
                isVerified: true,
                agreeTerms: true,
                profilePicture: photos?.[0].value,
                email: emails?.[0].value,
            });

            await newUser.save();
            return cb(null, newUser);
        } catch (error) {
            console.error("Google Auth Error:", error);
            return cb(error);
        }
    }
));



export default passport