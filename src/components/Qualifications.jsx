// src/components/Qualifications.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export default function Qualifications({ user, isLocalMode }) {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ emisor: "", rut: "" });
  const seed = [
    { id: "local-1", emisor: "Banco Santander", rut: "97.036.000-K", fecha: "2025-10-20", estado: "Aprobado", analista: "Safka C." },
    { id: "local-2", emisor: "Falabella SA", rut: "77.261.280-K", fecha: "2025-10-21", estado: "En Revisión", analista: "Stephany C." }
  ];

  const load = async () => {
    try {
      if (!db || isLocalMode) throw new Error("Modo local");
      const q = query(collection(db, "calificaciones"));
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setData(list.length ? list : seed);
    } catch (e) {
      setData(seed);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!form.emisor || !form.rut) return alert("Completa los campos");
    const newItem = { ...form, fecha: new Date().toISOString().split("T")[0], estado: "En Revisión", analista: user.nombre || user.email };
    try {
      if (!isLocalMode && db) await addDoc(collection(db, "calificaciones"), newItem);
      setData(prev => [...prev, { ...newItem, id: Date.now().toString() }]);
      setForm({ emisor: "", rut: "" });
    } catch (e) {
      setData(prev => [...prev, { ...newItem, id: Date.now().toString() }]);
      setForm({ emisor: "", rut: "" });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Eliminar?")) return;
    try {
      if (!isLocalMode && db) await deleteDoc(doc(db, "calificaciones", id));
      setData(prev => prev.filter(i => i.id !== id));
    } catch (e) {
      setData(prev => prev.filter(i => i.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Calificaciones</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-4 flex gap-3">
          <input className="border p-2 rounded flex-1" placeholder="Emisor" value={form.emisor} onChange={e => setForm({ ...form, emisor: e.target.value })} />
          <input className="border p-2 rounded w-48" placeholder="RUT" value={form.rut} onChange={e => setForm({ ...form, rut: e.target.value })} />
          <button onClick={handleAdd} className="bg-[#FF5722] text-white px-4 py-2 rounded">Agregar</button>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
            <tr><th className="p-3">Emisor</th><th className="p-3">RUT</th><th className="p-3">Fecha</th><th className="p-3">Estado</th><th className="p-3">Analista</th><th className="p-3 text-right">Acciones</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {data.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-3 font-medium">{item.emisor}</td>
                <td className="p-3 text-gray-500 font-mono">{item.rut}</td>
                <td className="p-3 text-gray-500">{item.fecha}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${item.estado === 'Aprobado' ? 'bg-green-100 text-green-700' : item.estado === 'Rechazado' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{item.estado}</span></td>
                <td className="p-3 text-gray-600">{item.analista}</td>
                <td className="p-3 text-right"><button onClick={() => handleDelete(item.id)} className="text-red-500">Eliminar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
