import mongoose from "mongoose";


export interface IWISHLIST extends Document{
    user : mongoose.Schema.Types.ObjectId;
    products : mongoose.Schema.Types.ObjectId[]
}

const wishlistSchema = new mongoose.Schema({
    user : {type : mongoose.Schema.Types.ObjectId , ref : "User" , required : true},
    products : [{type : mongoose.Schema.Types.ObjectId , ref : "Product"}],
})


const Wishlist = mongoose.model("Whistlist" , wishlistSchema)
export default Wishlist