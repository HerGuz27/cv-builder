import React, { useState } from "react";
import { Project } from "../../../types/cv";

interface ProjectsEditorProps {
  proyectos: Project[];
  onChange: (proyectos: Project[]) => void;
}

export const ProjectsEditor: React.FC<ProjectsEditorProps> = ({ proyectos, onChange }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const handleUpdate = <K extends keyof Project>(index: number, field: K, value: Project[K]) => {
    const updated = [...proyectos];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddProject = () => {
    const newProject: Project = {
      nombre: "Nuevo Proyecto",
      descripcion: "",
      fecha: new Date().getFullYear().toString(),
      url: "",
      tecnologias: [],
    };
    onChange([...proyectos, newProject]);
    setExpandedIndex(proyectos.length);
  };

  const handleRemoveProject = (index: number) => {
    onChange(proyectos.filter((_, i) => i !== index));
    setExpandedIndex(null);
  };

  return (
    <div className="space-y-3">
      {proyectos.length === 0 && (
        <p className="text-muted text-sm">
          Sin proyectos: la sección no aparece en el CV.
        </p>
      )}

      {proyectos.map((proyecto, index) => (
        <div key={index} className={`acc ${expandedIndex === index ? "acc-open" : ""}`}>
          <button
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            className="acc-head"
          >
            <div className="flex-1">
              <p className="acc-title">{proyecto.nombre}</p>
              <p className="text-muted text-xs">{proyecto.fecha}</p>
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Nombre</label>
                  <input
                    type="text"
                    value={proyecto.nombre}
                    onChange={(e) => handleUpdate(index, "nombre", e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="field-label">Fecha (YYYY)</label>
                  <input
                    type="text"
                    value={proyecto.fecha}
                    onChange={(e) => handleUpdate(index, "fecha", e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Descripción</label>
                <textarea
                  value={proyecto.descripcion}
                  onChange={(e) => handleUpdate(index, "descripcion", e.target.value)}
                  rows={3}
                  className="input"
                />
              </div>

              <div>
                <label className="field-label">Tecnologías (separadas por coma)</label>
                <input
                  type="text"
                  defaultValue={proyecto.tecnologias.join(", ")}
                  onChange={(e) =>
                    handleUpdate(
                      index,
                      "tecnologias",
                      e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
                    )
                  }
                  placeholder="React, Node.js, PostgreSQL"
                  className="input"
                />
              </div>

              <div>
                <label className="field-label">URL (opcional)</label>
                <input
                  type="text"
                  value={proyecto.url || ""}
                  onChange={(e) => handleUpdate(index, "url", e.target.value)}
                  placeholder="https://..."
                  className="input"
                />
              </div>

              <button
                onClick={() => handleRemoveProject(index)}
                className="btn btn-ghost btn-block mt-3"
              >
                Eliminar Proyecto
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleAddProject}
        className="btn btn-secondary btn-dashed btn-block"
      >
        + Agregar Proyecto
      </button>
    </div>
  );
};
