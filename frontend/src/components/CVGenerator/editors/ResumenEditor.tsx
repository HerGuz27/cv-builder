import React from "react";

interface ResumenEditorProps {
  resumen: string;
  onChange: (resumen: string) => void;
}

export const ResumenEditor: React.FC<ResumenEditorProps> = ({ resumen, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="field-label">Resumen Profesional</label>
        <textarea
          value={resumen}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          className="input resize-none"
          placeholder="Describe tu perfil profesional, experiencia y fortalezas..."
        />
      </div>
      <p className="text-xs text-muted">
        Tip: Mantén tu resumen entre 3-4 líneas para máximo impacto
      </p>
    </div>
  );
};
