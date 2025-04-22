import { Request, Response } from "express";
import Product from "../model/product.model";
import Cart, { ICARTITEM } from "../model/cartItems.model";

export const AddToCart = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.user
        const { quantity, productId } = req.body

        const product = await Product.findById(productId)
        if (!product) {
            return res.status(400).json({ success: false, message: "Product Not Found" });
        }

        if (userId && userId.toString() === product.seller._id.toString()) {
            return res.status(400).json({ success: false, message: "You cant't add to cart your own product" });
        }

        let cart = await Cart.findOne({ user: userId })
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: []
            })
        }

        const extingItem = cart?.items.find((item) => item.productId.toString() === productId)
        if (extingItem) {
            extingItem.quantity += 1
        } else {
            cart?.items.push({ quantity, productId } as ICARTITEM)
        }

        await cart?.save()
        return res.status(200).json({ success: true, message: "Product added to cart" });
    } catch (error: any) {
        console.error("Error in AddToCart Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const RemoveFromCart = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.user
        const { productId } = req.body

        const cart = await Cart.findOne({ user: userId })
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart MT" })
        }
        cart.items = cart.items.filter((item) => item.productId.toString() !== productId)
        await cart.save()
        return res.status(200).json({ success: true, message: "Product Removed From cart" });
    } catch (error: any) {
        console.error("Error in RemoveFromCart Controller", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const GetCartByUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.user
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID not found in request" });
        }
        const cart = await Cart.findOne({ user: userId }).populate("items.productId")
        
        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart is empty", items: [] });
        }

        return res.status(200).json({ success: true, cart });
    } catch (error: any) {
        console.error("Error in GetCartByUser Controller:", error.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
