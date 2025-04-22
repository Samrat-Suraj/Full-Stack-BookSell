import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser } from "../slice/authSlice";


export const USER_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/user`

export const userApi = createApi({
    tagTypes: ["User_Refech"],
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: USER_ENDPOINT,
        credentials: "include"
    }),
    endpoints: (builder) => ({
        loaderUser: builder.query({
            query: () => ({
                url: "/",
                method: "GET",
            }),
            providesTags: ["User_Refech"],
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(setUser({ user: result.data.user }))
                } catch (error: any) {
                    console.log(error.message)
                }
            },

        }),

        register: builder.mutation({
            query: (SignUpFormData) => ({
                url: "/register",
                method: "POST",
                body: SignUpFormData
            })
        }),
        verifyEmail: builder.mutation({
            query: (token) => ({
                url: `/verify/${token}`,
                method: "POST",
            })
        }),
        login: builder.mutation({
            query: (LoginFormData) => ({
                url: "/login",
                method: "POST",
                body: LoginFormData
            })
        }),
        Logout: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST",
            }),
            invalidatesTags: ["User_Refech"]
        }),
        forGetPassword: builder.mutation({
            query: (ForgetFormData) => ({
                url: "/forget",
                method: "POST",
                body: ForgetFormData
            })
        }),

        ResetPassword: builder.mutation({
            query: ({ token, fromData }) => ({
                url: `/reset-password/${token}`,
                method: "POST",
                body: fromData
            })
        }),
        updateUserProfile: builder.mutation({
            query: (inputData) => ({
                url: `/user-update`,
                method: "PUT",
                body: inputData
            })
        }),
    })
})

export const {
    useLoaderUserQuery,
    useForGetPasswordMutation,
    useLogoutMutation,
    useLoginMutation,
    useRegisterMutation,
    useVerifyEmailMutation,
    useResetPasswordMutation,
    useUpdateUserProfileMutation,
} = userApi