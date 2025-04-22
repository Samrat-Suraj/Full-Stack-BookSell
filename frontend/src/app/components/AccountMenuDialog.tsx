"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    BringToFront,
    ChevronRight,
    CircleHelp,
    Heart,
    ListOrdered,
    LogOut,
    Receipt,
    ShoppingBagIcon,
    Siren,
    User,
    UserCircle,
    Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoginDialog from "./LoginDialog";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderUserQuery, useLogoutMutation } from "@/store/api/userApi";
import { toast } from "sonner";
import { setErrorMessage, setUser } from "@/store/slice/authSlice";

const AccountMenuDialog = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { refetch } = useLoaderUserQuery({});
    const [Logout, { isSuccess }] = useLogoutMutation();
    const { user } = useSelector((store: any) => store.auth);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleNavigate = (route: string) => {
        router.push(route);
        setIsOpen(false);
    };

    const handelLogout = async (text: string) => {
        if (text === "LogOut") {
            await Logout({ reason: text });
        }
    };

    useEffect(() => {
        if (isSuccess) {
            refetch();
            router.push("/");
            dispatch(setUser({}));
            toast.success("Logout Successfully");
        }
    }, [isSuccess, Logout, refetch]);

    const MenuItems = [
        { icon: <User className="w-5 h-5 text-gray-700" />, text: "My Profile", route: "/account/profile", authRequired: true },
        { icon: <ListOrdered className="w-5 h-5 text-gray-700" />, text: "My Orders", route: "/account/orders", authRequired: true },
        { icon: <BringToFront className="w-5 h-5 text-gray-700" />, text: "My Selling Orders", route: "/account/selling-products", authRequired: true },
        { icon: <ShoppingBagIcon className="w-5 h-5 text-gray-700" />, text: "Cart", route: "/checkout/cart", authRequired: true },
        { icon: <Heart className="w-5 h-5 text-red-500" />, text: "Wishlist", route: "/account/wishlist", authRequired: true },
        { icon: <Users className="w-5 h-5 text-gray-700" />, text: "About Us", route: "/about-us", authRequired: false },
        { icon: <Receipt className="w-5 h-5 text-gray-700" />, text: "Terms & Use", route: "/terms-of-use", authRequired: false },
        { icon: <Siren className="w-5 h-5 text-gray-700" />, text: "Privacy Policy", route: "/privacy-policy", authRequired: false },
        { icon: <CircleHelp className="w-5 h-5 text-gray-700" />, text: "Help", route: "/help", authRequired: false },
        user && { icon: <LogOut className="w-5 h-5 text-gray-700" />, text: "LogOut", route: "/", authRequired: true },
    ].filter(Boolean);

    return (
        <div className="lg:flex hidden">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger>
                    <div className="flex items-center space-x-2 cursor-pointer hover:text-gray-900 transition duration-300">
                        {user?.profilePicture ? (
                            <Image src={user.profilePicture} alt="profileimage" width={32} height={32} className="rounded-full p-[1px] border-2 border-black" />
                        ) : (
                            <UserCircle className="text-gray-700 w-6 h-6 sm:w-8 sm:h-8 cursor-pointer hover:text-black transition" />
                        )}
                    </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-[340px] mt-7 mr-7 bg-white shadow-xl rounded-lg p-2">
                    {
                        user ?
                            <DropdownMenuLabel>
                                <div className="flex items-center space-x-3 p-4 border-b">
                                    <Avatar>
                                        <AvatarImage src={user?.profilePicture || "https://github.com/shadcn.png"} className="w-10 h-10 rounded-full" />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-gray-900">{`${user?.name[0]?.toUpperCase()}${user?.name?.slice(1)}` || "Guest User"}</p>
                                        <p className="text-sm text-gray-500">{user?.email || "guest@example.com"}</p>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            : <></>
                    }

                    {!user && <LoginDialog />}

                    {MenuItems.map((item, index) => (
                        <DropdownMenuItem
                            key={index}
                            onClick={() => {
                                if (item.authRequired && !user) {
                                    toast.error("Please login to continue.");
                                    dispatch(setErrorMessage(true));
                                    return;
                                }
                                if (item.text === "LogOut") {
                                    handelLogout(item.text);
                                } else {
                                    handleNavigate(item.route as string);
                                }
                            }}
                            className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100 transition duration-300 cursor-pointer"
                        >
                            <div className="flex items-center gap-3 text-gray-700 font-medium">
                                {item.icon}
                                {item.text}
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default AccountMenuDialog;
