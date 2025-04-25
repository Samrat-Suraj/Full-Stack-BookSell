/** @type {import ("next").NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  eslint : {
    ignoreDuringBuilds : true,
  },
  images : {
    domains: ['images.unsplash.com' , "plus.unsplash.com" , "lh3.googleusercontent.com" ,"res.cloudinary.com"],
  }
};

export default nextConfig;
