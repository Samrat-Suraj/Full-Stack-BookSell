import { CreditCard, Search, Truck } from "lucide-react";

const buySteps = [
  {
    step: "Step 1",
    title: "Browse & Choose Your Books",
    description: "Explore thousands of pre-loved books available on BookKart and pick your favorites.",
    icon: <Search className="h-10 w-10 text-white" />,
  },
  {
    step: "Step 2",
    title: "Secure Your Order",
    description:
      "Click 'Buy Now' and complete the payment process securely to place your order.",
    icon: <CreditCard className="h-10 w-10 text-white" />,
  },
  {
    step: "Step 3",
    title: "Get Books Delivered to You",
    description: "Sit back and relax while your books are safely delivered to your doorstep!",
    icon: <Truck className="h-10 w-10 text-white" />,
  },
];

const HowToBuy = () => {
  return (
    <div className="w-full flex items-center justify-center bg-gray-100 py-16">
      <div className="w-[90%] text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Buy Used Books on BookKart in 3 Simple Steps
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Save money and discover great reads by purchasing second-hand books with ease.
        </p>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {buySteps.map((item, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center bg-gray-300 shadow-sm rounded-lg p-6 hover:shadow-md transition-all border border-gray-200"
            >
              <div className="mb-4">{item.icon}</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h2>
              <p className="text-black text-sm">{item.description}</p>
              <span className="absolute top-3 left-3 bg-white text-black text-sm px-3 py-1 rounded-md">
                {item.step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowToBuy;
