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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const EnvVars_1 = __importDefault(require("../../config/EnvVars"));
const user_model_1 = __importDefault(require("../../model/user.model"));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: EnvVars_1.default.GOOGLE_CLIENT_ID,
    clientSecret: EnvVars_1.default.GOOGLE_CLIENT_SECRET,
    callbackURL: EnvVars_1.default.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, cb) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { emails, photos, displayName } = profile;
    try {
        let user = yield (user_model_1.default === null || user_model_1.default === void 0 ? void 0 : user_model_1.default.findOne({ email: emails === null || emails === void 0 ? void 0 : emails[0].value }));
        if (user) {
            if (!user.profilePicture && ((_a = photos === null || photos === void 0 ? void 0 : photos[0]) === null || _a === void 0 ? void 0 : _a.value)) {
                user.profilePicture = (_b = photos[0]) === null || _b === void 0 ? void 0 : _b.value;
                yield user.save();
            }
            return cb(null, user);
        }
        // If user doesn't exist, create a new one
        const newUser = new user_model_1.default({
            googleId: profile === null || profile === void 0 ? void 0 : profile.id,
            name: displayName,
            isVerified: true,
            agreeTerms: true,
            profilePicture: (_c = photos === null || photos === void 0 ? void 0 : photos[0]) === null || _c === void 0 ? void 0 : _c.value,
            email: (_d = emails === null || emails === void 0 ? void 0 : emails[0]) === null || _d === void 0 ? void 0 : _d.value,
        });
        yield newUser.save();
        return cb(null, newUser);
    }
    catch (error) {
        console.error("Google Auth Error:", error);
        return cb(error);
    }
})));
exports.default = passport_1.default;
