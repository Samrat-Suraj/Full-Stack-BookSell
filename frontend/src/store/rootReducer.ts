import { combineReducers } from "redux";
import { userApi } from "./api/userApi";
import authSlice from "./slice/authSlice"
import filterAndSearch from "./slice/filterAndSearchSlice"
import { productApi } from "./api/productApi";
import { wishlistApi } from "./api/wishlistApi";
import { cartApi } from "./api/cartApi";
import { orderApi } from "./api/orderApi";
import { addressApi } from "./api/addressApi";
import addressSlice from "./slice/addressSlice"

const rootReducer = combineReducers({
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath] : productApi.reducer,
    [wishlistApi.reducerPath] : wishlistApi.reducer,
    [cartApi.reducerPath] : cartApi.reducer,
    [orderApi.reducerPath] : orderApi.reducer,
    [addressApi.reducerPath] : addressApi.reducer,
    auth : authSlice,
    filterAndSearch : filterAndSearch,
    address : addressSlice
})

export default rootReducer