import React from "react";

interface PaginationProps {
    currentPage: number;
    pageChangeHandler: (page: number) => void;
    totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, pageChangeHandler, totalPages }) => {

    const nextPageHandler = () => {
        if (currentPage < totalPages) {
            pageChangeHandler(currentPage + 1);
        }
    };

    const prevPageHandler = () => {
        if (currentPage > 1) {
            pageChangeHandler(currentPage - 1);
        }
    };

    return (
        <div className="flex items-center justify-between mt-5 w-full">
            <button
                onClick={prevPageHandler}
                aria-label="Previous Page"
                className={`pl-6 pr-6 rounded-xs p-2 ${currentPage === 1 ? "bg-gray-200" : "bg-blue-500 cursor-pointer"} text-white font-semibold`}
                disabled={currentPage === 1}
            >
                Prev
            </button>

            {
                totalPages && (
                    <div className="flex gap-2">
                        {[...Array(totalPages)]?.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => pageChangeHandler(index + 1)}
                                className={`p-2 w-[50px] transition-all duration-1000 rounded-xs font-semibold text-white ${currentPage === index + 1 ? 'bg-blue-800' : 'bg-blue-600 cursor-pointer'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                )
            }


            <button
                onClick={nextPageHandler}
                aria-label="Next Page"
                className={`pl-6 rounded-xs pr-6 p-2 ${currentPage == totalPages ? "bg-gray-200" : "bg-blue-500 cursor-pointer"} text-white font-semibold`}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
