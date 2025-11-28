// src/components/PermissionBanner.jsx
import React from "react";
import { WifiOff } from "lucide-react";

export default function PermissionBanner({ visible }) {
  if (!visible) return null;
  return (
    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 m-6 rounded shadow-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <WifiOff className="h-6 w-6 text-orange-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-orange-800">Modo Local Activado</h3>
          <div className="mt-2 text-sm text-orange-700">
            <p>Firebase no permite conexión. La app usará datos locales.</p>
            <p className="mt-1"><strong>Revisa en Firebase:</strong> Authentication → Habilitar Anónimo / Firestore → Reglas de lectura/escritura.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
