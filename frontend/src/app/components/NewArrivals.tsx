"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useGetAllProductQuery } from "@/store/api/productApi"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { setErrorMessage } from "@/store/slice/authSlice"
import { toast } from "sonner"

// Helper to chunk array into groups of 4
const chunkArray = (arr: any[], size: number) => {
  const result = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

const NewArrivals = () => {
  const router = useRouter()
  const { user } = useSelector((store: any) => store.auth)
  const dispatch = useDispatch()

  const onClickHander = (id : string) => {
    if (!user) {
      toast.error("Please log in to continue")
      dispatch(setErrorMessage(true))
      return
    } else {
      router.push(`/books/${id}`)
    }
  }

  const { data, isLoading } = useGetAllProductQuery({})
  const [currentBookSlide, setCurrentBookSlide] = useState(0)

  const productChunks = data?.products ? chunkArray(data.products, 4) : []

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBookSlide((prev) => (prev + 1) % productChunks.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [productChunks.length])

  const prevHandler = () => {
    setCurrentBookSlide((prev) => (prev - 1 + productChunks.length) % productChunks.length)
  }

  const nextHandler = () => {
    setCurrentBookSlide((prev) => (prev + 1) % productChunks.length)
  }

  if (isLoading) {
    return <p className="bg-green-400 p-2 mt-4 mb-4 w-full text-center text-white">Loading......</p>
  }

  return (
    <div className="mt-4 lg:w-[95%] w-[95%] mb-14 mx-auto">
      <h1 className="text-center text-4xl mb-5">NEW ARRIVALS</h1>
      <div className="overflow-hidden relative">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentBookSlide * 100}%)` }}
        >
          {productChunks.map((chunk, slideIndex) => (
            <div key={slideIndex} className="flex-none w-full">
              <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
                {chunk.map((item: any, index: number) => (
                  
                    <div key={index} onClick={() => onClickHander(item?._id)} className="relative shadow-md p-2">
                      <Image
                        src={item.images[0]}
                        className="object-fill rounded-sm w-full h-72"
                        alt="book"
                        height={100}
                        width={100}
                      />
                      <div className="p-2 space-y-3">
                        <h1 className="text-sm font-semibold text-gray-800 truncate">
                          {item?.title}
                        </h1>
                        <p className="text-sm text-gray-500 line-clamp-2">{item?.description}</p>
                        <div className="flex justify-between items-center text-gray-700">
                          <p className="flex items-center gap-2">
                            <span className="text-green-600 font-bold">₹ {item?.finalPrice}/-</span>
                            <span className="line-through text-red-500">₹ {item?.price}/-</span>
                          </p>
                          <p className="bg-green-100 text-green-700 px-2 py-1 text-sm font-medium">{item?.condition}</p>
                        </div>
                      </div>
                      <p className="absolute top-3 bg-red-500 w-fit flex text-white pl-2 p-1 right-2 rounded-l-xl font-semibold text-sm">
                        {Math.floor(((item?.price - item?.finalPrice) / item?.price) * 100)}% OFF
                      </p>
                    </div>
                  
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <div className="flex absolute top-1/2 -translate-y-1/2 justify-between w-full px-4">
          <ChevronLeft
            size={30}
            onClick={prevHandler}
            className="text-black p-1 cursor-pointer bg-gray-100/45 rounded-full"
          />
          <ChevronRight
            size={30}
            onClick={nextHandler}
            className="text-black p-1 cursor-pointer bg-gray-100/45 rounded-full"
          />
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-3 mt-9">
        {productChunks.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentBookSlide(index)}
            className={`w-3 h-3 cursor-pointer rounded-full ${index === currentBookSlide ? "bg-green-400" : "bg-gray-400"
              }`}
          ></div>
        ))}
      </div>
    </div>
  )
}

export default NewArrivals
