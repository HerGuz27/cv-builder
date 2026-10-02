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
        <div key={index} className={`acc ${expandedIndex === index ? "acc-open" : ""}`}>
          <button
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            className="acc-head"
          >
            <div className="flex-1">
              <p className="acc-title">{cert.nombre}</p>
              <p className="text-muted text-xs">{cert.emisor}</p>
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
                <label className="field-label">Nombre</label>
                <input
                  type="text"
                  value={cert.nombre}
                  onChange={(e) => handleUpdate(index, "nombre", e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="field-label">Emisor</label>
                <input
                  type="text"
                  value={cert.emisor}
                  onChange={(e) => handleUpdate(index, "emisor", e.target.value)}
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">Fecha (YYYY o YYYY-MM)</label>
                  <input
                    type="text"
                    value={cert.fecha}
                    onChange={(e) => handleUpdate(index, "fecha", e.target.value)}
                    placeholder="2023 o 2023-06"
                    className="input"
                  />
                </div>
                <div>
                  <label className="field-label">URL (opcional)</label>
                  <input
                    type="text"
                    value={cert.url || ""}
                    onChange={(e) => handleUpdate(index, "url", e.target.value)}
                    placeholder="https://..."
                    className="input"
                  />
                </div>
              </div>

              <button
                onClick={() => handleRemoveCertification(index)}
                className="btn btn-ghost btn-block mt-3"
              >
                Eliminar Certificación
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleAddCertification}
        className="btn btn-secondary btn-dashed btn-block"
      >
        + Agregar Certificación
      </button>
    </div>
  );
};
