// src/components/Login.jsx
import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) return alert("Ingresa tu correo");
    setLoading(true);
    setTimeout(() => {
      const userData = { email, nombre: email.split("@")[0], rol: email.includes("admin") ? "Administrador" : "Analista", estado: "Activo" };
      onLogin(userData);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FF5722]">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md z-10 relative">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-[#FF5722] tracking-tighter mb-2">nuam</h1>
          <p className="text-gray-500 text-sm">Exchange | Santiago · Lima · Colombia</p>
          <h2 className="text-xl font-semibold text-gray-800 mt-4">Acceso Corporativo</h2>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF5722] outline-none" placeholder="usuario@nuam.com" required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#FF5722] hover:bg-[#F4511E] text-white font-bold py-3 rounded-lg shadow-md">{loading ? "Verificando..." : "Entrar"}</button>
        </div>
      </form>
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white transform skew-y-3 origin-bottom-left z-0"></div>
    </div>
  );
}
