import { Request, Response } from "express";
import Product from "../model/product.model";
import Wishlist from "../model/wishlist.model";

export const AddToWishListAndRemove = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.user;
        const { productId } = req.body;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({ success: false, message: "Product Not Found" });
        }

        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new Wishlist({
                user: userId?._id,
                products: [],
            });
        }

        const isAlreadyInWishList = wishlist.products.includes(productId);

        if (isAlreadyInWishList) {
            await Wishlist.findByIdAndUpdate(wishlist._id, {
                $pull: { products: productId },
            });
            return res.status(200).json({
                success: true,
                message: "Product removed from wishlist",
            });

        } else {
            await Wishlist.findByIdAndUpdate(wishlist._id, { $push: { products: productId } })
            await wishlist.save();
            return res.status(200).json({
                success: true,
                message: "Product added to wishlist",
            });
        }

    } catch (error: any) {
        console.log("Error in AddToWishListAndRemove Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const GetWishListByUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.user
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID not found in request" });
        }
        const wishlist = await Wishlist.findOne({ user: userId }).populate("products")
        if (!wishlist) {
            return res.status(404).json({ success: false, message: "wishlist is empty", items: [] });
        }

        return res.status(200).json({ success: true, wishlist });
    } catch (error: any) {
        console.error("Error in GetWishListByUser Controller:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

