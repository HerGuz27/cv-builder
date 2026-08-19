import React, { useState } from "react";
import { Certification } from "../../../types/cv";

interface CertificationsEditorProps {
  certificaciones: Certification[];
  onChange: (certificaciones: Certification[]) => void;
}

export const CertificationsEditor: React.FC<CertificationsEditorProps> = ({
  certificaciones,
  onChange,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleUpdate = (index: number, field: keyof Certification, value: string) => {
    const updated = [...certificaciones];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddCertification = () => {
    const newCert: Certification = {
      nombre: "Nueva Certificación",
      emisor: "Emisor",
      fecha: new Date().getFullYear().toString(),
      url: "",
    };
    onChange([...certificaciones, newCert]);
    setExpandedIndex(certificaciones.length);
  };

  const handleRemoveCertification = (index: number) => {
    onChange(certificaciones.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {certificaciones.map((cert, index) => (
        <div key={index} className="border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{cert.nombre}</p>
              <p className="text-sm text-gray-600">{cert.emisor}</p>
            </div>
            <svg
              className={`h-5 w-5 text-gray-500 transition-transform ${
                expandedIndex === index ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>

          {expandedIndex === index && (
            <div className="p-4 bg-white border-t border-gray-300 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={cert.nombre}
                  onChange={(e) => handleUpdate(index, "nombre", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emisor</label>
                <input
                  type="text"
                  value={cert.emisor}
                  onChange={(e) => handleUpdate(index, "emisor", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha (YYYY o YYYY-MM)</label>
                  <input
                    type="text"
                    value={cert.fecha}
                    onChange={(e) => handleUpdate(index, "fecha", e.target.value)}
                    placeholder="2023 o 2023-06"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL (opcional)</label>
                  <input
                    type="text"
                    value={cert.url || ""}
                    onChange={(e) => handleUpdate(index, "url", e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={() => handleRemoveCertification(index)}
                className="w-full px-4 py-2 mt-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium text-sm"
              >
                Eliminar Certificación
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleAddCertification}
        className="w-full px-4 py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium text-sm border-2 border-dashed border-blue-300"
      >
        + Agregar Certificación
      </button>
    </div>
  );
};
