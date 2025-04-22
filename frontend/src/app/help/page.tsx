'use client';
import React from 'react';
import { motion } from 'framer-motion';

const Help = () => {
  return (
    <div className="flex items-center bg-gray-500 justify-center h-screen p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white/85 text-center shadow-xl rounded-2xl p-10 max-w-md w-full"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Hire Me</h1>
        <p className="text-gray-600 text-lg mb-6">
          Looking for a passionate and skilled developer? Let's work together!
        </p>
        <div className="text-2xl font-semibold text-indigo-600 mb-4">
          📞 +91 9794603102
        </div>
        <a
          href="tel:+919794603102"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-full transition-all duration-300"
        >
          Call Now
        </a>
      </motion.div>
    </div>
  );
};

export default Help;
