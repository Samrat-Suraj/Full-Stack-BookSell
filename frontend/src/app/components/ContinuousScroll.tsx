import { Cinzel } from "next/font/google";

const CinzelFont = Cinzel({
  display: "swap",
  subsets: ["latin"],
  weight: ["700"],
});

const ContinuousScroll = () => {
  const indianBookTitles = [
    "The God of Small Things - Arundhati Roy",
    "Midnight's Children - Salman Rushdie",
    "The White Tiger - Aravind Adiga",
    "Train to Pakistan - Khushwant Singh",
    "The Palace of Illusions - Chitra Banerjee Divakaruni",
    "The Immortals of Meluha - Amish Tripathi",
    "The Kite Runner - Khaled Hosseini",
    "Sacred Games - Vikram Chandra",
    "The Shadow Lines - Amitav Ghosh",
    "The 5th Wave - Rick Yancey",
    "The Great Indian Novel - Shashi Tharoor",
    "The Inheritance of Loss - Kiran Desai",
    "A Suitable Boy - Vikram Seth",
    "The Zoya Factor - Anuja Chauhan",
    "The Secret of the Nagas - Amish Tripathi",
    "The Hindu Mythology - Devdutt Pattanaik",
    "The Battle of Bhima Koregaon - Sambhaji Bhagat",
    "The Guide - R.K. Narayan",
    "The Lowland - Jhumpa Lahiri",
    "The Mango Season - Amulya Malladi",
  ];

  return (
    <div className="h-[10vh] lg:h-[14vh] mt-[1px] w-full bg-black text-white text-3xl items-center flex overflow-hidden">
      <div className={`scrolling-content scrolling ${CinzelFont.className}`}>
        <div className="flex whitespace-nowrap animate-scroll">
          {indianBookTitles.map((title, index) => (
            <div key={index} className="mx-5">
              {title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContinuousScroll;
