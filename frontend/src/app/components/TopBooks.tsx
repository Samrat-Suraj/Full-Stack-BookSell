"use client"
import { useEffect, useState } from "react"
import Image from "next/image";
import { useGetAllProductQuery } from "@/store/api/productApi";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMessage } from "@/store/slice/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const TopBooks = () => {
    const { data, isLoading } = useGetAllProductQuery({});
    const [randomBooks, setRandomBooks] = useState<any[]>([]);
    const router = useRouter()
    const { user } = useSelector((store: any) => store.auth)
    const dispatch = useDispatch()

    const onClickHander = (id: string) => {
        if (!user) {
            toast.error("Please log in to continue")
            dispatch(setErrorMessage(true))
        } else {
            router.push(`/books/${id}`)
        }
    }

    useEffect(() => {
        if (data?.products) {
            const shuffled = shuffleArray(data.products);
            setRandomBooks(shuffled.slice(0, 4)); // Show any 4 random products
        }
    }, [data]);

    if (isLoading) {
        return <p>Loading.....</p>
    }

    return (
        <div className="mt-4 lg:w-[95%] w-[95%] mb-2 mx-auto">
            <h1 className="text-center text-4xl mb-5">TOP BOOKS</h1>
            <div className="grid lg:grid-cols-4 gap-4 md:grid-cols-3 grid-cols-1">
                {
                    randomBooks.map((item: any, index: number) => (
                        <div key={item?._id} onClick={() => onClickHander(item?._id)} className="p-2">
                            <Image
                                src={item?.images[0]}
                                className="object-fill rounded-sm w-full h-72"
                                alt="book"
                                height={100}
                                width={100}
                            />
                            <div className="p-2 space-y-3">
                                <h1 className="text-sm font-semibold text-gray-800 truncate">
                                    {item?.title}
                                </h1>
                                <div className="flex justify-between items-center text-gray-700">
                                    <p className="flex items-center gap-2">
                                        <span className="text-green-600 font-bold">₹ {item?.finalPrice}/-</span>
                                        <span className="line-through text-red-500">₹ {item?.price}/-</span>
                                    </p>
                                    <p className="bg-green-100 text-green-700 px-2 py-1 text-sm font-medium">
                                        {item?.condition}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default TopBooks;
