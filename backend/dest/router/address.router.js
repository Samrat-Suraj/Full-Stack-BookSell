"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectRoute_1 = require("../middleware/protectRoute");
const address_controller_1 = require("../controller/address.controller");
const router = express_1.default.Router();
router.post("/createupdate", protectRoute_1.protectRoute, address_controller_1.CreateUpdateAddressByUserId);
router.get("/", protectRoute_1.protectRoute, address_controller_1.GetAddressByUserId);
router.get("/address", protectRoute_1.protectRoute, address_controller_1.GetAddressAddressId);
exports.default = router;
