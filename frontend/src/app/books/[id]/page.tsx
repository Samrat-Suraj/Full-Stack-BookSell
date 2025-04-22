"use client";
import { Separator } from "@/components/ui/separator";
import { Check, Heart, Share2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import { useGetProductByIdQuery } from "@/store/api/productApi";
import { useAddToWishListAndRemoveMutation, useGetWishListByUserQuery } from "@/store/api/wishlistApi";
import { toast } from "sonner";
import { FaHeart } from "react-icons/fa6"
import { ShareButton } from "@/app/components/Share";
import { useAddToCartMutation, useGetCartByUserQuery } from "@/store/api/cartApi";
import SpinningLoader from "@/app/components/SpinningLoader";


const BookDetails = () => {
  const { id: productId } = useParams()
  const {refetch : refetchCart} = useGetCartByUserQuery({})
  const [AddToWishListAndRemove, { data: wishListData, isLoading: wishListIsLoading, isError: wishListIError, error: wislistError, isSuccess: wishistIsSuccess }] = useAddToWishListAndRemoveMutation()
  const { data: wishlist, refetch } = useGetWishListByUserQuery({})
  const [AddToCart, { data: cartData, isLoading: cartIsLoading, isSuccess: cartIsSuccess, error: cartError }] = useAddToCartMutation()
  // Some Use For : --- [{_id: 555555555}]
  const isAlreadyInWishList = wishlist?.wishlist?.products?.some((product: any) => product?._id === productId);
  const { data, isLoading } = useGetProductByIdQuery(productId)
  const book = data?.product

  const [currentImage, setCurrentImage] = useState("");

  const onClickSetImageHandler = (image: string) => {
    setCurrentImage(image);
  };

  const addToCartHander = async (productId : string, quantity : number) => {
    await AddToCart({ productId, quantity: 1 })
  }

  const onClickWishListHander = async () => {
    await AddToWishListAndRemove(productId)
    refetch()
  }

  useEffect(() => {
    if (wishistIsSuccess && wishListData) {
      toast.success(wishListData.message)
    }
    if (cartIsSuccess && cartData) {
      refetchCart()
      toast.success(cartData.message)
    }
    if (cartError) {
      toast.success("Error To Add In Cart Or You cant add Your product in cart")
    }
  }, [wishistIsSuccess , cartIsSuccess , cartError])

  if (isLoading) {
    return <SpinningLoader />
  }



  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <Image
            src={currentImage || data?.product?.images[0]}
            alt="book-image"
            width={600}
            height={400}
            className="rounded-lg h-[440px] p-4 bg-gray-100 shadow-lg w-full"
          />
          <div className="flex gap-2 mt-4 p-2 overflow-x-auto">
            {book?.images?.map((image: string, index: number) => (
              <div
                key={index}
                className={`border rounded-lg p-0.5 cursor-pointer transition-all duration-200 ${currentImage === image ? "border-2 border-red-600 scale-105" : "border-gray-300"
                  }`}
                onClick={() => onClickSetImageHandler(image)}
              >
                <Image src={image} alt="book-image" width={80} height={80} className=" h-[70px] rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <div className="border p-6 rounded-lg shadow-lg bg-white">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{book?.title}</h1>
            <div className="flex gap-3">

              <ShareButton url={`${window.location.origin}/books/${book?._id}`} title={`check out this book ${book?.title}`} text={`I found this amazing book titled "${book?.title}" — thought you might like it too!`} />

              <button onClick={onClickWishListHander} className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-all">
                {isAlreadyInWishList ? <div className="flex gap-2 items-center"><FaHeart className="text-red-600" size={18} /><p className="text-red-600" >Remove</p></div> : <div className="flex gap-2 items-center"><Heart size={18} />Add</div>}
              </button>
            </div>
          </div>
          {/* <p className="text-sm text-gray-500 mb-2">Posted {book?.createdAt?.toLocaleDateString()?.split("/")[1]} months ago</p> */}
          <div className="flex items-center gap-4 mb-4">
            <p className="text-3xl font-bold text-gray-900">
              ₹{book?.finalPrice}
              <span className="line-through text-gray-500 ml-2 text-xl">₹{book?.price}</span>
            </p>
            <span className="text-green-600 font-semibold">Shipping Available</span>
          </div>
          <button onClick={() => addToCartHander(book._id , 1)} className={`w-full ${cartIsLoading ? "bg-gray-300 text-black" : "bg-blue-700 hover:bg-blue-600 text-white" } py-2 rounded-lg font-semibold transition-all`}>
            {cartIsLoading ? "Add To Cart........" : "Buy Now"}
          </button>

          <div className="bg-gray-50 p-4 rounded-lg mt-6">
            <h2 className="text-xl font-semibold mb-4">Book Details</h2>
            <div className="grid grid-cols-2 gap-2 text-gray-700">
              <div>Subject</div> <div>{book?.subject}</div>
              <div>Course</div> <div>{book?.classType}</div>
              <div>Category</div> <div>{book?.category}</div>
              <div>Author</div> <div>{book?.author}</div>
              <div>Edition</div> <div>{book?.edition}</div>
              <div>Condition</div> <div>{book?.condition}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="shadow-sm p-5">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700 mb-4">{book?.description}</p>
          <Separator className="my-4" />
          <h2 className="text-xl font-semibold mb-2">Our Community</h2>
          <p className="text-gray-700">We are a vibrant community of students and book lovers across India!</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Sold By</h2>
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
            <Avatar>
              <AvatarImage src={book?.seller?.profilePicture} />
              <AvatarFallback>{book?.seller?.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                {book?.seller?.name} <Badge><Check size={16} /></Badge>
              </h3>
              <p className="text-sm text-gray-500">{book?.seller?.address?.[0]?.addressLine1}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
