"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import holiImage from "../../../public/images/holi.jpg";
import { ArrowLeft, ArrowRight, CircleCheck, Star } from "lucide-react";

const OurHappyCustomer = () => {
    const [currentBookSlide, setCurrentBookSlide] = useState(1);
    const prevHandler = () => {
        setCurrentBookSlide((prev) => (prev - 1 + 4) % 4);
    };

    const nextHandler = () => {
        setCurrentBookSlide((prev) => (prev + 1) % 4);
    };

    const ratings = [4, 5, 3, 4]; 

    return (
        <div className="mt-4 lg:w-[95%] w-[95%] mb-8 mx-auto">
            <h1 className="text-5xl font-semibold mt-9 mb-5 text-gray-800">
                OUR HAPPY CUSTOMERS
            </h1>

            <div className="flex justify-end items-center gap-4 mb-2">
                <ArrowLeft
                    size={30}
                    onClick={prevHandler}
                    className="text-black p-2 cursor-pointer transform transition-transform duration-300 hover:scale-110"
                />
                <ArrowRight
                    size={30}
                    onClick={nextHandler}
                    className="text-black p-2 cursor-pointer transform transition-transform duration-300 hover:scale-110"
                />
            </div>

            <div className="overflow-hidden relative">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentBookSlide * 100}%)` }}
                >
                    {[1, 2, 3, 4].map((_, index) => (
                        <div key={index} className="flex-none w-full">
                            <div className="grid lg:grid-cols-4 gap-6 md:grid-cols-3 grid-cols-1 p-4">
                                {[1, 2, 3, 4, 1, 2, 3, 4].slice(0, 4).map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="border p-4 bg-white rounded-lg shadow-md hover:shadow-xl transform transition-transform duration-300 hover:scale-105"
                                    >
                                        <h1 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                                            Suraj Maurya{" "}
                                            <span>
                                                <CircleCheck className="text-green-500" size={20} />
                                            </span>
                                        </h1>
                                        
                                        <div className="flex items-center gap-1 mt-1">
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`text-yellow-400 ${
                                                        i < ratings[idx] ? "fill-current" : "text-gray-300"
                                                    }`}
                                                    size={18}
                                                />
                                            ))}
                                        </div>

                                        <p className="text-sm text-gray-500 mt-2">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed
                                            molestiae, tenetur commodi enim voluptatem ratione corporis rerum,
                                            iste officiis ea optio, incidunt inventore.
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OurHappyCustomer;
