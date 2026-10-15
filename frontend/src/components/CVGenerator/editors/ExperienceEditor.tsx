import React, { useState } from "react";
import { Experience } from "../../../types/cv";
import CloseIcon from "@mui/icons-material/Close";

interface ExperienceEditorProps {
  experiencia: Experience[];
  onChange: (experiencia: Experience[]) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ experiencia, onChange }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleUpdate = (index: number, field: keyof Experience, value: Experience[keyof Experience]) => {
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
        <div key={index} className={`acc ${expandedIndex === index ? "acc-open" : ""}`}>
          <button
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            className="acc-head"
          >
            <div className="flex-1">
              <p className="acc-title">{exp.titulo}</p>
              <p className="text-muted text-xs">{exp.empresa}</p>
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
                <label className="field-label">Título del Puesto</label>
                <input
                  type="text"
                  value={exp.titulo}
                  onChange={(e) => handleUpdate(index, "titulo", e.target.value)}
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Empresa</label>
                  <input
                    type="text"
                    value={exp.empresa}
                    onChange={(e) => handleUpdate(index, "empresa", e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="field-label">Ubicación</label>
                  <input
                    type="text"
                    value={exp.ubicacion || ""}
                    onChange={(e) => handleUpdate(index, "ubicacion", e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Fecha Inicio (YYYY-MM)</label>
                  <input
                    type="text"
                    value={exp.fechaInicio}
                    onChange={(e) => handleUpdate(index, "fechaInicio", e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="field-label">Fecha Fin</label>
                  <input
                    type="text"
                    value={exp.fechaFin}
                    onChange={(e) => handleUpdate(index, "fechaFin", e.target.value)}
                    placeholder="Presente"
                    className="input"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="field-label !mb-0">Descripción (logros)</label>
                  <button
                    onClick={() => handleAddDescription(index)}
                    className="btn btn-ghost !min-h-0 !py-1 text-sm"
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
                        className="input flex-1 resize-none"
                        rows={2}
                        placeholder="Logro o responsabilidad..."
                      />
                      <button
                        onClick={() => handleRemoveDescription(index, descIndex)}
                        className="btn btn-ghost btn-icon shrink-0"
                      >
                        <CloseIcon sx={{ fontSize: 18 }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleRemoveExperience(index)}
                className="btn btn-ghost btn-block mt-3"
              >
                Eliminar Experiencia
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleAddExperience}
        className="btn btn-secondary btn-dashed btn-block"
      >
        + Agregar Experiencia
      </button>
    </div>
  );
};
