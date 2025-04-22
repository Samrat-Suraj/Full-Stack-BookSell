"use client"
import Link from "next/link";
import Hero from "./components/Hero";
import NewArrivals from "./components/NewArrivals";
import OurHappyCustomer from "./components/OurHappyCustomer";
import TopBooks from "./components/TopBooks";
import HowToSell from "./components/HowToSell";
import HowToBuy from "./components/HowToBuy";
import ErrorMessage from "./components/ErrorMessage";
import { useSelector } from "react-redux";

export default function Home() {
  const { errorMessage } = useSelector((store: any) => store.auth)
  return (
    <div className="">
      {
        errorMessage ? <ErrorMessage /> : <></>
      }

      <Hero />
      <NewArrivals />
      <div className="flex items-center justify-center mb-6">
        <Link href={"/books"}>
          <button className="pl-10 cursor-pointer pr-10 rounded-full border-2 p-1 text-sm">View All</button>
        </Link>
      </div>
      <TopBooks />
      <OurHappyCustomer />
      <HowToSell />
      <HowToBuy />
    </div>
  );
}