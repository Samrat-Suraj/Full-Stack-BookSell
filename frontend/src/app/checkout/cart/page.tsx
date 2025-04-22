"use client"
import AddressDialog from '@/app/components/AddressDialog'
import SpinningLoader from '@/app/components/SpinningLoader'
import { useGetCartByUserQuery, useRemoveFromCartMutation } from '@/store/api/cartApi'
import { useCreateOrUpdateOrderMutation, useCreatePayMentWithRazorPayMutation, useGetOrderByIdQuery } from '@/store/api/orderApi'
import { setAddress } from '@/store/slice/addressSlice'
import { ChevronRight, CreditCard, LocateIcon, PenBox, ShoppingCart, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

declare global {
    interface Window {
        Razorpay: any
    }
}

const Cart = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const { address } = useSelector((store: any) => store.address)
    const [curr, setCurr] = useState<string>("cart")
    const [open, setOpen] = useState<boolean>(false)

    const { data: cartdata, isLoading: cartIsLoading, isSuccess: cartIsSuccess, refetch } = useGetCartByUserQuery({})
    const [RemoveFromCart, { data: removeData, isLoading: removeIsLoading, isError: removeIsError, isSuccess: removeIsSuccess, error: removeError }] = useRemoveFromCartMutation()

    //Create Or Update Order
    const [createOrUpdateOrder, { data: orderData, isLoading: isOrderLoading, isSuccess: OrderIsSuccess, isError: OrderIsError, error: OrderError }] = useCreateOrUpdateOrderMutation()
    const [orderId, setOrderId] = useState<string>("");
    const { data: ordersData, refetch: orderDataRefatch } = useGetOrderByIdQuery(orderId || "")
    const [createPayMentWithRazorPay] = useCreatePayMentWithRazorPayMutation()


    const totalQuantity = cartdata?.cart?.items?.reduce((sum: number, item: any) => sum + item?.quantity, 0);

    const RemoveFromCartHander = async (productId: string) => {
        await RemoveFromCart(productId)
    }

    useEffect(() => {
        if (removeIsSuccess && removeData) {
            refetch()
            toast.success(removeData?.message)
        }
    }, [removeIsSuccess])

    // Price calculations
    const totalPrice = cartdata?.cart?.items?.reduce((sum: number, item: any) => {
        return sum + item?.productId?.price * item?.quantity;
    }, 0) || 0;

    const totalFinalPrice = cartdata?.cart?.items?.reduce((sum: number, item: any) => {
        return sum + item?.productId?.finalPrice * item?.quantity;
    }, 0) || 0;

    const totalDiscount = totalPrice - totalFinalPrice;
    const totalShipping = cartdata?.cart?.items?.reduce((sum: number, item: any) => {
        return sum + item?.productId?.shippingCharge;
    }, 0) || 0;

    const grandTotal = totalFinalPrice + totalShipping;

    // Proceed to checkout - create order
    const OrderProceedCheckOut = async () => {
        if (curr === "cart") {
            await createOrUpdateOrder({ inputData: { items: cartdata?.cart?.items, totalAmount: grandTotal } });
            orderDataRefatch()
            setCurr("address")
        }
        if (curr === "address") {
            if (address) {
                setCurr("payment")
            } else {
                setOpen(true)
            }
        }
        if (curr === "payment") {
            await handelPayment()
        }
    }
    const handelPayment = async () => {
        if (!orderId) {
            toast.error("No Order Found. Please try again!");
            return;
        }

        try {
            const response = await createPayMentWithRazorPay(orderId).unwrap();
            const razorPayOrder = response?.order;

            if (!razorPayOrder) {
                toast.error("Failed to create Razorpay order.");
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
                amount: razorPayOrder.amount,
                currency: razorPayOrder.currency,
                name: "BookSell.in",
                description: "Books Buy...",
                order_id: razorPayOrder.id,
                handler: async (response: any) => {
                    try {
                        const result = await createOrUpdateOrder({
                            inputData: {
                                orderId,
                                paymentDetails: {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                },
                            },
                        });

                        if (result?.data?.success) {
                            refetch()
                            toast.success("Payment successful!");
                            router.push(`/checkout/payment-success?orderId=${orderId}`);
                        } else {
                            toast.error("Payment was processed, but order update failed.");
                        }
                    } catch (err) {
                        console.error("Error in handler:", err);
                        toast.error("Something went wrong while updating your order.");
                    }
                },
                prefill: {
                    name: "Suraj",
                    email: "customer@example.com",
                    contact: "9999999999",
                },
                notes: {
                    orderId,
                },
                theme: {
                    color: "#3399cc",
                },
            };

            if (typeof window !== "undefined" && window.Razorpay) {
                const razorpay = new window.Razorpay(options);
                razorpay.open();
            } else {
                toast.error("Payment gateway not ready. Please try again.");
            }

        } catch (error) {
            console.error("Error in handelPayment:", error);
            toast.error("Something went wrong while processing payment.");
        }
    };


    const handelSelectAddress = async (address: any) => {
        if (orderData?.order?._id && address) {
            const result = await createOrUpdateOrder({ inputData: { orderId: orderData?.order?._id, shippingAddress: address } });
            if (result?.data?.success) {
                toast.success("Address updated in order successfully!");
                orderDataRefatch();
                setCurr("payment");
            } else {
                toast.error("Failed to update address in order.");
            }
        }
    };
    
    useEffect(() => {
        if (ordersData?.order?.shippingAddress) {
            setCurr("address")
            setOrderId(ordersData?.order?._id)
            dispatch(setAddress(ordersData?.order?.shippingAddress))
        }
    }, [ordersData?.order?._id])


    useEffect(() => {
        if (OrderIsSuccess && orderData) {
            toast.success(orderData?.message)
            setOrderId(orderData?.order?._id)
            orderDataRefatch()
        }
        if (OrderIsError) {
            toast.error("Error To Create Order")
        }
    }, [orderData, isOrderLoading, OrderIsSuccess, OrderIsError, OrderError])

    if (cartIsLoading) {
        return <SpinningLoader />
    }

    if (!cartdata || cartdata?.cart?.items?.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-6 text-gray-600">
                <Image
                    width={100}
                    height={100}
                    src="/mt.png"
                    alt="Empty Cart"
                    className="w-40 h-40 mb-4 opacity-80"
                />
                <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Looks like you haven’t added anything yet.
                </p>
                <a
                    href="/books"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Start Shopping
                </a>
            </div>
        );
    }

    return (
        <>
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                strategy="afterInteractive"
                onLoad={() => console.log("Razorpay script loaded")}
            />



            <div className="w-[90%] mx-auto mt-6 mb-7">
                <h1 className="text-4xl font-bold text-center lg:text-start text-gray-800 mb-4">Your Cart</h1>

                <div className="bg-gray-100 text-gray-700 w-full p-3 rounded-md shadow-sm mb-6">
                    <p className="text-lg">{totalQuantity} item in your cart</p>
                </div>

                <div className='flex lg:gap-4 gap-2 bg-gray-100 rounded-xl p-4 w-full items-center justify-center mt-4 mb-4'>
                    <div className='flex items-center gap-2'>
                        <ShoppingCart className={`p-3 ${curr === "cart" ? "bg-blue-600 text-gray-200" : "bg-gray-300"} rounded-full`} size={45} />
                        <p>Cart</p>
                    </div>
                    <ChevronRight />
                    <div className='flex items-center gap-2'>
                        <LocateIcon className={`p-3 ${curr === "address" ? "bg-blue-600 text-gray-200" : "bg-gray-300"} rounded-full`} size={45} />
                        <p>Address</p>
                    </div>
                    <ChevronRight />
                    <div className='flex items-center gap-2'>
                        <CreditCard className={`p-3 ${curr === "payment" ? "bg-blue-600 text-gray-200" : "bg-gray-300"} rounded-full`} size={45} />
                        <p>Payment</p>
                    </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-6 justify-between">
                    {/* Cart Items */}
                    <div className="w-full md:w-[60%] max-h-[60vh] overflow-y-auto shadow-xs rounded-md p-4 space-y-4 bg-white">
                        {cartdata?.cart?.items?.map((item: any, index: number) => (
                            <div key={index} className="bg-gray-50 flex rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                                <Image
                                    src={item?.productId?.images[0]}
                                    alt="cart-image"
                                    width={120}
                                    height={120}
                                    className="object-cover rounded-sm p-1 h-[120px] w-[100px]"
                                />
                                <div className="flex flex-1 justify-between p-3">
                                    <div>
                                        <h2 className="text-sm font-semibold">{item?.productId?.title}</h2>
                                        <p className="text-sm text-gray-600">Quantity: {item?.quantity}</p>
                                        <p className="text-md font-medium mt-1">₹ {item?.productId?.finalPrice}/-</p>
                                        <p><span className='font-semibold mt-4'>Total Price :</span> ₹ {(item?.quantity) * (item?.productId?.finalPrice)}/-</p>
                                    </div>
                                    <div className="flex flex-col items-end justify-between">
                                        <Trash2 onClick={() => RemoveFromCartHander(item?.productId?._id)} size={20} className="text-red-500 cursor-pointer hover:text-red-700" />
                                        <p className="text-sm text-gray-500">Shipping: ₹ {item?.productId?.shippingCharge}/-</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="w-full md:w-[35%] bg-white shadow-md rounded-md p-4">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-2 text-gray-700">
                            <div className="flex justify-between">
                                <span>Price ({cartdata?.cart?.items?.length} items)</span>
                                <span>₹{totalPrice}</span>
                            </div>
                            <div className="flex text-green-600 justify-between">
                                <span>Discount</span>
                                <span>- ₹{totalDiscount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Charges</span>
                                <span>₹ {totalShipping}</span>
                            </div>
                            <div className="border-t pt-3 mt-3 flex justify-between font-bold text-gray-900">
                                <span>Total Amount</span>
                                <span>₹ {grandTotal}</span>
                            </div>

                            <AddressDialog handelSelectAddress={handelSelectAddress} open={open} setOpen={setOpen} />
                            <button onClick={() => OrderProceedCheckOut()}
                                className="w-full flex justify-center items-center cursor-pointer mt-3 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                                {isOrderLoading ? "Processsing...." : curr === "payment" ? "Continue to Pay" : curr === "cart" ? "Proceed To Checkout" : "Proceed To Payment"}
                            </button>
                            <button className="w-full mt-2 bg-white border-2 py-2 rounded-md text-black transition">Back</button>
                        </div>

                        {address && (
                            <div>
                                <div className="mt-4 text-sm text-start border-3 p-2 rounded-lg relative text-gray-700 leading-relaxed">
                                    <div onClick={() => setOpen(true)} className=' absolute right-1 ' >
                                        <PenBox size={18} className='hover:text-red-500 cursor-pointer' />
                                    </div>
                                    <p className="text-sm">{address?.addressLine1}</p>
                                    <p className="text-sm">{address?.addressLine2}</p>
                                    <p className="text-sm"><strong>Pin Code :</strong> {address?.pincode}</p>
                                    <p className="text-sm"><strong>State :</strong> {address?.state}</p>
                                    <p className="text-sm"><strong>City :</strong> {address?.city}</p>
                                    <p className="text-sm"><strong>Phone:</strong> {address?.phoneNumber}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Cart
