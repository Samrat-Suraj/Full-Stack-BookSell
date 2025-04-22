"use client"
import store from '@/store/store';
import React from 'react';
import { Provider } from 'react-redux';
import { Toaster } from "@/components/ui/sonner"
import SpinningLoader from './SpinningLoader';
import { useLoaderUserQuery } from '@/store/api/userApi';
import { useGetAllProductQuery } from '@/store/api/productApi';

const Custom = ({ children }: { children: React.ReactNode }) => {
    const { isLoading } = useLoaderUserQuery({})
    const { isLoading : productIsLoading } = useGetAllProductQuery({})
    if (isLoading && productIsLoading) {
        return (
            <SpinningLoader />
        )
    }
    return <>{children}</>
}

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store} >
            <Custom>
                <Toaster />
                {children}
            </Custom>
        </Provider>
    );
};

export default LayoutWrapper;
