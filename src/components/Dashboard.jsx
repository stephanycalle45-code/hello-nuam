// src/components/Dashboard.jsx
import React from "react";

export default function Dashboard({ qualifications }) {
  const total = qualifications.length;
  const approved = qualifications.filter(q => q.estado === "Aprobado").length;
  const review = qualifications.filter(q => q.estado === "En Revisión").length;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Panel de Control (Tiempo Real)</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Registros</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">{total}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Aprobados</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">{approved}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Pendientes</p>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">{review}</h3>
        </div>
      </div>
    </div>
  );
}
