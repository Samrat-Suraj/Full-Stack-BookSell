import { BookOpen, ShieldCheck, Users, ShoppingBag, CheckCircle, Globe } from 'lucide-react';
import React from 'react';

const AboutUs = () => {
    const AboutData = [
        { title: "Our Mission", icon: <BookOpen size={32} className="text-blue-600" />, description: "At BookKart, we strive to make reading accessible to everyone by providing a platform where people can easily buy and sell their old books." },
        { title: "Our Community", icon: <Users size={32} className="text-green-600" />, description: "We believe in the power of community. Our platform connects book lovers worldwide, fostering a culture of knowledge sharing." },
        { title: "Our Commitment", icon: <ShieldCheck size={32} className="text-red-600" />, description: "Your safety is our priority. We ensure secure transactions and protect your personal information at all times." }
    ];

    const ChooseData = [
        { title: "Wide Selection", icon: <Globe size={32} className="text-purple-600" />, description: "Thousands of used books available at your fingertips, across various genres and categories." },
        { title: "Easy Listing", icon: <ShoppingBag size={32} className="text-orange-600" />, description: "Selling your old books is now hassle-free with our intuitive listing process." },
        { title: "Secure Transactions", icon: <ShieldCheck size={32} className="text-blue-600" />, description: "Safe payment methods and buyer protection for a seamless experience." },
        { title: "Community Driven", icon: <CheckCircle size={32} className="text-green-600" />, description: "Join a passionate community of readers and sellers who share your love for books." }
    ];

    return (
        <div className="w-[80%] mx-auto p-6 bg-white  mt-6 mb-7 rounded-lg">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">About Us</h1>
            <p className="text-gray-700 text-lg text-center mb-6">Welcome to BookSell.In, your ultimate destination for buying and selling used books online.</p>
            
            <div className="grid md:grid-cols-3 gap-6">
                {AboutData.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg text-center shadow-md hover:shadow-lg transition">
                        <div className="mb-3 flex justify-center">{item.icon}</div>
                        <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
                        <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 text-center">Why Choose BookCafe?</h2>
            <div className="grid md:grid-cols-2 gap-6">
                {ChooseData.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg text-center shadow-md hover:shadow-lg transition">
                        <div className="mb-3 flex justify-center">{item.icon}</div>
                        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                        <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AboutUs;
