import React, { useState } from "react";
import { Experience } from "../../../types/cv";
import CloseIcon from "@mui/icons-material/Close";

interface ExperienceEditorProps {
  experiencia: Experience[];
  onChange: (experiencia: Experience[]) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ experiencia, onChange }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleUpdate = (index: number, field: keyof Experience, value: any) => {
    const updated = [...experiencia];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddExperience = () => {
    const newExperience: Experience = {
      titulo: "Nuevo Puesto",
      empresa: "Empresa",
      ubicacion: "",
      fechaInicio: new Date().toISOString().slice(0, 7),
      fechaFin: "Presente",
      descripcion: [""],
    };
    onChange([...experiencia, newExperience]);
    setExpandedIndex(experiencia.length);
  };

  const handleRemoveExperience = (index: number) => {
    onChange(experiencia.filter((_, i) => i !== index));
  };

  const handleUpdateDescription = (expIndex: number, descIndex: number, value: string) => {
    const updated = [...experiencia];
    updated[expIndex].descripcion[descIndex] = value;
    onChange(updated);
  };

  const handleAddDescription = (expIndex: number) => {
    const updated = [...experiencia];
    updated[expIndex].descripcion.push("");
    onChange(updated);
  };

  const handleRemoveDescription = (expIndex: number, descIndex: number) => {
    const updated = [...experiencia];
    updated[expIndex].descripcion.splice(descIndex, 1);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {experiencia.map((exp, index) => (
        <div key={index} className="border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left"
          >
            <div className="flex-1">
              <p className="font-medium text-gray-900">{exp.titulo}</p>
              <p className="text-sm text-gray-600">{exp.empresa}</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Título del Puesto</label>
                <input
                  type="text"
                  value={exp.titulo}
                  onChange={(e) => handleUpdate(index, "titulo", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                  <input
                    type="text"
                    value={exp.empresa}
                    onChange={(e) => handleUpdate(index, "empresa", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                  <input
                    type="text"
                    value={exp.ubicacion || ""}
                    onChange={(e) => handleUpdate(index, "ubicacion", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio (YYYY-MM)</label>
                  <input
                    type="text"
                    value={exp.fechaInicio}
                    onChange={(e) => handleUpdate(index, "fechaInicio", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                  <input
                    type="text"
                    value={exp.fechaFin}
                    onChange={(e) => handleUpdate(index, "fechaFin", e.target.value)}
                    placeholder="Presente"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Descripción (logros)</label>
                  <button
                    onClick={() => handleAddDescription(index)}
                    className="text-sm px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    + Agregar
                  </button>
                </div>
                <div className="space-y-2">
                  {exp.descripcion.map((desc, descIndex) => (
                    <div key={descIndex} className="flex gap-2">
                      <textarea
                        value={desc}
                        onChange={(e) => handleUpdateDescription(index, descIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={2}
                        placeholder="Logro o responsabilidad..."
                      />
                      <button
                        onClick={() => handleRemoveDescription(index, descIndex)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded font-medium text-sm"
                      >
                        <CloseIcon sx={{ fontSize: 18 }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleRemoveExperience(index)}
                className="w-full px-4 py-2 mt-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium text-sm"
              >
                Eliminar Experiencia
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleAddExperience}
        className="w-full px-4 py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium text-sm border-2 border-dashed border-blue-300"
      >
        + Agregar Experiencia
      </button>
    </div>
  );
};
