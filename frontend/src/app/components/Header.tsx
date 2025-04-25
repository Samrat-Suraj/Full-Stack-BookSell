"use client"
import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import MobileSideBar from "./MobileSideBar";
import AccountMenuDialog from "./AccountMenuDialog";
import { usePathname, useRouter } from "next/navigation";
import { useGetAllProductQuery } from "@/store/api/productApi";
import { useGetCartByUserQuery } from "@/store/api/cartApi";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMessage } from "@/store/slice/authSlice";
import { toast } from "sonner";


const Header = () => {
    const dispatch = useDispatch()
    const { user } = useSelector((store: any) => store.auth)
    const { data: cartData } = useGetCartByUserQuery({})
    const totalQuantity = cartData?.cart?.items?.reduce((sum: number, item: any) => sum + item?.quantity, 0);
    const router = useRouter()
    const { data, isLoading } = useGetAllProductQuery({});
    const books = data?.products
    const pathname = usePathname()
    const isActive = (path: string) => pathname === path

    const [text, setText] = useState<String>("")
    const [searchBooks, setSearchBooks] = useState<any>("")

    useEffect(() => {
        const bookSearch = books?.filter((book: any) => {
            if (!text) {
                return false
            }
            return (
                book.category.toLowerCase().includes(text.toLowerCase()) ||
                book.classType.toLowerCase().includes(text.toLowerCase()) ||
                book.condition.toLowerCase().includes(text.toLowerCase()) ||
                book.author.toLowerCase().includes(text.toLowerCase()) ||
                book.title.toLowerCase().includes(text.toLowerCase())
            )
        })
        setSearchBooks(bookSearch)
    }, [books, text])

    const onClickHander = (id: string) => {
        setText("")
        if (!user) {
            toast.error("Please log in to continue")
            dispatch(setErrorMessage(true))
        } else {
            router.push(`/books/${id}`)
        }
    }

    
useEffect(() => {
    const allowedPaths = [
        "/", 
        "/books", 
        "/checkout/cart", 
        "/help", 
        "/terms-of-use", 
        "/privacy-policy", 
        "/about-us"
    ];

   
    const dynamicAllowedPatterns = [
        /^\/reset-password\/[^\/]+$/ 
    ];

    const isAllowedPath = allowedPaths.includes(pathname) || 
        dynamicAllowedPatterns.some((pattern) => pattern.test(pathname));

    if (!user && !isAllowedPath) {
        dispatch(setErrorMessage(true));
        router.push("/");
    }
}, [user, pathname]);

    
    

    const sellBookNavigateHandler = () => {
        if (!user) {
            router.push("/");
            dispatch(setErrorMessage(true));
        } else {
            router.push("/book-sell");
        }
    };

    const clickOnSetMessageHander = () => {
        dispatch(setErrorMessage(false))
    }

    if (isLoading) {
        return
    }

    return (
        <div className="mx-auto pt-6 pb-6 border ">

            <div className="w-[85%] flex items-center justify-between mx-auto">
                <MobileSideBar />
                <Link href={"/"}>
                    <h1 className="text-xl sm:text-3xl md:text-4xl cursor-pointer font-extrabold text-gray-800">
                        BookSell.In
                    </h1>
                </Link>


                <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm items-center">
                    {/* Button Section */}
                    <div className="gap-6 hidden lg:flex md:flex items-center">
                        <Link href={"/"}>
                            <button onClick={clickOnSetMessageHander} className={`py-2 cursor-pointer ${isActive("/") ? "border-b-2" : ""}  border-black transition ease-in-out duration-1000 text-xs sm:text-sm`}>
                                Home
                            </button>
                        </Link>
                        <Link href={"/books"}>
                            <button onClick={clickOnSetMessageHander} className={`py-2 cursor-pointer ${isActive("/books") ? "border-b-2" : ""}  border-black duration-1000 ease-in-out transition text-xs sm:text-sm`}>
                                Books
                            </button>
                        </Link>


                        <button onClick={sellBookNavigateHandler} className={`py-2 cursor-pointer ${isActive("/book-sell") ? "border-b-2" : ""}  border-black duration-1000 ease-in-out transition text-xs sm:text-sm`}>
                            Sell Books Now
                        </button>

                    </div>

                    {/* Search Bar */}
                    <div className=" relative ">
                        <div className="flex ml-4 items-center w-[40vw] sm:w-[30vw] md:max-w-md border-2 border-gray-300 rounded-full">
                            <Search className="text-gray-500 ml-2 w-5 h-5 sm:w-6 sm:h-6" />
                            <input
                                type="text"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
                                className="p-2 text-gray-950 w-full border-none outline-none rounded-r-lg text-xs sm:text-sm"
                                placeholder="Search Book Name, Author, or Subject"
                            />
                        </div>

                        {
                            searchBooks?.length > 0 && (
                                <div className="absolute bg-white lg:w-[380px] md:w-[280px] w-[160px] right-0 gap-2 rounded-sm mt-4 z-1 p-3">
                                    <div className="flex flex-col gap-2 rounded-sm">
                                        {searchBooks.slice(0, 10).map((item: any, index: number) => (
                                            <p
                                                key={item?._id || index}
                                                onClick={() => onClickHander(item?._id)}
                                                className="p-2 cursor-pointer rounded-lg bg-gray-100"
                                            >
                                                {item?.title}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )
                        }


                    </div>


                </div>

                {/* Icon Section */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <AccountMenuDialog />
                    <Link href={"/checkout/cart"}>
                        <div className=" relative cursor-pointer">
                            <ShoppingCart className="text-gray-700 w-6 h-6 sm:w-8 sm:h-8 hover:text-black transition" />
                            <div className="h-4 w-4 rounded-full absolute top-0 right-0 flex items-center justify-center bg-red-600 text-xs text-white font-semibold">{totalQuantity ? totalQuantity : 0}</div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Header;
