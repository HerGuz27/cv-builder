import React, { useState } from "react";
import { Education } from "../../../types/cv";

interface EducationEditorProps {
  educacion: Education[];
  onChange: (educacion: Education[]) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({ educacion, onChange }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleUpdate = (index: number, field: keyof Education, value: any) => {
    const updated = [...educacion];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddEducation = () => {
    const newEducation: Education = {
      titulo: "Nuevo Título",
      institucion: "Institución",
      ubicacion: "",
      fechaInicio: new Date().getFullYear().toString(),
      fechaFin: new Date().getFullYear().toString(),
      promedio: "",
      descripcion: "",
    };
    onChange([...educacion, newEducation]);
    setExpandedIndex(educacion.length);
  };

  const handleRemoveEducation = (index: number) => {
    onChange(educacion.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {educacion.map((edu, index) => (
        <div key={index} className="border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{edu.titulo}</p>
              <p className="text-sm text-gray-600">{edu.institucion}</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Título/Carrera</label>
                <input
                  type="text"
                  value={edu.titulo}
                  onChange={(e) => handleUpdate(index, "titulo", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institución</label>
                  <input
                    type="text"
                    value={edu.institucion}
                    onChange={(e) => handleUpdate(index, "institucion", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                  <input
                    type="text"
                    value={edu.ubicacion || ""}
                    onChange={(e) => handleUpdate(index, "ubicacion", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Año Inicio</label>
                  <input
                    type="text"
                    value={edu.fechaInicio}
                    onChange={(e) => handleUpdate(index, "fechaInicio", e.target.value)}
                    placeholder="2019"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Año Fin</label>
                  <input
                    type="text"
                    value={edu.fechaFin}
                    onChange={(e) => handleUpdate(index, "fechaFin", e.target.value)}
                    placeholder="2023"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Promedio (opcional)</label>
                  <input
                    type="text"
                    value={edu.promedio || ""}
                    onChange={(e) => handleUpdate(index, "promedio", e.target.value)}
                    placeholder="8.5/10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
                <textarea
                  value={edu.descripcion || ""}
                  onChange={(e) => handleUpdate(index, "descripcion", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="Proyecto final, tesis, etc..."
                />
              </div>

              <button
                onClick={() => handleRemoveEducation(index)}
                className="w-full px-4 py-2 mt-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium text-sm"
              >
                Eliminar Educación
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleAddEducation}
        className="w-full px-4 py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium text-sm border-2 border-dashed border-blue-300"
      >
        + Agregar Educación
      </button>
    </div>
  );
};
