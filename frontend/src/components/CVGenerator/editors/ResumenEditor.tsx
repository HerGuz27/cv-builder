import React from "react";

interface ResumenEditorProps {
  resumen: string;
  onChange: (resumen: string) => void;
}

export const ResumenEditor: React.FC<ResumenEditorProps> = ({ resumen, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Resumen Profesional</label>
        <textarea
          value={resumen}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Describe tu perfil profesional, experiencia y fortalezas..."
        />
      </div>
      <p className="text-xs text-gray-500">
        Tip: Mantén tu resumen entre 3-4 líneas para máximo impacto
      </p>
    </div>
  );
};
