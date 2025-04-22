"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const EnvVars_1 = __importDefault(require("./config/EnvVars"));
const MongoDb_1 = __importDefault(require("./config/MongoDb"));
const user_router_1 = __importDefault(require("./router/user.router"));
const product_router_1 = __importDefault(require("./router/product.router"));
const cart_router_1 = __importDefault(require("./router/cart.router"));
const wishlist_router_1 = __importDefault(require("./router/wishlist.router"));
const address_router_1 = __importDefault(require("./router/address.router"));
const order_router_1 = __importDefault(require("./router/order.router"));
const google_strategy_1 = __importDefault(require("./controller/strategy/google.strategy"));
app.use(google_strategy_1.default.initialize());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: EnvVars_1.default.FRONTEND_URI,
    credentials: true,
}));
app.use("/api/user", user_router_1.default);
app.use("/api/product", product_router_1.default);
app.use("/api/cart", cart_router_1.default);
app.use("/api/wishlist", wishlist_router_1.default);
app.use("/api/addess", address_router_1.default);
app.use("/api/order", order_router_1.default);
const PORT = EnvVars_1.default.PORT;
app.listen(PORT, () => {
    (0, MongoDb_1.default)();
    console.log("Server Listing On Port", PORT);
});
