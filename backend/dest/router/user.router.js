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
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const protectRoute_1 = require("../middleware/protectRoute");
const passport_1 = __importDefault(require("passport"));
const EnvVars_1 = __importDefault(require("../config/EnvVars"));
const GenCookieAndSetCookie_1 = __importDefault(require("../utils/GenCookieAndSetCookie"));
const router = express_1.default.Router();
router.post("/register", user_controller_1.register);
router.post("/verify/:token", user_controller_1.verifyEmail);
router.post("/login", user_controller_1.login);
router.post("/logout", user_controller_1.LogOut);
router.post("/forget", user_controller_1.forGetPassword);
router.post("/reset-password/:token", user_controller_1.ResetPassword);
router.get("/", protectRoute_1.protectRoute, user_controller_1.loaderUser);
router.put("/user-update", protectRoute_1.protectRoute, user_controller_1.updateUserProfile);
router.get("/google", passport_1.default.authenticate("google", {
    scope: ["email", "profile"]
}));
//Google CallBack Route
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: `${EnvVars_1.default.GOOGLE_CALLBACK_URL}`, session: false }), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        yield (0, GenCookieAndSetCookie_1.default)(user._id, res);
        res.redirect(`${EnvVars_1.default.FRONTEND_URI}`);
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
