import rootReducer from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/userApi";
import { productApi } from "./api/productApi";
import { wishlistApi } from "./api/wishlistApi";
import { cartApi } from "./api/cartApi";
import { orderApi } from "./api/orderApi";
import { addressApi } from "./api/addressApi";

const store = configureStore({
    reducer: rootReducer,
    middleware: (defaultMiddleware) => defaultMiddleware().concat(userApi.middleware , productApi.middleware , wishlistApi.middleware , cartApi.middleware , orderApi.middleware , addressApi.middleware)
})

// const initializeApp = async () => {
//     store.dispatch(userApi.endpoints.loaderUser.initiate(undefined, { forceRefetch: true }))
// }

// initializeApp()

export default store