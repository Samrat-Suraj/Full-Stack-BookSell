'use client';

import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useGetOrderByIdQuery } from '@/store/api/orderApi';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const PaymentSuccess = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const {
    data: ordersData,
    isLoading,
    isSuccess,
  } = useGetOrderByIdQuery(orderId);

  useEffect(() => {
    if (canvasRef.current) {
      const myConfetti = confetti.create(canvasRef.current, {
        resize: true,
        useWorker: true,
      });

      myConfetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
      });
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading order details...</p>
      </div>
    );
  }

  if (!ordersData?.order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">Order not found!</p>
      </div>
    );
  }

  const order = ordersData?.order;
  const item = order?.items[0]?.productId;
  const quantity = order?.items[0]?.quantity;

  return (
    <div className="flex flex-col p-9 items-center justify-center min-h-screen bg-green-50 relative overflow-hidden px-4">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />

      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-2xl w-full text-center z-10 space-y-6">
        <h1 className="text-3xl font-bold text-green-600">🎉 Payment Successful!</h1>
        <p className="text-gray-600">Thank you <span className="font-medium">{order?.user?.name}</span> for your purchase.</p>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-left">
          <Image
            src={item?.images[0]}
            alt={item?.title}
            width={120}
            height={160}
            className="rounded-lg shadow-md"
          />

          <div className="space-y-1 text-sm">
            <p><span className="font-semibold">Title:</span> {item?.title}</p>
            <p><span className="font-semibold">Author:</span> {item?.author}</p>
            <p><span className="font-semibold">Category:</span> {item?.category}</p>
            <p><span className="font-semibold">Quantity:</span> {quantity}</p>
            <p><span className="font-semibold">Price (Each):</span> ₹{item?.price}</p>
            <p><span className="font-semibold">Total Amount:</span> ₹{order?.totalAmount}</p>
            <p><span className="font-semibold">Payment ID:</span> {order?.paymentDetails?.razorpay_payment_id}</p>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg text-sm text-left">
          <h2 className="font-semibold mb-2 text-base">📦 Shipping Address</h2>
          <p>{order?.shippingAddress?.addressLine1}</p>
          <p>{order?.shippingAddress?.city}, {order?.shippingAddress?.state} - {order?.shippingAddress?.pincode}</p>
          <p><span className="font-semibold">Phone:</span> {order?.shippingAddress?.phoneNumber}</p>
          <p><span className="font-semibold">Email:</span> {order?.user?.email}</p>
        </div>

        <Link href="/" className="inline-block">
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition">
            Go to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
