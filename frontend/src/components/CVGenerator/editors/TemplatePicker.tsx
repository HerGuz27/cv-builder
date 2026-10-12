import React from "react";
import { CVTemplate } from "../../../types/cv";
import { CV_TEMPLATES } from "../../CVTemplates/registry";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface TemplatePickerProps {
  value: CVTemplate;
  onChange: (template: CVTemplate) => void;
  /** El CV ya tiene foto cargada: si no, las plantillas con foto lo avisan. */
  tieneFoto: boolean;
  /** Lleva al usuario a Datos Personales para subir la foto. */
  onIrAFoto?: () => void;
}

/** Miniatura en CSS de cada plantilla. Es orientativa, no un render del PDF. */
const Thumb: React.FC<{ id: CVTemplate }> = ({ id }) => {
  const line = (w: string, extra = "") => (
    <div className={`h-[3px] rounded-sm bg-gray-300 ${extra}`} style={{ width: w }} />
  );

  if (id === "moderno-azul") {
    return (
      <div className="h-28 w-full rounded-md overflow-hidden border border-gray-200 flex bg-white">
        <div className="w-1/3 bg-[#3A6CA8] flex flex-col items-center pt-2 gap-1.5">
          <div className="h-7 w-7 rounded-full bg-white/90" />
          <div className="h-[3px] w-8 rounded-sm bg-white/70" />
          <div className="h-[3px] w-10 rounded-sm bg-white/40" />
          <div className="h-[3px] w-10 rounded-sm bg-white/40" />
          <div className="h-[3px] w-8 rounded-sm bg-white/70 mt-1" />
          <div className="h-[3px] w-10 rounded-sm bg-white/40" />
        </div>
        <div className="flex-1">
          <div className="h-8 bg-[#1B3F72] flex flex-col justify-center pl-2 gap-1">
            <div className="h-[5px] w-16 rounded-sm bg-white/90" />
            <div className="h-[3px] w-10 rounded-sm bg-white/50" />
          </div>
          <div className="p-2 space-y-1.5">
            <div className="h-[3px] w-10 rounded-sm bg-[#1B3F72]" />
            {line("100%")}
            {line("85%")}
            <div className="h-[3px] w-12 rounded-sm bg-[#1B3F72] mt-2" />
            {line("90%")}
            {line("70%")}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-28 w-full rounded-md overflow-hidden border border-gray-200 bg-white p-3">
      <div className="flex flex-col items-center space-y-1">
        <div className="h-[6px] w-20 rounded-sm bg-gray-700" />
        <div className="h-[3px] w-24 rounded-sm bg-gray-300" />
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="h-[3px] w-full rounded-sm bg-gray-700" />
        {line("100%")}
        {line("88%")}
        <div className="h-[3px] w-full rounded-sm bg-gray-700 mt-2" />
        {line("95%")}
        {line("75%")}
      </div>
    </div>
  );
};

export const TemplatePicker: React.FC<TemplatePickerProps> = ({
  value,
  onChange,
  tieneFoto,
  onIrAFoto,
}) => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg">Plantilla</h3>
      <p className="text-sm text-muted mt-1">
        Cambiar de plantilla no toca tus datos: podés probar y volver cuando quieras.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {CV_TEMPLATES.map((template) => {
        const activa = template.id === value;
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onChange(template.id)}
            aria-pressed={activa}
            className={`text-left border p-3 transition-colors ${
              activa
                ? "border-2 border-accent bg-accent-100"
                : "border-divider bg-surface hover:bg-neutral-200"
            }`}
          >
            <Thumb id={template.id} />

            <div className="flex items-center justify-between mt-3">
              <span className="acc-title">{template.nombre}</span>
              {activa && <span className="tag tag-accent">En uso</span>}
            </div>
            <p className="text-xs text-muted mt-1">{template.descripcion}</p>
            <p className="text-xs text-muted mt-1.5">{template.ats}</p>

            {template.usaFoto && !tieneFoto && (
              <p className="tag tag-neutral mt-2">
                Usa foto: sin foto se muestran tus iniciales.
              </p>
            )}
          </button>
        );
      })}
    </div>

    {!tieneFoto && onIrAFoto && (
      <button
        type="button"
        onClick={onIrAFoto}
        className="btn btn-ghost"
      >
        Subir mi foto
        <ArrowForwardIcon sx={{ fontSize: 16 }} />
      </button>
    )}
  </div>
);
