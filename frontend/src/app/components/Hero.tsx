"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Book, ChevronLeft, ChevronRight } from 'lucide-react'
import ContinuousScroll from './ContinuousScroll'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { setErrorMessage } from '@/store/slice/authSlice'
import { useRouter } from 'next/navigation'

const Hero = () => {
    const { user } = useSelector((store: any) => store.auth)
    const dispatch = useDispatch()
    const router = useRouter()

    const onClickHander = () => {
        if (!user) {
            dispatch(setErrorMessage(true))
            return
        } else {
            router.push(`book-sell`)
        }
    }


    const bannerImages = [
        "/images/book1.jpg",
        "/images/book2.jpg",
        "/images/book3.jpg",
        "/images/book4.jpg"
    ]
    const [currentImage, setCurrentImage] = useState(0)
    useEffect(() => {
        const timmer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % bannerImages?.length)
        }, 4000)
        return () => clearInterval(timmer)
    }, [])

    const prevImageHander = () => {
        setCurrentImage((prev) => prev > 1 ? (prev - 1) % bannerImages.length : 0)
    }

    const nextImageHander = () => {
        setCurrentImage((prev) => (prev + 1) % bannerImages.length)
    }

    const onClickSetImageHander = (image: number) => {
        setCurrentImage(image)
    }

    return (
        <div className='w-full'>
            <div className=' h-[600px] relative'>
                {
                    bannerImages?.map((book, index) => {
                        return (
                            <div key={index} className={`${currentImage === index ? "opacity-100" : "opacity-0"} absolute inset-0 transition-opacity duration-1000`}>
                                <Image fill alt='bookimage' src={book} className='object-cover' />
                                <div className=' absolute inset-0 bg-black/50'></div>
                                <div className='absolute top-1/3 w-full flex items-center justify-center text-center flex-col'>
                                    <h1 className='text-white font-semibold lg:text-6xl md:text-4xl text-2xl w-[70%]' >YOUR NEXT READ IS JUST A CLICK AWAY.</h1>
                                    <p className='w-[50%] text-gray-100 mt-4 line-clamp-2'>Explore a world of books with just one click. Dive into new genres, thrilling plots, and stories that stay with you.</p>
                                    <div className='flex gap-3 mt-3'>
                                        {
                                            bannerImages?.map((book, index) => {
                                                return (
                                                    <div onClick={() => onClickSetImageHander(index)} className={`w-2.5 h-2.5 cursor-pointer rounded-full ${index === currentImage ? "bg-green-400" : "bg-white"}`} key={index}></div>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className='flex gap-3 mt-7 items-center justify-center'>
                                        <Link href={"/books"}>
                                            <button className='pl-4 cursor-pointer pr-4 p-3 lg:text-sm text-white bg-black rounded-xs'>Shop Books Now</button>
                                        </Link>

                                        <button onClick={onClickHander} className='pl-4 cursor-pointer pr-4 p-3 lg:text-sm text-white bg-black rounded-xs'>Sell Books Now</button>

                                    </div>
                                    <div className='flex absolute top-1/2 bottom-1/2 justify-between w-[97%]'>
                                        <ChevronLeft onClick={() => prevImageHander()} size={30} className='text-black p-1 cursor-pointer bg-gray-100/45 rounded-full' />
                                        <ChevronRight onClick={() => nextImageHander()} size={30} className='text-black p-1 cursor-pointer bg-gray-100/45 rounded-full' />
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <ContinuousScroll />
        </div>
    )
}

export default Hero