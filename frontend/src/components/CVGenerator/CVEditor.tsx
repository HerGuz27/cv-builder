import React, { useRef, useState } from "react";
import { CVData } from "../../types/cv";
import { PDFPreview } from "./PDFPreview";
import { PersonalInfoEditor } from "./editors/PersonalInfoEditor";
import { ResumenEditor } from "./editors/ResumenEditor";
import { ExperienceEditor } from "./editors/ExperienceEditor";
import { EducationEditor } from "./editors/EducationEditor";
import { SkillsEditor } from "./editors/SkillsEditor";
import { CertificationsEditor } from "./editors/CertificationsEditor";
import { TemplatePicker } from "./editors/TemplatePicker";
import { getTemplate } from "../CVTemplates/registry";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import WorkOutlinedIcon from "@mui/icons-material/WorkOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";

interface CVEditorProps {
  data: CVData;
  onChange: (data: CVData) => void;
  /** PDF generado a partir de `data`; es el mismo archivo que se descarga. */
  pdfBlob: Blob | null;
  isBuilding?: boolean;
  pdfError?: string | null;
}

type Section =
  | "plantilla"
  | "personal"
  | "resumen"
  | "experiencia"
  | "educacion"
  | "skills"
  | "certificaciones";

export const CVEditor: React.FC<CVEditorProps> = ({ data, onChange, pdfBlob, isBuilding, pdfError }) => {
  const [activeSection, setActiveSection] = useState<Section>("personal");
  const renderCount = useRef(0);
  renderCount.current++;
  console.log("[CVEditor] render #", renderCount.current, "data.personal.nombre:", data.personal.nombre);

  const templateActual = getTemplate(data.template).id;

  const sections: { id: Section; label: string; icon: React.ElementType }[] = [
    { id: "plantilla", label: "Plantilla", icon: PaletteOutlinedIcon },
    { id: "personal", label: "Datos Personales", icon: PersonOutlinedIcon },
    { id: "resumen", label: "Resumen", icon: DescriptionOutlinedIcon },
    { id: "experiencia", label: "Experiencia", icon: WorkOutlinedIcon },
    { id: "educacion", label: "Educación", icon: SchoolOutlinedIcon },
    { id: "skills", label: "Skills", icon: BoltOutlinedIcon },
    { id: "certificaciones", label: "Certificaciones", icon: EmojiEventsOutlinedIcon },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[232px_minmax(0,1fr)_428px] border-b-2 border-divider">
      {/* Section rail (desktop) / tabs (mobile) */}
      <nav
        aria-label="Secciones del CV"
        className="border-b-2 lg:border-b-0 lg:border-r-2 border-divider"
      >
        <div className="lg:sticky lg:top-[72px] lg:py-6">
        <div className="hidden lg:block px-5 pb-4">
          <div className="lbl">Secciones</div>
        </div>
        <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible px-4 lg:px-0 lg:border-t-2 border-divider">
          {sections.map((section) => {
            const active = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                aria-current={active}
                className={`rail-item shrink-0 px-3 pt-3 pb-2.5 lg:px-5 lg:py-3 border-b-[3px] lg:border-b lg:border-l-[3px] ${
                  active
                    ? "border-b-accent lg:border-b-divider lg:border-l-accent"
                    : "border-b-transparent lg:border-b-divider lg:border-l-transparent"
                }`}
              >
                <span className="hidden lg:inline-flex items-center">
                  <section.icon sx={{ fontSize: 18 }} />
                </span>
                {section.label}
              </button>
            );
          })}
        </div>
        </div>
      </nav>

      {/* Editor Panel */}
      <div className="px-4 py-6 lg:px-8 lg:py-7 min-w-0">
        <div className="lbl mb-4">
          Sección {sections.findIndex((s) => s.id === activeSection) + 1} de {sections.length}
        </div>

        {/* Section Content */}
        <div>
          {activeSection === "plantilla" && (
            <TemplatePicker
              value={templateActual}
              onChange={(template) => onChange({ ...data, template })}
              tieneFoto={!!data.personal.foto}
              onIrAFoto={() => setActiveSection("personal")}
            />
          )}
          {activeSection === "personal" && (
            <PersonalInfoEditor
              data={data.personal}
              onChange={(personal) => onChange({ ...data, personal })}
              usaFoto={getTemplate(data.template).usaFoto}
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
      <div className="border-t-2 lg:border-t-0 lg:border-l-2 border-divider bg-surface">
        <div className="lg:sticky lg:top-[72px] h-[70vh] lg:h-[calc(100vh-72px)]">
          <PDFPreview blob={pdfBlob} isBuilding={isBuilding} error={pdfError} className="h-full overflow-hidden" />
        </div>
      </div>
    </div>
  );
};
