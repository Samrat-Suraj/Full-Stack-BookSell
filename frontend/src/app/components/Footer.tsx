import {
    Clock,
    Facebook,
    Headset,
    Instagram,
    Shield,
    Twitter,
    YoutubeIcon,
} from "lucide-react";
import Image from "next/image";

import paytm from "../../../public/icons/paytm.svg";
import rupay from "../../../public/icons/rupay.svg";
import upi from "../../../public/icons/upi.svg";
import visa from "../../../public/icons/visa.svg";

const Footer = () => {
    const iconColor = "text-blue-400";
    const hoverColor = "hover:text-blue-300";

    return (
        <footer className="bg-gray-100 text-black py-12">
            <div className="container mx-auto px-6">
                {/* Top Section */}
                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8 text-gray-300">
                    <div>
                        <h2 className="mb-4 text-black">ABOUT</h2>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="hover:text-gray-400 cursor-pointer transition">About Us</li>
                            <li className="hover:text-gray-400 cursor-pointer transition">Contact Us</li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-black mb-4">USEFUL LINKS</h2>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="hover:text-gray-400 cursor-pointer transition">How it works?</li>
                            <li className="hover:text-gray-400 cursor-pointer transition">Blogs</li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-black mb-4">POLICIES</h2>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="hover:text-gray-400 cursor-pointer transition">Terms of Use</li>
                            <li className="hover:text-gray-400 cursor-pointer transition">Privacy Policy</li>
                        </ul>
                    </div>
                    <div className="">
                        <h2 className="text-3xl text-black mb-4">BookSell.In</h2>
                        <p className="text-sm leading-6 text-gray-700">
                            BookSell.In is a free platform where you can buy second-hand books at
                            very cheap prices. Buy used books.
                        </p>
                    </div>
                </div>

                {/* Social Media Icons */}
                <div className="flex items-center space-x-5 mt-8">
                    {[
                        { Icon: Facebook, link: "#" },
                        { Icon: Instagram, link: "#" },
                        { Icon: Twitter, link: "#" },
                        { Icon: YoutubeIcon, link: "#" },
                    ].map(({ Icon, link }, index) => (
                        <a
                            key={index}
                            href={link}
                            className={`p-2 rounded-full bg-gray-200 hover:bg-gray-600 transition duration-300`}
                        >
                            <Icon size={24} className={`${iconColor} ${hoverColor}`} />
                        </a>
                    ))}
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    {[
                        {
                            Icon: Shield,
                            title: "Secure Payment",
                            description: "100% Secure Online Transaction",
                        },
                        {
                            Icon: Clock,
                            title: "24/7 Support",
                            description: "Always here to help you",
                        },
                        {
                            Icon: Headset,
                            title: "Customer Service",
                            description: "Dedicated customer support",
                        },
                    ].map(({ Icon, title, description }, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 p-4 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300/95 transition"
                        >
                            <Icon size={32} className={`${iconColor} ${hoverColor}`} />
                            <div>
                                <h3 className="text-md text-black">{title}</h3>
                                <p className="text-sm text-gray-400">{description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <hr className="border-gray-700 my-8" />

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} BookCafe. All rights reserved.</p>
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <Image src={paytm} width={40} height={40} alt="paytm" />
                        <Image src={visa} width={40} height={40} alt="visa" />
                        <Image src={upi} width={40} height={40} alt="upi" />
                        <Image src={rupay} width={40} height={40} alt="rupay" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
