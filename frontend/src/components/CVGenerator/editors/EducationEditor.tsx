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
        <div key={index} className={`acc ${expandedIndex === index ? "acc-open" : ""}`}>
          <button
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            className="acc-head"
          >
            <div className="flex-1">
              <p className="acc-title">{edu.titulo}</p>
              <p className="text-muted text-xs">{edu.institucion}</p>
            </div>
            <svg
              className={`h-5 w-5 text-muted transition-transform ${
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
            <div className="acc-body space-y-3">
              <div>
                <label className="field-label">Título/Carrera</label>
                <input
                  type="text"
                  value={edu.titulo}
                  onChange={(e) => handleUpdate(index, "titulo", e.target.value)}
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Institución</label>
                  <input
                    type="text"
                    value={edu.institucion}
                    onChange={(e) => handleUpdate(index, "institucion", e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="field-label">Ubicación</label>
                  <input
                    type="text"
                    value={edu.ubicacion || ""}
                    onChange={(e) => handleUpdate(index, "ubicacion", e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Año Inicio</label>
                  <input
                    type="text"
                    value={edu.fechaInicio}
                    onChange={(e) => handleUpdate(index, "fechaInicio", e.target.value)}
                    placeholder="2019"
                    className="input"
                  />
                </div>
                <div>
                  <label className="field-label">Año Fin</label>
                  <input
                    type="text"
                    value={edu.fechaFin}
                    onChange={(e) => handleUpdate(index, "fechaFin", e.target.value)}
                    placeholder="2023"
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Promedio (opcional)</label>
                  <input
                    type="text"
                    value={edu.promedio || ""}
                    onChange={(e) => handleUpdate(index, "promedio", e.target.value)}
                    placeholder="8.5/10"
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Descripción (opcional)</label>
                <textarea
                  value={edu.descripcion || ""}
                  onChange={(e) => handleUpdate(index, "descripcion", e.target.value)}
                  className="input resize-none"
                  rows={3}
                  placeholder="Proyecto final, tesis, etc..."
                />
              </div>

              <button
                onClick={() => handleRemoveEducation(index)}
                className="btn btn-ghost btn-block mt-3"
              >
                Eliminar Educación
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleAddEducation}
        className="btn btn-secondary btn-dashed btn-block"
      >
        + Agregar Educación
      </button>
    </div>
  );
};
