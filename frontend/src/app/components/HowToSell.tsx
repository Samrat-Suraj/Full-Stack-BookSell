import { Camera, Tag, Wallet } from "lucide-react";

const sellSteps = [
  {
    step: "Step 1",
    title: "Create an Ad for Your Used Books",
    description:
      "List your old books on BookKart by providing detailed descriptions and clear images.",
    icon: <Camera className="h-10 w-10 text-blue-600" />,
  },
  {
    step: "Step 2",
    title: "Set a Competitive Price",
    description: "Decide on a fair selling price that attracts buyers while giving you a good deal.",
    icon: <Tag className="h-10 w-10 text-blue-600" />,
  },
  {
    step: "Step 3",
    title: "Receive Payments Securely",
    description:
      "Once your book is sold, get paid directly into your UPI or bank account hassle-free.",
    icon: <Wallet className="h-10 w-10 text-blue-500" />,
  },
];

const HowToSell = () => {
  return (
    <div className="w-full flex items-center mt-9 justify-center bg-gray-100 py-16">
      <div className="w-[90%] text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sell Your Old Books on BookKart in 3 Simple Steps
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Turn your pre-loved books into cash with ease.
        </p>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {sellSteps.map((item, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-all"
            >
              <div className="mb-4">{item.icon}</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h2>
              <p className="text-gray-700 text-sm">{item.description}</p>
              <span className="absolute top-3 left-3 bg-green-600 text-white text-sm px-3 py-1 rounded-md">
                {item.step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowToSell;