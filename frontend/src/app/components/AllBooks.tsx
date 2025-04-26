"use client"
import Image from "next/image";
import holiImage from "../../../public/images/holi.jpg";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllProductQuery } from "@/store/api/productApi";
import { setErrorMessage } from "@/store/slice/authSlice";
import { useRouter } from "next/navigation";

const AllBooks = () => {
    const router = useRouter()
    const { user } = useSelector((store: any) => store.auth)
    const dispatch = useDispatch()
    const { data, isLoading } = useGetAllProductQuery({});
    const books = data?.products
    const [filtersBooks, setFilterBooks] = useState<any>(books)
    const { filterData } = useSelector((store: any) => store.filterAndSearch)

    const SellBookNavigateHander = (id: string) => {
        if (!user) {
            dispatch(setErrorMessage(true))
        } else {
            router.push(`/books/${id}`)
        }
    }

    useEffect(() => {
        const filteredBooks = books?.filter((book: any) => {
            if (!filterData || filterData?.length === 0) {
                return true
            }
            return filterData.includes(book?.condition) || filterData.includes(book?.classType) || filterData.includes(book?.category)
        })

        setFilterBooks(filteredBooks)
    }, [filterData, books])

    const [currentPage, setCurrentPage] = useState(1)
    const bookPerPage = 6
    const totalPages = Math.ceil(filtersBooks?.length / bookPerPage)

    const paginatedPages = filtersBooks?.slice(
        (currentPage - 1) * bookPerPage,
        currentPage * bookPerPage
    )

    const pageChangeHander = (page: number) => {
        setCurrentPage(page)
    }

    return (
        <div className="flex-1 p-4 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">All Books</h1>
                <div className="flex gap-2 items-center">
                    <p className="text-sm text-gray-600">Show 1 - 6 Books</p>
                    <select className="border rounded-md px-2 py-1 text-sm">
                        <option value="New">Newest First</option>
                        <option value="Old">Oldest First</option>
                    </select>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                {paginatedPages?.map((book: any, index: number) => (

                    <div onClick={() => SellBookNavigateHander(book?._id)} key={index} className="relative bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                        <Image
                            src={book.images[0]}
                            alt="book"
                            width={794} // A4 width in pixels at 96 DPI
                            height={1123} // A4 height in pixels at 96 DPI
                            className="object-cover rounded-sm"
                        />
                        <div className="p-4 space-y-3">
                            <h2 className="text-lg font-semibold text-gray-800 truncate">{book?.title}</h2>
                            <p className="text-sm line-clamp-2 text-gray-500">
                                {book?.description}
                            </p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600 font-bold text-lg">₹ {book.finalPrice}/-</span>
                                    <span className="line-through text-red-500 text-sm">₹ {book.price}/-</span>
                                </div>
                                <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${book.condition === "Excellent"
                                        ? "bg-green-100 text-green-700"
                                        : book.condition === "Good"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : book.condition === "Fair"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-gray-100 text-gray-700" // Default style for unknown conditions
                                        }`}
                                >
                                    {book.condition}
                                </span>

                            </div>
                        </div>
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {book?.price > book?.finalPrice && Math.floor(((book?.price - book?.finalPrice) / book?.price) * 100)}% OFF
                        </div>
                    </div>


                ))}
            </div>
            <Pagination currentPage={currentPage} pageChangeHandler={pageChangeHander} totalPages={totalPages} />
        </div>
    );
};

export default AllBooks;
