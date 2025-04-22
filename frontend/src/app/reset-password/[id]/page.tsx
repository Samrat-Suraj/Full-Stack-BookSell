"use client"
import ErrorMessage from '@/app/components/ErrorMessage';
import { useForGetPasswordMutation, useResetPasswordMutation } from '@/store/api/userApi';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from "sonner"


interface ResetPasswordType {
    newPassword: string
}

const ResetPassword = () => {
    const { errorMessage } = useSelector((store: any) => store.auth)

    const router = useRouter()
    const { id: token } = useParams()
    const [forGetPassword, { isLoading, isSuccess, isError, error }] = useResetPasswordMutation()
    const [fromData, setFromData] = useState<ResetPasswordType>({
        newPassword: ""
    })

    const onChangeHander = (e: ChangeEvent<HTMLInputElement>) => {
        setFromData({ ...fromData, [e.target.name]: e.target.value })
    }

    const onClickHander = async () => {
        await forGetPassword({ token, fromData })
    }


    useEffect(() => {
        if (isSuccess) {
            // const err = forGetPassword as FetchBaseQueryError
            router.push("/")
            toast.success("Password Chnage Successfully")

        }
        else if (isError) {
            const err = error as FetchBaseQueryError
            toast.error((err?.data as { message?: string })?.message || "Registration failed!");
        }
    }, [isLoading, isSuccess, isError, error, forGetPassword])

    return (

        <>
            {
                errorMessage ? <ErrorMessage /> : <></>
            }
            <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 text-center">Reset Your Password</h2>
                    <p className="text-gray-600 text-center">Please enter your new password below.</p>

                    <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            name='newPassword'
                            value={fromData.newPassword}
                            onChange={onChangeHander}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter new password"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={onClickHander}
                        className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
                    >
                        {isLoading ? <Loader2 className='h-5 w-5 animate-spin' /> : "Change Password"}

                    </button>
                </div>
            </div>
        </>


    );
};

export default ResetPassword;
