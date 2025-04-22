'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    document.title = '404 - Page Not Found';
  }, []);

  return (
    <div className="dark:bg-gray-900 flex flex-col items-center justify-center h-screen text-center p-6 md:p-8 lg:p-10">
      <div className="bg-white dark:bg-gray-800 rounded-lg  p-8 md:p-12 max-w-md w-full">
        <h1 className="text-6xl font-extrabold text-indigo-600 dark:text-indigo-500 mb-6 animate-bounce">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We're sorry, but the page you requested could not be found.
        </p>
        <Link
          href="/"
          className="bg-indigo-500 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Go back to Home
        </Link>
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Or perhaps you can <Link href="/sitemap.xml" className="text-blue-500 hover:underline">check our sitemap</Link>?
        </div>
      </div>
    </div>
  );
}