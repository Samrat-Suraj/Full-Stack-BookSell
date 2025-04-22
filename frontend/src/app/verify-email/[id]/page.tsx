'use client';

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useVerifyEmailMutation } from "@/store/api/userApi";

const VerifyEmailPage = () => {
    const { id } = useParams();
    const router = useRouter()
    const [verifyEmail, { isLoading, isError, isSuccess }] = useVerifyEmailMutation();

    useEffect(() => {
        if (id) {
            verifyEmail(id as string);
            router.push("/")
        }
    }, [id, verifyEmail]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
            <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Verifying Your Email</h1>
                <p className="text-gray-600 mb-6">
                    We are verifying your email address. This may take a few seconds.
                </p>

                <div className="flex justify-center mb-6">
                    {isLoading && <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />}
                    {isSuccess && <p className="text-green-600 font-semibold">Email Verified Successfully</p>}
                    {isError && <p className="text-red-600 font-semibold">Verification Failed</p>}
                </div>

                <p className="text-sm text-gray-400">
                    Verification ID: <span className="text-gray-600 font-mono">{id}</span>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
