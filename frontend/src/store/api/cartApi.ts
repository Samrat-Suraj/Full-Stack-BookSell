import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const ORDER_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/cart`

export const cartApi = createApi({
    reducerPath : "cart",
    baseQuery : fetchBaseQuery({
        baseUrl : ORDER_ENDPOINT,
        credentials : "include"
    }),
    endpoints : (builder) => ({
        AddToCart : builder.mutation({
            query : ({productId , quantity}) => ({
                url : "/addtocart",
                method : "POST",
                body : {productId , quantity}
            })
        }),
        RemoveFromCart : builder.mutation({
            query : (productId) => ({
                url : "/removefromcart",
                method : "POST",
                body : {productId}
            })
        }),
        GetCartByUser : builder.query({
            query : () => ({
                url : "/cart",
                method : "GET",
            })
        }),
    })
})

export const {
    useAddToCartMutation,
    useGetCartByUserQuery,
    useRemoveFromCartMutation
} = cartApi