import { Request, Response } from "express";
import Address from "../model/address.model";
import User from "../model/user.model";


// The Logic Is If AddressId So Update The Address If Not Create The Adrress
export const CreateUpdateAddressByUserId = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.user;
        const { addressLine1, addressLine2, phoneNumber, city, state, pincode, addressId } = req.body;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }

        if (!addressLine1 || !phoneNumber || !city || !state || !pincode) {
            return res.status(400).json({ success: false, message: "Please fill all the required fields." });
        }

        let address = await Address.findById(addressId);

        if (!address) {
            address = new Address({
                userId,
                addressLine1,
                addressLine2,
                phoneNumber,
                city,
                state,
                pincode
            });

            await address.save();
            await User.findByIdAndUpdate(userId, { $push: { address: address._id } })
            return res.status(201).json({ success: true, message: "Address created successfully." });
        } else {
            address.addressLine1 = addressLine1 || address.addressLine1;
            address.addressLine2 = addressLine2 || address.addressLine2;
            address.phoneNumber = phoneNumber || address.phoneNumber;
            address.city = city || address.city ;
            address.state = state || address.state;
            address.pincode = pincode || address.pincode;

            await address.save();
            return res.status(200).json({ success: true, message: "Address updated successfully." });
        }

    } catch (error: any) {
        console.error("Error in CreateUpdateAddressByUserId:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export const GetAddressByUserId = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized access" });
        }

        let address = await Address.find({userId : userId});
        if (!address) {
            return res.status(404).json({ success: false, message: "Address Not Found" , address : [] });
        }

        return res.status(200).json({ success: true, address });
    } catch (error: any) {
        console.error("Error in GetAddressByUserId Controller :", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const GetAddressAddressId = async (req: Request, res: Response): Promise<any> => {
    try {
        const addressId = req.body.addressId;
        if (!addressId) {
            return res.status(401).json({ success: false, message: "Address Not Found" });
        }

        let address = await Address.findById(addressId);
        if (!address) {
            return res.status(404).json({ success: false, message: "Address Not Found" , address : [] });
        }

        return res.status(200).json({ success: true, address });
    } catch (error: any) {
        console.error("Error in GetAddressAddressId Controller :", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


