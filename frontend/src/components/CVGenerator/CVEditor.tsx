import React, { useState } from "react";
import { CVData } from "../../types/cv";
import { PDFPreview } from "./PDFPreview";
import { PersonalInfoEditor } from "./editors/PersonalInfoEditor";
import { ResumenEditor } from "./editors/ResumenEditor";
import { ExperienceEditor } from "./editors/ExperienceEditor";
import { EducationEditor } from "./editors/EducationEditor";
import { SkillsEditor } from "./editors/SkillsEditor";
import { CertificationsEditor } from "./editors/CertificationsEditor";

interface CVEditorProps {
  data: CVData;
  onChange: (data: CVData) => void;
  /** PDF generado a partir de `data`; es el mismo archivo que se descarga. */
  pdfBlob: Blob | null;
  isBuilding?: boolean;
  pdfError?: string | null;
}

type Section = "personal" | "resumen" | "experiencia" | "educacion" | "skills" | "certificaciones";

export const CVEditor: React.FC<CVEditorProps> = ({ data, onChange, pdfBlob, isBuilding, pdfError }) => {
  const [activeSection, setActiveSection] = useState<Section>("personal");

  const sections: { id: Section; label: string; icon: string }[] = [
    { id: "personal", label: "Datos Personales", icon: "👤" },
    { id: "resumen", label: "Resumen", icon: "📝" },
    { id: "experiencia", label: "Experiencia", icon: "💼" },
    { id: "educacion", label: "Educación", icon: "🎓" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "certificaciones", label: "Certificaciones", icon: "🏆" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-6 px-4">
      {/* Editor Panel */}
      <div className="space-y-4">
        {/* Section Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 sticky top-20 z-40">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeSection === section.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="hidden sm:inline">{section.icon} </span>
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeSection === "personal" && (
            <PersonalInfoEditor
              data={data.personal}
              onChange={(personal) => onChange({ ...data, personal })}
            />
          )}
          {activeSection === "resumen" && (
            <ResumenEditor
              resumen={data.resumen}
              onChange={(resumen) => onChange({ ...data, resumen })}
            />
          )}
          {activeSection === "experiencia" && (
            <ExperienceEditor
              experiencia={data.experiencia}
              onChange={(experiencia) => onChange({ ...data, experiencia })}
            />
          )}
          {activeSection === "educacion" && (
            <EducationEditor
              educacion={data.educacion}
              onChange={(educacion) => onChange({ ...data, educacion })}
            />
          )}
          {activeSection === "skills" && (
            <SkillsEditor
              skills={data.skills}
              onChange={(skills) => onChange({ ...data, skills })}
            />
          )}
          {activeSection === "certificaciones" && (
            <CertificationsEditor
              certificaciones={data.certificaciones || []}
              onChange={(certificaciones) => onChange({ ...data, certificaciones })}
            />
          )}
        </div>
      </div>

      {/* Preview Panel */}
      <div className="sticky top-20 h-[calc(100vh-120px)]">
        <PDFPreview
          blob={pdfBlob}
          isBuilding={isBuilding}
          error={pdfError}
          className="h-full rounded-lg shadow-lg overflow-hidden border-2 border-gray-200"
        />
      </div>
    </div>
  );
};
