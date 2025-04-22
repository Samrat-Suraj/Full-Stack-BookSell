import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const PRODUCT_ENDPOINT = "http://localhost:5000/api/product"

export const productApi = createApi({
    reducerPath : "product",
    baseQuery : fetchBaseQuery({
        baseUrl : PRODUCT_ENDPOINT,
        // credentials : "include"
    }),
    endpoints : (builder) => ({
        CreateProduct : builder.mutation({
            query : (fullFromData) => ({
                url : "/create",
                method : "POST",
                body : fullFromData,
                credentials : "include"
            })
        }),
        GetAllProduct : builder.query({
            query : () => ({
                url : "/products",
                method : "GET",
            })
        }),
        GetProductById : builder.query({
            query : (productId) => ({
                url: `/product/${productId}`,
                method : "GET",
                credentials : "include"
            })
        }),
        DeleteProductById : builder.mutation({
            query  : (productId) => ({
                url : `/product-remove/${productId}`,
                method : "DELETE",
                credentials : "include"
            })
        }),
        GetProductBySellerId : builder.query({
            query : (sellerId) => ({
                url : `/seller/${sellerId}`,
                method : "GET",
                credentials : "include"
            })
        })
    })
})


export const {
    useCreateProductMutation,
    useDeleteProductByIdMutation,
    useGetAllProductQuery,
    useGetProductByIdQuery,
    useGetProductBySellerIdQuery,
} = productApi


