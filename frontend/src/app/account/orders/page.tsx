"use client";

import React from "react";
import ProfileSideBar from "@/app/components/ProfileSideBar";
import { Badge } from "@/components/ui/badge";
import { useGetOrderByUserIdQuery } from "@/store/api/orderApi";
import { Calendar, CreditCard, Eye, ShoppingBag } from "lucide-react";
import SpinningLoader from "@/app/components/SpinningLoader";

// --- Type Definitions ---
interface Product {
  _id: string;
  title: string;
  author: string;
  category: string;
}

interface OrderItem {
  productId: Product;
  quantity: number;
}

interface Order {
  _id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}

interface OrderResponse {
  order: Order[];
}

// --- Component ---
const Orders: React.FC = () => {
  const { data  , isLoading} = useGetOrderByUserIdQuery({})

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  if(isLoading){
    return <SpinningLoader />
  }

  return (
    <div className="w-[90%] flex items-start gap-8 mt-8 mb-8 mx-auto">
      <ProfileSideBar />
      <div className="w-full space-y-6">
        {/* Page Header */}
        <div className="bg-gray-800 rounded-md p-6 text-center text-white shadow-md">
          <h1 className="font-semibold text-3xl md:text-4xl lg:text-5xl mb-2">
            My Orders
          </h1>
          <p className="text-lg text-amber-200">
            View and manage your recent purchases
          </p>
        </div>

        {/* Order List */}

        {
          data?.order.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl shadow-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6h6v6m2 4H7a2 2 0 01-2-2V5a2 2 0 012-2h4l2 2h6a2 2 0 012 2v12a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-semibold">No Orders Yet</p>
              <p className="text-sm text-gray-500">You haven’t placed any orders yet. When you do, they’ll show up here!</p>
            </div>
          ) :

            <div className="h-[59vh] overflow-y-scroll pr-2">
              <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-6 grid-cols-1">
                {data?.order?.map((item :any, index: number) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 transition hover:shadow-xl"
                  >
                    {/* Card Header */}
                    <div className="bg-blue-600 px-6 py-4 text-white flex items-center justify-between rounded-t-2xl">
                      <div className="flex items-center gap-3 text-base font-medium">
                        <ShoppingBag className="h-5 w-5" />
                        Order #{item?._id?.slice(0, 6)}
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-white text-blue-600 font-semibold"
                      >
                        {item?.status}
                      </Badge>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4">
                      {/* Items */}
                      <div>
                        <h3 className="text-gray-900 font-semibold text-lg mb-1">
                          Items:
                        </h3>
                        <ul className="list-disc ml-5 text-gray-700 text-sm space-y-1">
                          {item?.items?.map((orderItem : any, i : number) => (
                            <li key={i}>
                              {orderItem?.productId?.title} by{" "}
                              {orderItem?.productId?.author} (
                              {orderItem?.productId?.category})
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Ordered Date */}
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Calendar className="h-4 w-4" />
                        Ordered on: {formatDate(item?.createdAt)}
                      </div>

                      {/* Total Amount */}
                      <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                        Total: ₹{item?.totalAmount}
                      </div>
                    </div>

                    {/* Card Footer */}
                    {/* <div className="bg-green-600 text-white px-4 py-3 rounded-b-2xl text-center hover:bg-green-700 transition cursor-pointer flex items-center justify-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-semibold">View Details</span>
                </div> */}
                  </div>
                ))}
              </div>
            </div>

        }



      </div>
    </div>
  );
};

export default Orders;
