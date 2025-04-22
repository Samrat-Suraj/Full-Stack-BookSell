"use client"
import ProfileSideBar from '@/app/components/ProfileSideBar';
import SpinningLoader from '@/app/components/SpinningLoader';
import { Badge } from '@/components/ui/badge';
import { useAddToWishListAndRemoveMutation, useGetWishListByUserQuery } from '@/store/api/wishlistApi';
import { CheckCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { toast } from 'sonner';

const Wishlist = () => {
  const router = useRouter()
  const [AddToWishListAndRemove, { data: wishListData, isLoading: wishListIsLoading, isError: wishListIError, error: wislistError, isSuccess: wishistIsSuccess }] = useAddToWishListAndRemoveMutation()
  const { data: wishlist, refetch  ,isLoading} = useGetWishListByUserQuery({})

  const onClickWishListHander = async (productId: string) => {
    await AddToWishListAndRemove(productId)
    refetch()
  }


  useEffect(() => {
    if (wishistIsSuccess && wishListData) {
      toast.success(wishListData.message)
    }
  }, [wishistIsSuccess])

  const inCart = true

  if(isLoading){
    return <SpinningLoader />
  }

  return (
    <div className="w-[90%] mx-auto mt-6 mb-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <ProfileSideBar />

        <div className="flex-1">
          {
            wishlist?.wishlist?.products?.length === 0 ?
              <div className='w-full h-full flex justify-center items-center text-center'>
                <div className='w-[50%] flex justify-center items-center flex-col gap-4'>
                  <Image src={"/images/wishlist.webp"} alt='' className=' rounded-xs ' width={250} height={100} />
                  <h1 className='text-3xl font-semibold'>Your wishlist is empty.</h1>
                  <p className='text-gray-600'>Looks like you haven't added any items to your wishlist yet. Browse our collection and save your favorites!</p>
                  <button className='p-2 pl-20 pr-20 bg-blue-300 rounded-sm text-white'>Browse Books</button>
                </div>
              </div>
              :
              <div>
                {/* Header */}
                <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-xs mb-4">
                  <FaHeart className="text-red-500" size={28} />
                  <h1 className="text-2xl font-semibold text-gray-800">My Wishlist</h1>
                </div>

                {/* Wishlist Items */}
                <div className="h-[75vh] overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {wishlist?.wishlist?.products?.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm hover:shadow-sm transition-all duration-300 p-4 flex flex-col items-start text-start"
                      >
                        <Image
                          onClick={() => router.push(`/books/${item._id}`)}
                          src={item?.images[0]} // Replace with actual src when available
                          alt="Book cover"
                          width={100}
                          height={100}
                          className="rounded-md cursor-pointer mb-3 w-full h-[250px] object-cover"
                        />
                        <h2 className="text-lg text-start line-clamp-1 font-semibold text-gray-800">{item?.title}</h2>
                        <p className="text-gray-600 mb-4 text-start">₹{item?.finalPrice}/-</p>

                        <div className="flex items-center justify-between w-full mt-auto gap-3">
                          <button onClick={() => onClickWishListHander(item._id)} className="p-1 rounded-lg hover:bg-gray-100 transition">
                            <Trash2 size={20} className="text-red-500" />
                          </button>
                          {
                            inCart ?
                              <button className="bg-gray-300 flex items-center justify-center gap-2 text-white p-2 text-xs rounded-lg hover:bg-gray-800 transition">
                                <Badge className='bg-gray-300 text-green-700 font-semibold'><CheckCircle /></Badge> Item In Cart
                              </button>
                              : <button className="bg-black text-white p-2 text-xs rounded-lg hover:bg-gray-800 transition">
                                Add To Cart
                              </button>
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
