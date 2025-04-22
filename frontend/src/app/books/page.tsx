"use client"
import { useSelector } from "react-redux"
import AllBooks from "../components/AllBooks"
import ErrorMessage from "../components/ErrorMessage"
import FilterSideBar from "../components/FilterSideBar"

const Books = () => {
    const { errorMessage } = useSelector((store: any) => store.auth)
    return (
        <div className="w-[95%] mx-auto">

            {
                errorMessage ? <ErrorMessage /> : <></>
            }

            <p className="w-full p-3 mt-2 mb-4 border  bg-gray-50 shadow cursor-pointer">Home/ <span className="text-gray-600 cursor-not-allowed">books</span></p>
            <p className="text-4xl mb-4" >Find from over 1000s of used books online</p>
            <div className="flex lg:flex-row flex-col gap-4 ">
                <FilterSideBar />
                <AllBooks />
            </div>
        </div>
    )
}

export default Books