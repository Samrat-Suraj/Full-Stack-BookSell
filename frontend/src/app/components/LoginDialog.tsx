"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRight, Ellipsis, Loader2, Lock, LockKeyholeIcon, LogIn, Mail, User } from "lucide-react";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa6";

import { LoginFormSchema, LoginFormType, LoginFromError } from "@/types/LoginForm";
import { SignUpFormError, SignUpFormSchema, SignUpFormType } from "@/types/SignUpForm";
import { ForgetFormError, ForgetFormSchema, ForgetFormType } from "@/types/ForgetForm";
import { useForGetPasswordMutation, useLoaderUserQuery, useLoginMutation, USER_ENDPOINT, useRegisterMutation } from "@/store/api/userApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LoginDialog = () => {
    const [open, setOpen] = useState<boolean>(false)
    const router = useRouter()
    const [googleLoading, setGoogleLoading] = useState(false)

    const [register, { data: registerData, isLoading: registerIsloading, isSuccess: reqgisterIsSuccess, error: registerError, isError: registerIsError }] = useRegisterMutation()
    const [login, { data: loginData, isLoading: loginIsloading, error: loginsError, isError: loginIsError }] = useLoginMutation()
    const [forGetPassword, { data: forgetData, isLoading: forgetIsloading, error: forgetsError, isSuccess: fogetIsSuccess, isError: forgetIsError }] = useForGetPasswordMutation()
    const { refetch } = useLoaderUserQuery({})
    const [loginError, setLoginError] = useState<LoginFromError>({});
    const [signUpError, setSignUpError] = useState<SignUpFormError>({});
    const [forgetError, setForgetError] = useState<ForgetFormError>({});

    const [SignUpFormData, setSignUpFormData] = useState<SignUpFormType>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeTerms: true,
    });

    const [LoginFormData, setLoginFormData] = useState<LoginFormType>({
        email: "",
        password: "",
    });

    const [ForgetFormData, setForgetFormData] = useState<ForgetFormType>({
        email: "",
    });

    const onChangeSignUpData = (e: ChangeEvent<HTMLInputElement>) => {
        setSignUpFormData({ ...SignUpFormData, [e.target.name]: e.target.value });
    };

    const onChangeLoginData = (e: ChangeEvent<HTMLInputElement>) => {
        setLoginFormData({ ...LoginFormData, [e.target.name]: e.target.value });
    };

    const onChangeForgetFormData = (e: ChangeEvent<HTMLInputElement>) => {
        setForgetFormData({ ...ForgetFormData, [e.target.name]: e.target.value });
    };

    const onSubmitSignUpHander = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const SignupResult = SignUpFormSchema.safeParse(SignUpFormData);
        if (!SignupResult.success) {
            setSignUpError(SignupResult.error.formErrors.fieldErrors);
        } else {
            setSignUpError({});
            await register(SignUpFormData)
        }
    };

    const onSubmitLoginHander = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const LoginResult = LoginFormSchema.safeParse(LoginFormData);
        if (!LoginResult.success) {
            setLoginError(LoginResult.error.formErrors.fieldErrors);
        } else {
            setLoginError({});
            await login(LoginFormData)
        }
    };

    const onSubmitForgetHander = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const ForgetResult = ForgetFormSchema.safeParse(ForgetFormData);
        if (!ForgetResult.success) {
            setForgetError(ForgetResult.error.formErrors.fieldErrors);
        } else {
            setForgetError({});
            await forGetPassword(ForgetFormData)
        }
    };

    const handelGoogleLogin = async () => {
        try {
            setGoogleLoading(true)
            router.push(`${USER_ENDPOINT}/google`)
        } catch (error) {
            console.log(error)
            toast.error("Email or Password is Incorrent")
        } finally {
            setGoogleLoading(false)
        }
    }


    useEffect(() => {
        if (reqgisterIsSuccess) {
            toast.success("Registration successful!");
        }
        if (registerIsError && registerError) {
            const err = registerError as FetchBaseQueryError
            toast.error((err?.data as { message?: string })?.message || "Registration failed!");
        }
        if (loginData) {
            setOpen(false)
            refetch()
            toast.success("Login successful!");
        }
        if (loginIsError && loginsError) {
            const err = loginsError as FetchBaseQueryError
            toast.error((err?.data as { message?: string })?.message || "Registration failed!");
        }
        if (fogetIsSuccess) {
            toast.success("Password reset email sent!");
        }
        if (forgetIsError && forgetsError) {
            const err = forgetsError as FetchBaseQueryError
            toast.error((err?.data as { message?: string })?.message || "Registration failed!");
        }
    }, [reqgisterIsSuccess, registerIsError, registerError, loginData, loginIsError, loginsError, fogetIsSuccess, forgetIsError, forgetsError,]);

    return (
        <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
            <DialogTrigger>
                <div className="flex lg:w-[324px] w-[285px] max-w-md sm:max-w-sm lg:max-w-md justify-between items-center p-3 rounded-lg hover:bg-gray-100 transition duration-300 cursor-pointer">
                    <div className="flex text-sm items-center gap-3 text-gray-700 font-medium">
                        <LogIn size={18} />
                        <p>Login/Sign Up</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                </div>
            </DialogTrigger>

            <DialogContent className="mx-auto w-full max-w-sm sm:max-w-sm lg:max-w-sm p-6 rounded-lg shadow-lg bg-white">
                <DialogHeader>
                    <DialogTitle className="text-center p-0 m-0 font-semibold text-xl">Welcome to Book Cafe</DialogTitle>
                    <DialogDescription className="text-center text-xs text-gray-500 m-0 p-0">
                        Please login, sign up, or recover your account.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="login" className="w-full text-xs">
                    <div className="p-1 bg-gray-100 rounded-sm">
                        <TabsList className="w-full flex flex-wrap justify-center items-center gap-4 bg-gray-100 pl-2 rounded-lg">
                            <TabsTrigger className="cursor-pointer text-xs" value="login">Login</TabsTrigger>
                            <TabsTrigger className="cursor-pointer text-xs" value="signup">Sign Up</TabsTrigger>
                            <TabsTrigger className="cursor-pointer text-xs" value="forget">Forgot</TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Login Tab */}
                    <TabsContent value="login" className="mt-2 text-xs">
                        <form onSubmit={onSubmitLoginHander} className="flex flex-col gap-1">
                            <div className="flex gap-2 items-center w-full border rounded-md p-2 bg-gray-50">
                                <Mail className="text-gray-500" />
                                <input
                                    placeholder="Email"
                                    onChange={onChangeLoginData}
                                    type="email"
                                    value={LoginFormData.email}
                                    name="email"
                                    className="w-full bg-transparent outline-none text-xs"
                                />
                            </div>
                            {loginError.email && <div className="text-red-600 p-1 font-semibold">{loginError.email}</div>}
                            <div className="flex gap-2 items-center w-full border rounded-md p-2 bg-gray-50">
                                <Lock className="text-gray-500" />
                                <input
                                    placeholder="Password"
                                    type="password"
                                    value={LoginFormData.password}
                                    name="password"
                                    onChange={onChangeLoginData}
                                    className="w-full bg-transparent outline-none text-xs"
                                />
                            </div>
                            <div className="p-1">
                                {loginError.password && loginError.password.map((item, index) => {
                                    return (
                                        <div key={index} className="text-red-600 font-semibold">{item}</div>
                                    )
                                })}
                            </div>

                            <Button type="submit" className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md text-xs">
                                {loginIsloading ? <Loader2 className=" w-5 h-5 animate-spin" /> : "Login"}
                            </Button>
                        </form>

                        <div className="mt-4 flex items-center gap-3">
                            <div className="bg-gray-200 h-[2px] w-full"></div>
                            <span className="text-xs text-gray-500">Or</span>
                            <div className="bg-gray-200 h-[2px] w-full"></div>
                        </div>

                        <div className="w-full flex mt-4 items-center justify-center">
                            <Button onClick={handelGoogleLogin}
                                variant="outline"
                                className="flex w-full cursor-pointer items-center justify-center gap-2 border-gray-300 hover:border-gray-400 text-xs"
                            >
                                {
                                    googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <div className="flex items-center gap-2">
                                        <FaGoogle />
                                        <span className="font-semibold">Login With Google</span>
                                    </div>
                                }

                            </Button>
                        </div>
                        <p className="mt-2 text-center text-xs text-gray-500">
                            By clicking "Login", you agree to our Terms of Use & Privacy Policy.
                        </p>
                    </TabsContent>

                    {/* Sign Up Tab */}
                    <TabsContent value="signup" className="mt-4 text-xs">
                        {
                            reqgisterIsSuccess ?
                                <div className="flex w-full h-full justify-center items-center">
                                    <div className=" p-8 rounded-2xl mt-4 flex flex-col justify-center items-center gap-4 max-w-md w-full">
                                        <Ellipsis className="text-green-600" size={80} />
                                        <h2 className="text-2xl font-semibold text-gray-800 text-center">
                                            Check Your Email
                                        </h2>
                                        <p className="text-gray-600 text-center">
                                            We've sent you a link to Verify your Account. Please check your inbox and follow the instructions.
                                        </p>
                                        <TabsList>
                                            <TabsTrigger className="px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition" value="login">
                                                Back to Login
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>
                                </div> :

                                <div>
                                    <form onSubmit={onSubmitSignUpHander} className="flex flex-col gap-1">
                                        <div className="flex gap-2 items-center w-full border rounded-md p-2 bg-gray-50">
                                            <User className="text-gray-500" />
                                            <input
                                                placeholder="Name"
                                                type="text"
                                                onChange={onChangeSignUpData}
                                                value={SignUpFormData.name}
                                                name="name"
                                                className="w-full bg-transparent outline-none text-xs"
                                            />
                                        </div>
                                        {signUpError.name && <div className="text-red-600 p-1 font-semibold">{signUpError.name}</div>}
                                        <div className="flex gap-2 items-center w-full border rounded-md p-2 bg-gray-50">
                                            <Mail className="text-gray-500" />
                                            <input
                                                placeholder="Email"
                                                type="email"
                                                onChange={onChangeSignUpData}
                                                value={SignUpFormData.email}
                                                name="email"
                                                className="w-full bg-transparent outline-none text-xs"
                                            />
                                        </div>
                                        {signUpError.email && <div className="text-red-600 p-1 font-semibold">{signUpError.email}</div>}
                                        <div className="flex gap-2 items-center w-full border rounded-md p-2 bg-gray-50">
                                            <Lock className="text-gray-500" />
                                            <input
                                                placeholder="Password"
                                                type="password"
                                                onChange={onChangeSignUpData}
                                                value={SignUpFormData.password}
                                                name="password"
                                                className="w-full bg-transparent outline-none text-xs"
                                            />
                                        </div>
                                        {
                                            signUpError.password &&
                                            <div className="p-1">
                                                {signUpError.password.map((item, index) => {
                                                    return (
                                                        <div key={index} className="text-red-600 font-semibold">{item}</div>
                                                    )
                                                })}
                                            </div>
                                        }

                                        <div className="flex gap-2 items-center w-full border rounded-md p-2 bg-gray-50">
                                            <LockKeyholeIcon className="text-gray-500" />
                                            <input
                                                placeholder="Confirm Password"
                                                type="password"
                                                onChange={onChangeSignUpData}
                                                value={SignUpFormData.confirmPassword}
                                                name="confirmPassword"
                                                className="w-full bg-transparent outline-none text-xs"
                                            />
                                        </div>
                                        {signUpError.confirmPassword && <div className="text-red-600 p-1 font-semibold">{signUpError.confirmPassword}</div>}
                                        <div className="flex items-center gap-2 mt-1">
                                            <input name="agreeTerms" onChange={onChangeSignUpData} type="checkbox" className="accent-blue-600" />
                                            <p className="text-xs text-gray-500">I agree to the Terms and Conditions</p>
                                        </div>
                                        {/* {signUpError.agreeTerms && <div className="text-red-600 p-1 font-semibold">{signUpError.agreeTerms}</div>} */}
                                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md text-xs">
                                            {registerIsloading ? <Loader2 className=" w-5 h-5 animate-spin" /> : "Sign Up"}
                                        </Button>
                                    </form>
                                    <p className="mt-2 p-2 text-center text-xs text-gray-500">
                                        By clicking "Sign Up", you agree to our Terms of Use & Privacy Policy.
                                    </p>
                                </div>

                        }
                    </TabsContent>

                    {/* Forgot Password Tab */}
                    <TabsContent value="forget" className="mt-4 text-xs">
                        {
                            fogetIsSuccess ?
                                <>
                                    <div className="flex w-full h-full justify-center items-center">
                                        <div className=" p-8 rounded-2xl mt-4 flex flex-col justify-center items-center gap-4 max-w-md w-full">
                                            <Ellipsis className="text-green-600" size={80} />
                                            <h2 className="text-2xl font-semibold text-gray-800 text-center">
                                                Check Your Email
                                            </h2>
                                            <p className="text-gray-600 text-center">
                                                We've sent you a link to change your password. Please check your inbox and follow the instructions.
                                            </p>

                                            <TabsList>
                                                <TabsTrigger className="px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition" value="login">
                                                    Back to Login
                                                </TabsTrigger>
                                            </TabsList>
                                        </div>
                                    </div>
                                </>
                                : <div>
                                    <form onSubmit={onSubmitForgetHander} className="flex flex-col gap-4">
                                        <div className="flex gap-2 items-center w-full border rounded-md p-2 bg-gray-50">
                                            <Mail className="text-gray-500" />
                                            <input
                                                placeholder="Email"
                                                type="email"
                                                onChange={onChangeForgetFormData}
                                                value={ForgetFormData.email}
                                                name="email"
                                                className="w-full bg-transparent outline-none text-xs"
                                            />
                                        </div>
                                        {forgetError.email && <div className="text-red-500 p-1 font-semibold">{forgetError.email}</div>}
                                        <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-md text-xs">
                                            {forgetIsloading ? <Loader2 className=" w-5 h-5 animate-spin" /> : "Send Reset Link"}
                                        </Button>
                                    </form>
                                    <p className="mt-2 p-2 text-center text-xs text-gray-500">
                                        By clicking "Send", you agree to our Terms of Use & Privacy Policy.
                                    </p>
                                </div>
                        }
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default LoginDialog;
