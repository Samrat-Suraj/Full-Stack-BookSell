import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useCreateUpdateAddressByUserIdMutation, useGetAddressByUserIdQuery } from "@/store/api/addressApi"
import { ChangeEvent, useEffect, useState } from "react"
import { toast } from "sonner"

const AddAddressDialog = () => {
    const [open, setOpen] = useState(false)
    const [CreateUpdateAddressByUserId, { data: CreateUpdateAddressByUserIdData, isLoading: CreateUpdateAddressByUserIdIsLoading, isSuccess: CreateUpdateAddressByUserIdIsSuccess, error, isError }] = useCreateUpdateAddressByUserIdMutation()
    const {refetch} = useGetAddressByUserIdQuery({})
    const [inputData, setInputData] = useState({
        addressLine1: "",
        addressLine2: "",
        phoneNumber: "",
        city: "",
        state: "",
        pincode: "",
    })

    const onChangeHander = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value })
    }

    const addAddressHander = async () => {
        await CreateUpdateAddressByUserId(inputData)
    }

    useEffect(() => {
        if (CreateUpdateAddressByUserIdIsSuccess) {
            setOpen(false)
            refetch()
            setInputData({
                addressLine1: "",
                addressLine2: "",
                phoneNumber: "",
                city: "",
                state: "",
                pincode: "",
            })
            toast.success(CreateUpdateAddressByUserIdData.message)
        }
        if (error && 'data' in error) {
            toast.error((error.data as { message: string }).message)
        }
    }, [CreateUpdateAddressByUserIdIsSuccess, error])

    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger className="cursor-pointer">
                Add New Address
            </DialogTrigger>
            <DialogContent className="w-[6vw] flex justify-start items-start text-start min-w-sm">
                <DialogHeader>
                    <DialogTitle>Add Address</DialogTitle>
                    <div className="w-full text-sm text-start flex flex-col gap-4">
                        <div className="flex flex-col">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                placeholder="e.g. +91 9876543210"
                                className="p-2 rounded-sm border-2"
                                type="text"
                                id="phone"
                                name="phoneNumber"
                                value={inputData.phoneNumber}
                                onChange={onChangeHander}
                            />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="address1">Address Line 1</label>
                            <textarea
                                placeholder="e.g. House No. 123, Main Street"
                                className="p-2 border-2 rounded-sm resize-none"
                                id="address1"
                                name="addressLine1"
                                value={inputData.addressLine1}
                                onChange={onChangeHander}
                            ></textarea>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="address2">Address Line 2 (Optional)</label>
                            <textarea
                                placeholder="e.g. Landmark, Apartment Name"
                                className="p-2 border-2 rounded-sm resize-none"
                                id="address2"
                                name="addressLine2"
                                value={inputData.addressLine2}
                                onChange={onChangeHander}
                            ></textarea>
                        </div>
                        <div className="flex w-full gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="city">City</label>
                                <input
                                    placeholder="e.g. New Delhi"
                                    className="p-2 w-full rounded-sm border-2"
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={inputData.city}
                                    onChange={onChangeHander}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="state">State</label>
                                <input
                                    placeholder="e.g. Delhi"
                                    className="p-2 w-full rounded-sm border-2"
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={inputData.state}
                                    onChange={onChangeHander}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="pincode">Pincode</label>
                            <input
                                placeholder="e.g. 110001"
                                className="p-2 rounded-sm border-2"
                                type="text"
                                id="pincode"
                                name="pincode"
                                value={inputData.pincode}
                                onChange={onChangeHander}
                            />
                        </div>
                    </div>
                    <button onClick={addAddressHander} className="w-full rounded-sm text-sm cursor-pointer mt-4 p-2 bg-black text-white"> {CreateUpdateAddressByUserIdIsLoading ?"Addd...." : "Add Address"} </button>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default AddAddressDialog
