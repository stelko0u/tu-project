import React from "react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500 animate-bounce">404</h1>
        <p className="mt-4 text-xl text-gray-700">Page Not Found</p>
      </div>
    </div>
  );
}
