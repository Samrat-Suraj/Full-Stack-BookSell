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
exports.GetAddressAddressId = exports.GetAddressByUserId = exports.CreateUpdateAddressByUserId = void 0;
const address_model_1 = __importDefault(require("../model/address.model"));
const user_model_1 = __importDefault(require("../model/user.model"));
// The Logic Is If AddressId So Update The Address If Not Create The Adrress
const CreateUpdateAddressByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        const { addressLine1, addressLine2, phoneNumber, city, state, pincode, addressId } = req.body;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }
        if (!addressLine1 || !phoneNumber || !city || !state || !pincode) {
            return res.status(400).json({ success: false, message: "Please fill all the required fields." });
        }
        let address = yield address_model_1.default.findById(addressId);
        if (!address) {
            address = new address_model_1.default({
                userId,
                addressLine1,
                addressLine2,
                phoneNumber,
                city,
                state,
                pincode
            });
            yield address.save();
            yield user_model_1.default.findByIdAndUpdate(userId, { $push: { address: address._id } });
            return res.status(201).json({ success: true, message: "Address created successfully." });
        }
        else {
            address.addressLine1 = addressLine1 || address.addressLine1;
            address.addressLine2 = addressLine2 || address.addressLine2;
            address.phoneNumber = phoneNumber || address.phoneNumber;
            address.city = city || address.city;
            address.state = state || address.state;
            address.pincode = pincode || address.pincode;
            yield address.save();
            return res.status(200).json({ success: true, message: "Address updated successfully." });
        }
    }
    catch (error) {
        console.error("Error in CreateUpdateAddressByUserId:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.CreateUpdateAddressByUserId = CreateUpdateAddressByUserId;
const GetAddressByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }
        let address = yield address_model_1.default.find({ userId: userId });
        if (!address) {
            return res.status(404).json({ success: false, message: "Address Not Found", address: [] });
        }
        return res.status(200).json({ success: true, address });
    }
    catch (error) {
        console.error("Error in GetAddressByUserId Controller :", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.GetAddressByUserId = GetAddressByUserId;
const GetAddressAddressId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const addressId = req.body.addressId;
        if (!addressId) {
            return res.status(401).json({ success: false, message: "Address Not Found" });
        }
        let address = yield address_model_1.default.findById(addressId);
        if (!address) {
            return res.status(404).json({ success: false, message: "Address Not Found", address: [] });
        }
        return res.status(200).json({ success: true, address });
    }
    catch (error) {
        console.error("Error in GetAddressAddressId Controller :", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.GetAddressAddressId = GetAddressAddressId;
