import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images : {
    domains: ['images.unsplash.com' , "plus.unsplash.com" , "lh3.googleusercontent.com" ,"res.cloudinary.com"],
  }
};

export default nextConfig;
