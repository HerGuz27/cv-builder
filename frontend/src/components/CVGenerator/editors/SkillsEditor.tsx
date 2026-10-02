import React, { useState } from "react";
import { Skills } from "../../../types/cv";
import CloseIcon from "@mui/icons-material/Close";

interface SkillsEditorProps {
  skills: Skills;
  onChange: (skills: Skills) => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({ skills, onChange }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    Object.keys(skills)[0] || null
  );

  const handleUpdateCategory = (oldCategory: string, newCategory: string) => {
    const updated = { ...skills };
    if (oldCategory !== newCategory) {
      updated[newCategory] = updated[oldCategory];
      delete updated[oldCategory];
    }
    onChange(updated);
  };

  const handleAddSkill = (category: string) => {
    const updated = { ...skills };
    if (!updated[category].includes("")) {
      updated[category] = [...updated[category], ""];
    }
    onChange(updated);
  };

  const handleUpdateSkill = (category: string, index: number, value: string) => {
    const updated = { ...skills };
    updated[category][index] = value;
    onChange(updated);
  };

  const handleRemoveSkill = (category: string, index: number) => {
    const updated = { ...skills };
    updated[category] = updated[category].filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleRemoveCategory = (category: string) => {
    const updated = { ...skills };
    delete updated[category];
    onChange(updated);
  };

  const handleAddCategory = () => {
    const newCategory = "Nueva Categoría";
    const updated = { ...skills };
    updated[newCategory] = [""];
    onChange(updated);
    setExpandedCategory(newCategory);
  };

  return (
    <div className="space-y-3">
      {Object.entries(skills).map(([category, skillList]) => (
        <div key={category} className="border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() =>
              setExpandedCategory(expandedCategory === category ? null : category)
            }
            className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left"
          >
            <p className="font-medium text-gray-900">{category}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{skillList.length} skills</span>
              <svg
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  expandedCategory === category ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </button>

          {expandedCategory === category && (
            <div className="p-4 bg-white border-t border-gray-300 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Categoría
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => handleUpdateCategory(category, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Skills</label>
                  <button
                    onClick={() => handleAddSkill(category)}
                    className="text-sm px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    + Agregar
                  </button>
                </div>
                <div className="space-y-2">
                  {skillList.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleUpdateSkill(category, index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ingresa un skill..."
                      />
                      <button
                        onClick={() => handleRemoveSkill(category, index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded font-medium text-sm"
                      >
                        <CloseIcon sx={{ fontSize: 18 }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleRemoveCategory(category)}
                className="w-full px-4 py-2 mt-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium text-sm"
              >
                Eliminar Categoría
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleAddCategory}
        className="w-full px-4 py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium text-sm border-2 border-dashed border-blue-300"
      >
        + Agregar Categoría
      </button>
    </div>
  );
};
