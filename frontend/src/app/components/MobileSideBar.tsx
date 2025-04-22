import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    AlignJustify,
    BookOpen,
    BringToFront,
    ChevronRight,
    CircleHelp,
    Heart,
    ListOrdered,
    LogOut,
    Receipt,
    ShoppingBag,
    ShoppingBagIcon,
    Siren,
    User,
    Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginDialog from "./LoginDialog";
import { useLogoutMutation } from "@/store/api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMessage, setUser } from "@/store/slice/authSlice";
import { toast } from "sonner";

const MobileSideBar = () => {
    const dispatch = useDispatch();
    const [Logout, { isError, isSuccess }] = useLogoutMutation();
    const { user } = useSelector((store: any) => store.auth);
    const [text, setText] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const MenuItems = [
        { icon: <User className="w-5 h-5 text-gray-700" />, text: "My Profile", authRequired: true },
        { icon: <BookOpen className="w-5 h-5 text-gray-700" />, text: "All Books", authRequired: true },
        { icon: <ShoppingBag className="w-5 h-5 text-gray-700" />, text: "Sell Book", authRequired: true },
        { icon: <ListOrdered className="w-5 h-5 text-gray-700" />, text: "My Orders" },
        { icon: <BringToFront className="w-5 h-5 text-gray-700" />, text: "My Selling Orders", authRequired: true },
        { icon: <ShoppingBagIcon className="w-5 h-5 text-gray-700" />, text: "Cart", authRequired: true },
        { icon: <Heart className="w-5 h-5 text-red-500" />, text: "Wishlist", authRequired: true },
        { icon: <Users className="w-5 h-5 text-gray-700" />, text: "About Us" },
        { icon: <Receipt className="w-5 h-5 text-gray-700" />, text: "Terms & Use" },
        { icon: <Siren className="w-5 h-5 text-gray-700" />, text: "Privacy Policy" },
        { icon: <CircleHelp className="w-5 h-5 text-gray-700" />, text: "Help" },
        { icon: <LogOut className="w-5 h-5 text-gray-700" />, text: "LogOut" },
    ];

    useEffect(() => {
        const handleNavigation = async () => {
            switch (text) {
                case "About Us":
                    router.push("/about-us");
                    break;
                case "Privacy Policy":
                    router.push("/privacy-policy");
                    break;
                case "Terms & Use":
                    router.push("/terms-of-use");
                    break;
                case "All Books":
                    router.push("/books");
                    break;
                case "Sell Book":
                    router.push("/book-sell");
                    break;
                case "My Profile":
                    router.push("/account/profile");
                    break;
                case "Cart":
                    router.push("/checkout/cart");
                    break;
                case "Wishlist":
                    router.push("/account/wishlist");
                    break;
                case "My Selling Orders":
                    router.push("/account/selling-products");
                    break;
                case "My Orders":
                    router.push("/account/orders");
                    break;
                case "Help":
                    router.push("/help");
                    break;
                case "LogOut":
                    await Logout({ reason: "User initiated logout" });
                    break;
                default:
                    break;
            }

            setIsOpen(false);
        };

        if (text) {
            handleNavigation();
        }
    }, [text, router, Logout]);

    useEffect(() => {
        if (isSuccess) {
            toast.success("Logout Successfully");
            dispatch(setUser({}));
        }
    }, [isSuccess, dispatch]);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="font-medium rounded-md lg:hidden transition duration-300">
                <AlignJustify />
            </SheetTrigger>
            <SheetContent side="left" className="w-[350px] bg-white shadow-lg p-4">
                <SheetHeader>
                    <SheetTitle>
                        {user && (
                            <div className="flex items-center space-x-3 p-4 border-b">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" className="w-10 h-10 rounded-full" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900">{user?.name}</span>
                                    <span className="text-sm text-gray-500">{user?.email}</span>
                                </div>
                            </div>
                        )}
                    </SheetTitle>
                    <div className="mt-4">
                        {!user && <LoginDialog />}
                        {MenuItems.map((item, index) => {
                            const isAllowed = !item.authRequired || (item.authRequired && user);
                            return (
                                <div
                                    key={index}
                                    onClick={() => {
                                        if (!isAllowed) {
                                            toast.error("Please login to continue.");
                                            setIsOpen(false); setIsOpen(false);
                                            dispatch(setErrorMessage(true));
                                            return;
                                        }
                                        setText(item.text);
                                    }}
                                    className="flex justify-between items-center p-2.5 rounded-lg hover:bg-gray-100 transition duration-300 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3 text-gray-700 font-medium">
                                        {item.icon}
                                        {item.text}
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-500" />
                                </div>
                            );
                        })}
                    </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
};

export default MobileSideBar;
