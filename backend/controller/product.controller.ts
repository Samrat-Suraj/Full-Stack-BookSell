import { Response, Request } from "express"
import DataUri from "../utils/DataUri"
import cloudinary from "../utils/cloudinaryConfig"
import Product from "../model/product.model"

export const CreateProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req.user
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" })
        }
        const { title, subject, category, condition, classType, price, author, edition, description, finalPrice, shippingCharge, paymentMode, paymentDetails } = req.body
        if (!title || !subject || !category || !condition || !classType || !price || !author || !finalPrice || !paymentMode || !paymentDetails || !shippingCharge) {
            return res.status(400).json({ success: false, message: "Please fill Required fields" })
        }

        // Check if paymentMode is valid
        const parsedpaymentDetails = JSON.parse(paymentDetails)
        if (paymentMode === "UPI" && (!parsedpaymentDetails || !parsedpaymentDetails.upiId)) {
            return res.status(400).json({ success: false, message: "Please provide UPI ID" });
        }

        if (
            paymentMode === "Bank Account" &&
            (
                !parsedpaymentDetails.bankDetails ||
                !parsedpaymentDetails.bankDetails.accountNumber ||
                !parsedpaymentDetails.bankDetails.ifscCode ||
                !parsedpaymentDetails.bankDetails.bankName
            )
        ) {
            return res.status(400).json({ success: false, message: "Please provide Bank Details" });
        }

        const files = req.files as Express.Multer.File[]
        let uploadedImagesUri: string[] = []
        if (!files || files.length < 0) {
            return res.status(400).json({ success: false, message: "Please upload at least one image." });
        }

    
        const uris = files.map((file) => DataUri(file))
        for (let uri of uris) {
            if (!uri) {
                return res.status(400).json({ success: false, message: "Invalid file data." });
            }
            let cloudinaryResponse = await cloudinary.uploader.upload(uri)
            uploadedImagesUri.push(cloudinaryResponse.secure_url)
        }

        const newProduct = new Product({
            images: uploadedImagesUri,
            title,
            subject,
            category,
            condition,
            classType,
            price,
            edition,
            author,
            description,
            finalPrice,
            shippingCharge,
            paymentMode,
            paymentDetails: parsedpaymentDetails,
            seller: userId,
        });

        await newProduct.save()
        return res.status(200).json({ success: true, newProduct , message: "Product Created Successfully" })
    } catch (error: any) {
        console.log("Error In CreateProduct Controller", error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
export const GetAllProduct = async (req : Request , res : Response) : Promise<any> => {
    try {
        const products = await Product.find({})
        .sort({createAt: -1})
        ?.populate({path : "seller" , select : "name email"})
        if(products.length < 0){
            return res.status(200).json({success : true , message : "No Products" , products : []})
        }

        return res.status(200).json({success : true , products})
    } catch (error : any) {
        console.log("Error In Get All Products Controller" , error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
export const GetProductById = async (req : Request , res : Response) : Promise<any> => {
    try {
        const productId = req.params.productId
        const product = await Product.findById(productId)
        .sort({createAt: -1})
        .populate({
            path : "seller", 
            select : "name email phoneNumber address profilePicture",
            populate: { path: "address", model: "Address" }
        })

        if(!product){
            return res.status(404).json({success : false , message : "Product Not Found"})
        }

        return res.status(200).json({success : true , product})
    } catch (error : any) {
        console.log("Error In GetProductById Controller" , error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
export const DeleteProductById = async (req : Request , res : Response) : Promise<any> => {
    try {
        const productId = req.params.productId
        const product = await Product.findById(productId)
        if(!product){
            return res.status(404).json({success : false , message : "Product Not Found"})
        }

        const oldPublicIds: string[] = product.images.map(image => image.split("/").pop()?.split(".")[0] || "");

        for (const publicId of oldPublicIds) {
            await cloudinary.uploader.destroy(publicId);
        }

        await Product.findByIdAndDelete(productId)
        return res.status(200).json({success : true , message : "Product Deleted Successfully"})
    } catch (error : any) {
        console.log("Error In DeleteProductById Controller" , error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}
export const GetProductBySellerId = async (req : Request , res : Response) : Promise<any> => {
    try {
        const sellerId = req.params.sellerId
        if(!sellerId){
            return res.status(404).json({success : false , message : "Seller Not Found"})
        }
        const product = await Product.find({seller : sellerId})
        .sort({createAt : -1})
        .populate({path : "seller" , select : "name email profilePicture phoneNumber address"})
        if(!product){
            return res.status(404).json({success : false , message : "Product Not Found for This Seller"})
        }
        return res.status(200).json({success : true , product})
    } catch (error : any) {
        console.log("Error In GetProductBySellerId Controller" , error.message)
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}