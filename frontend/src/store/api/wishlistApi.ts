import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const WISHLIST_ENDPOINT = "http://localhost:5000/api/wishlist"

export const wishlistApi = createApi({
    reducerPath : "whishlist",
    baseQuery : fetchBaseQuery({
        baseUrl : WISHLIST_ENDPOINT,
        credentials : "include"
    }),

    endpoints : (builder) => ({
        AddToWishListAndRemove : builder.mutation({
            query : (productId) => ({
                url : "/add-remove-wishlist",
                method : "POST",
                body : {productId}
            })
        }),
        GetWishListByUser : builder.query({
            query : () => ({
                url : "/wishlist",
                method : "GET"
            })
        })
    })
})

export const {
    useAddToWishListAndRemoveMutation,
    useGetWishListByUserQuery,
} = wishlistApi