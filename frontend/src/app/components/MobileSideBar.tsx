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
import { useLoaderUserQuery } from "@/store/api/userApi";

const MobileSideBar = () => {
    const { data } = useLoaderUserQuery({})
    const [text, setText] = useState<string>("")
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const MenuItems = [
        { icon: <User className="w-5 h-5 text-gray-700" />, text: "My Profile" },
        { icon: <BookOpen className="w-5 h-5 text-gray-700" />, text: "All Books" },
        { icon: <ShoppingBag className="w-5 h-5 text-gray-700" />, text: "Sell Book" },
        { icon: <ListOrdered className="w-5 h-5 text-gray-700" />, text: "My Orders" },
        { icon: <BringToFront className="w-5 h-5 text-gray-700" />, text: "My Selling Orders" },
        { icon: <ShoppingBagIcon className="w-5 h-5 text-gray-700" />, text: "Cart" },
        { icon: <Heart className="w-5 h-5 text-red-500" />, text: "Wishlist" },
        { icon: <Users className="w-5 h-5 text-gray-700" />, text: "About Us" },
        { icon: <Receipt className="w-5 h-5 text-gray-700" />, text: "Terms & Use" },
        { icon: <Siren className="w-5 h-5 text-gray-700" />, text: "Privacy Policy" },
        { icon: <CircleHelp className="w-5 h-5 text-gray-700" />, text: "Help" },
        { icon: <LogOut className="w-5 h-5 text-gray-700" />, text: "LogOut" },
    ];

    useEffect(() => {
        if (text === "About Us") {
            router.push("/about-us")
            setIsOpen(false);
        }
        if (text === "Privacy Policy") {
            router.push("/privacy-policy")
            setIsOpen(false);
        }
        if (text === "Terms & Use") {
            router.push("/terms-of-use")
            setIsOpen(false);
        }
        if (text === "All Books") {
            router.push("/books")
            setIsOpen(false);
        }
        if (text === "Sell Book") {
            router.push("/book-sell")
            setIsOpen(false);
        }

        if (text === "My Profile") {
            router.push("/account/profile")
            setIsOpen(false)
        }
        if (text === "Cart") {
            router.push("/checkout/cart")
            setIsOpen(false)
        }
        if (text === "Wishlist") {
            router.push("/account/wishlist")
            setIsOpen(false)
        }
        if (text === "My Selling Orders") {
            router.push("/account/selling-products")
            setIsOpen(false)
        }
        if (text === "My Orders") {
            router.push("/account/orders")
            setIsOpen(false)
        }
        if (text === "Help") {
            router.push("/help")
            setIsOpen(false)
        }

    }, [text, router])

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="font-medium rounded-md lg:hidden transition duration-300">
                <AlignJustify />
            </SheetTrigger>
            <SheetContent side="left" className="w-[350px] bg-white shadow-lg p-4">
                <SheetHeader>
                    <SheetTitle>
                        {
                            data?.user ?
                                <div className="flex items-center space-x-3 p-4 border-b">
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" className="w-10 h-10 rounded-full" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900">{data?.user?.name}</span>
                                        <span className="text-sm text-gray-500">{data?.user?.email}</span>
                                    </div>
                                </div>
                                : <></>
                        }
                    </SheetTitle>
                    <div className="mt-4">
                        {
                            data?.user ? <></> : <LoginDialog />
                        }
                        {MenuItems.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => setText(item.text)}
                                className="flex justify-between items-center p-2.5 rounded-lg hover:bg-gray-100 transition duration-300 cursor-pointer"
                            >
                                <div className="flex items-center gap-3 text-gray-700 font-medium">
                                    {item.icon}
                                    {item.text}
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                            </div>
                        ))}
                    </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
};

export default MobileSideBar;
