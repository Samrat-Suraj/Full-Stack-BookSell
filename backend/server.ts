import express from "express"
const app = express()
import cors from "cors"
import cookieParser from "cookie-parser"
import EnvVars from "./config/EnvVars"
import MongoDb from "./config/MongoDb"
import userRouter from "./router/user.router";
import productRouter from "./router/product.router";
import cartRouter from "./router/cart.router";
import wishlistRouter from "./router/wishlist.router";
import addressRouter from "./router/address.router";
import orderRouter from "./router/order.router";
import passport from "./controller/strategy/google.strategy"


app.use(passport.initialize())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors({
    origin : EnvVars.FRONTEND_URI,
    credentials : true,
}))


app.use("/api/user" , userRouter)
app.use("/api/product" , productRouter)
app.use("/api/cart" , cartRouter)
app.use("/api/wishlist" , wishlistRouter)
app.use("/api/addess" , addressRouter)
app.use("/api/order" , orderRouter)

const PORT = EnvVars.PORT
app.listen(PORT , () => {
    MongoDb()
    console.log("Server Listing On Port" , PORT)
})