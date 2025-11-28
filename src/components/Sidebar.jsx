// src/components/Sidebar.jsx
import React from "react";
import { LayoutDashboard, FileText, Users, Shield, LogOut } from "lucide-react";

export default function Sidebar({ user, activeTab, setActiveTab, onLogout }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-20 shadow-sm">
      <div className="p-6 flex items-center justify-center border-b border-gray-100">
        <h1 className="text-3xl font-bold text-[#FF5722]">nuam</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-1 ${activeTab === 'dashboard' ? 'bg-orange-50 text-[#FF5722]' : 'text-gray-600 hover:bg-gray-100'}`}><LayoutDashboard className="w-5 h-5 mr-3" />Dashboard</button>
        <button onClick={() => setActiveTab('qualifications')} className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-1 ${activeTab === 'qualifications' ? 'bg-orange-50 text-[#FF5722]' : 'text-gray-600 hover:bg-gray-100'}`}><FileText className="w-5 h-5 mr-3" />Calificaciones</button>
        {user?.rol === 'Administrador' && <button onClick={() => setActiveTab('users')} className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-1 ${activeTab === 'users' ? 'bg-orange-50 text-[#FF5722]' : 'text-gray-600 hover:bg-gray-100'}`}><Users className="w-5 h-5 mr-3" />Usuarios</button>}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-[#FF5722] text-white flex items-center justify-center font-bold text-sm">{user?.nombre?.charAt(0) ?? user?.email?.charAt(0) ?? "U"}</div>
          <div className="ml-3 overflow-hidden"><p className="text-sm font-medium truncate">{user?.nombre ?? user?.email}</p><p className="text-xs text-gray-500">{user?.rol ?? "Usuario"}</p></div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50"><LogOut className="w-4 h-4 mr-2" /> Salir</button>
      </div>
    </aside>
  );
}
