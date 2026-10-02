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
        <div key={category} className={`acc ${expandedCategory === category ? "acc-open" : ""}`}>
          <button
            onClick={() =>
              setExpandedCategory(expandedCategory === category ? null : category)
            }
            className="acc-head"
          >
            <p className="acc-title">{category}</p>
            <div className="flex items-center gap-2">
              <span className="text-muted text-xs">{skillList.length} skills</span>
              <svg
                className={`h-5 w-5 text-muted transition-transform ${
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
            <div className="acc-body space-y-3">
              <div>
                <label className="field-label">
                  Nombre de la Categoría
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => handleUpdateCategory(category, e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="field-label !mb-0">Skills</label>
                  <button
                    onClick={() => handleAddSkill(category)}
                    className="btn btn-ghost !min-h-0 !py-1 text-sm"
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
                        className="input flex-1"
                        placeholder="Ingresa un skill..."
                      />
                      <button
                        onClick={() => handleRemoveSkill(category, index)}
                        className="btn btn-ghost btn-icon shrink-0"
                      >
                        <CloseIcon sx={{ fontSize: 18 }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleRemoveCategory(category)}
                className="btn btn-ghost btn-block mt-3"
              >
                Eliminar Categoría
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleAddCategory}
        className="btn btn-secondary btn-dashed btn-block"
      >
        + Agregar Categoría
      </button>
    </div>
  );
};
