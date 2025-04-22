export interface BookDetails {
    _id: string;
    title: string;
    images: string[];
    subject: string;
    category: string;
    condition: string;
    classType: string;
    price: number;
    author: string;
    edition?: string;
    description?: string;
    finalPrice: number;
    shippingCharge: number;
    seller: UserData;
    paymentMode: "UPI" | "Bank Account";
    paymentDetails: {
        upiId?: string;
        bankDetails?: {
            accountNumber: string;
            ifscCode: string;
            bankName: string;
        };
    };
    createdAt: Date;
}

export interface UserData {
    name: string;
    email: string;
    password?: string;
    profilePicture?: string;
    phoneNumber?: string;
    address: Address[]
}

export interface Address {
    _id: string;
    addressLine1: string;
    addressLine2?: string;
    phoneNumber: string;
    city: string;
    state: string;
    pincode: string;
}

export interface Product {
    _id: string;
    title: string;
    images: string[];
    price: number;
    finalPrice: number;
    shippingCharge: number;
}

export interface CartItem {
    _id: string;
    product: Product;
    quantity: number;
}


export interface OrderItem {
    product: BookDetails;
    quantity: number;
}

export interface PaymentDetails {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export interface Order {
    _id: string;
    user: UserData;
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: Address;
    paymentStatus: "pending" | "success" | "complete";
    paymentMethod: string;
    paymentDetails: PaymentDetails;
    status: string;
    createdAt: Date;
}