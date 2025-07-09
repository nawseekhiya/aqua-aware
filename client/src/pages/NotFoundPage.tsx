import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <AlertTriangle className="h-24 w-24 text-red-600 animate-bounce" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-black dark:text-white">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-medium mb-6 text-gray-700 dark:text-gray-300">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved to another URL.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          <Home className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;