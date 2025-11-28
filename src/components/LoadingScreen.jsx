// src/components/LoadingScreen.jsx
import React from "react";

export default function LoadingScreen({ message = "Cargando..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4 animate-spin rounded-full h-10 w-10 border-4 border-t-[#FF5722] border-gray-200"></div>
        <div className="text-[#FF5722] font-semibold">{message}</div>
      </div>
    </div>
  );
}
