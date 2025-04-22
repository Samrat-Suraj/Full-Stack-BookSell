import { Loader } from "lucide-react";
import { FC } from "react";
import { motion } from "framer-motion";

const SpinningLoader: FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="h-screen flex flex-col w-screen justify-center items-center bg-gray-900 text-white"
    >
      <Loader className="h-32 w-32 animate-spin text-green-400 drop-shadow-lg" />
      <motion.p 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3, duration: 0.5 }} 
        className="mt-4 text-xl font-semibold bg-gradient-to-r from-green-400 to-teal-300 text-transparent bg-clip-text"
      >
        Loading Books...
      </motion.p>
      <motion.p 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.6, duration: 0.5 }} 
        className="text-gray-400"
      >
        Your next favorite read is on its way!
      </motion.p>
    </motion.div>
  );
};

export default SpinningLoader;
