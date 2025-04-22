import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ORDER_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/order`

export const orderApi = createApi({
    reducerPath : "order",
    baseQuery : fetchBaseQuery({
        baseUrl : ORDER_ENDPOINT,
        credentials : "include"
    }),
    endpoints : (builder) => ({
        createOrUpdateOrder : builder.mutation({
            query : ({inputData}) => ({
                url : "/",
                method : "POST",
                body : inputData,
            })
        }),
        GetOrderByUserId : builder.query({
            query : () => ({
                url : "/",
                method : "GET",
            })
        }),
        GetOrderById : builder.query({
            query : (orderId) => ({
                url : `/orderId/${orderId}`,
                method : "GET"
            })
        }),
        createPayMentWithRazorPay : builder.mutation({
            query : (orderId) => ({
                url : "/razorpay",
                method : "POST",
                body : {orderId}
            })
        })
    })
})


export const {
    useCreateOrUpdateOrderMutation,
    useGetOrderByIdQuery,
    useCreatePayMentWithRazorPayMutation,
    useGetOrderByUserIdQuery,
} = orderApi