import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-md w-full">
        <h1 className="text-7xl font-extrabold text-red-500 mb-4 animate-bounce">404</h1>
        <p className="text-2xl font-semibold text-blue-700 mb-2">Oops! Page Not Found</p>
        <p className="mb-6 text-gray-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="bg-[#168f7a] hover:bg-[#0b2a26] text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all duration-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}