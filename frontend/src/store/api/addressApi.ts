import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { string } from "zod";


const ADDRESS_ENDPOINT = "http://localhost:5000/api/addess"

export const addressApi = createApi({
    reducerPath : "addressApi",
    baseQuery : fetchBaseQuery({
        baseUrl : ADDRESS_ENDPOINT,
        credentials : "include"
    }),
    endpoints : (builder) => ({
        CreateUpdateAddressByUserId : builder.mutation({
            query : ({addressLine1, addressLine2, phoneNumber, city, state, pincode, addressId}) => ({
                url : "/createupdate",
                method : "POST",
                body : {addressLine1, addressLine2, phoneNumber, city, state, pincode, addressId}
            })
        }),
        GetAddressByUserId : builder.query({
            query : () => ({
                url : "/",
                method : "GET",
            })
        }),
        GetAddressAddressId : builder.query({
            query : (addressId) => ({
                url : "/address",
                method : "GET",
                body : {addressId}
            })
        }),
    })
})


export const {
    useCreateUpdateAddressByUserIdMutation,
    useGetAddressByUserIdQuery
} = addressApi