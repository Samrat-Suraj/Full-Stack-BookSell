"use client"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { filters } from "@/lib/constant"
import { setFilterData } from "@/store/slice/filterAndSearchSlice"
import { ChangeEvent, useEffect, useState } from "react"
import { useDispatch } from "react-redux"

const FilterSideBar = () => {
    const dispatch = useDispatch()
    const [text, setText] = useState<string[]>([])

    const handerOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (e.target.checked) {
            setText((prev) => [...prev, value])
        } else {
            setText((prev) => prev.filter((item) => item !== value))
        }
    };

    useEffect(() => {
        dispatch(setFilterData(text))
    },[text])

    return (
        <div className="lg:w-[300px] w-full p-4 bg-white shadow-md rounded-md space-y-4">

            <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border rounded-md shadow-sm">
                    <AccordionTrigger className="bg-gray-100 px-4 py-2 cursor-pointer hover:bg-gray-200 transition duration-200">
                        Category
                    </AccordionTrigger>
                    <AccordionContent className="p-4 space-y-2">
                        {
                            filters.category.map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <input type="checkbox" onChange={handerOnChange} id={`category-${index}`} value={item} className="h-4 w-4 text-blue-500 border-gray-300 rounded" />
                                    <label htmlFor={`category-${index}`} className="text-gray-700">{item}</label>
                                </div>
                            ))
                        }
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
                <AccordionItem value="item-2" className="border rounded-md shadow-sm">
                    <AccordionTrigger className="bg-gray-100 px-4 py-2 cursor-pointer hover:bg-gray-200 transition duration-200">
                        Class Type
                    </AccordionTrigger>
                    <AccordionContent className="p-4 space-y-2">
                        {
                            filters.classType.map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <input type="checkbox" onChange={handerOnChange} id={`classType-${index}`} value={item} className="h-4 w-4 text-blue-500 border-gray-300 rounded" />
                                    <label htmlFor={`classType-${index}`} className="text-gray-700">{item}</label>
                                </div>
                            ))
                        }
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Accordion type="single" collapsible>
                <AccordionItem value="item-3" className="border rounded-md shadow-sm">
                    <AccordionTrigger className="bg-gray-100 px-4 py-2 cursor-pointer hover:bg-gray-200 transition duration-200">
                        Condition
                    </AccordionTrigger>
                    <AccordionContent className="p-4 space-y-2">
                        {
                            filters.condition.map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <input type="checkbox" onChange={handerOnChange} id={`condition-${index}`} value={item} className="h-4 w-4 text-blue-500 border-gray-300 rounded" />
                                    <label htmlFor={`condition-${index}`} className="text-gray-700">{item}</label>
                                </div>
                            ))
                        }
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

        </div>
    )
}

export default FilterSideBar
