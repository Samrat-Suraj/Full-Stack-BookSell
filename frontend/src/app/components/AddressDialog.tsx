import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import EditAddressDialog from "./EditAddressDialog";
import AddAddressDialog from "./AddAddressDialog";
import React, { useEffect, useState } from "react";
import { useGetAddressByUserIdQuery } from "@/store/api/addressApi";
import { useDispatch } from "react-redux";
import { setAddress } from "@/store/slice/addressSlice";

interface AddresssProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    handelSelectAddress: (address : any) => void;
}

const AddressDialog: React.FC<AddresssProps> = ({ open, setOpen, handelSelectAddress }) => {
    const dispatch = useDispatch();
    const { data } = useGetAddressByUserIdQuery({});
    const [selectedAddress, setSelectedAddress] = useState<any>(null);

    // When selectedAddress changes, update the Redux store and call handler
    useEffect(() => {
        if (selectedAddress) {
            dispatch(setAddress(selectedAddress))
            handelSelectAddress(selectedAddress);
            setOpen(false);
        }
    }, [selectedAddress]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="p-6 rounded-lg max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">
                        Select or Add Delivery Address
                    </DialogTitle>

                    <div className="grid lg:grid-cols-2 h-[35vh] overflow-y-scroll grid-cols-1 gap-6 mt-6">
                        {data?.address?.map((item: any, index: number) => (
                            <div
                                key={index}
                                className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition bg-gray-50"
                            >
                                <div className="flex justify-between items-start">
                                    <input
                                        type="checkbox"
                                        checked={selectedAddress?._id === item._id}
                                        onChange={() => setSelectedAddress(item)}
                                        className="accent-blue-600 cursor-pointer w-5 h-5"
                                    />

                                    <EditAddressDialog
                                        addressId={item._id}
                                        addressLine1={item?.addressLine1}
                                        addressLine2={item?.addressLine2}
                                        pincode={item?.pincode}
                                        state={item?.state}
                                        city={item?.city}
                                        phoneNumber={item?.phoneNumber}
                                    />
                                </div>

                                <div className="mt-4 text-sm text-start text-gray-700 leading-relaxed">
                                    <p>{item?.addressLine1}</p>
                                    <p>{item?.addressLine2}</p>
                                    <p><strong>Pin Code:</strong> {item?.pincode}</p>
                                    <p><strong>State:</strong> {item?.state}</p>
                                    <p><strong>City:</strong> {item?.city}</p>
                                    <p><strong>Phone:</strong> {item?.phoneNumber}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 cursor-pointer w-full flex items-center justify-center gap-2 text-black shadow py-2 px-4 rounded-md">
                        <Plus size={18} />
                        <AddAddressDialog />
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default AddressDialog;
