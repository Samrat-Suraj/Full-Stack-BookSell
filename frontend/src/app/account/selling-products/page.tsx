"use client"
import ProfileSideBar from '@/app/components/ProfileSideBar';
import SpinningLoader from '@/app/components/SpinningLoader';
import { useDeleteProductByIdMutation, useGetAllProductQuery, useGetProductBySellerIdQuery } from '@/store/api/productApi';
import { Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const SellingProducts = () => {
  const router = useRouter()
  const { refetch: allProductRefetch } = useGetAllProductQuery({})
  const { user } = useSelector((store: any) => store.auth)
  const { data, isLoading, refetch } = useGetProductBySellerIdQuery(user?._id)
  const [DeleteProductById, { data: deleteData, isLoading: deleteIsLoading, isSuccess }] = useDeleteProductByIdMutation()

  const onClickDeleteProduct = async (id: string) => {
    await DeleteProductById(id)
  }

  useEffect(() => {
    if ((deleteData && isSuccess)) {
      refetch()
      allProductRefetch()
      toast.success(deleteData?.message)
    }

  }, [deleteData, deleteIsLoading, isSuccess])

  if (isLoading) {
    return <SpinningLoader />
  }

  return (
    <div className='w-[90%] flex items-start gap-8 mt-8 mb-8 mx-auto'>
      <ProfileSideBar />
      <div className='w-full space-y-6'>
        <div className='bg-green-100 rounded-xl p-6 text-center text-gray-700 shadow-md border border-green-200'>
          <h1 className='font-bold text-3xl md:text-4xl lg:text-5xl mb-3 text-green-600'>
            Your Listed Books
          </h1>
          <p className='text-lg text-gray-600'>
            Manage and track your book listings with ease.
          </p>
        </div>

        {
          data?.product?.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl shadow-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2h-3.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0011.586 2H8a2 2 0 00-2 2v6M5 13h14l-1.5 6h-11L5 13z" />
              </svg>
              <p className="text-lg font-semibold">No Products Listed</p>
              <p className="text-sm text-gray-500">You haven’t added any products for sale yet. Start listing your books to reach more buyers!</p>
            </div>
          ) :

            <div className='h-[59vh] overflow-y-auto rounded-xl  bg-gray-50 border border-gray-200'>
              <div className='grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6 p-4'>
                {data?.product?.map((item: any, index: number) => (
                  <div
                    // onClick={() => router.push(`/books/${item?._id}`)}
                    key={index}
                    className='bg-white cursor-pointer rounded-2xl border border-gray-200 shadow hover:shadow-lg transition-shadow duration-300 flex flex-col overflow-hidden'
                  >
                    {/* Header */}
                    <div className='bg-blue-600 p-4 text-white'>
                      <h2 className='font-semibold text-lg truncate'>{item?.title}</h2>
                      <p className='text-sm text-blue-100 truncate'>Subject: {item?.subject}</p>
                    </div>

                    {/* Image + Info */}
                    <div className='p-4 flex flex-col gap-3'>
                      <p className='text-gray-700 text-sm line-clamp-1 italic'>{item?.category}</p>

                      <div className='relative w-full h-40 rounded-md overflow-hidden'>
                        <Image
                          src={item?.images?.[0]}
                          alt='book image'
                          fill
                          className='object-cover hover:scale-105 transition-transform duration-300'
                        />
                      </div>

                      <div className='flex justify-between items-center mt-2'>
                        <p className='text-lg font-bold text-green-600'>₹{item?.finalPrice}</p>
                        <p className='text-sm text-gray-500 line-through'>₹{item?.price}</p>
                      </div>
                    </div>

                    {/* Footer - Delete Button */}
                    <button
                      onClick={() => onClickDeleteProduct(item?._id)}
                      className='bg-red-500 cursor-pointer text-white p-3 text-center hover:bg-red-600 transition-colors flex items-center justify-center gap-2 rounded-b-2xl focus:outline-none focus:ring-2 focus:ring-red-300'
                      role='button'
                      aria-label='Delete book listing'
                    >
                      {
                        deleteIsLoading ? <Loader2 className='animate-spin w-4 h-4' /> :
                          <div className='flex items-center gap-3' >
                            <Trash2 size={18} />
                            <span className='font-semibold text-sm'>Delete</span>
                          </div>
                      }
                    </button>
                  </div>
                ))}
              </div>
            </div>

        }
      </div>
    </div>
  );
};

export default SellingProducts;
