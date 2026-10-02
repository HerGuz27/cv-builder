import React from "react";
import { DocumentProps } from "@react-pdf/renderer";
import { CVData, CVTemplate } from "../../types/cv";
import { HarvardPDFDoc } from "./HarvardPDFDoc";
import { ModernBluePDFDoc } from "./ModernBluePDFDoc";

/**
 * Catálogo de plantillas. Es el único lugar donde se decide qué documento
 * PDF corresponde a cada `CVTemplate`: el hook, el selector y la descarga
 * leen todos de acá.
 */

export interface CVTemplateInfo {
  id: CVTemplate;
  nombre: string;
  descripcion: string;
  /** Si muestra la foto de perfil (habilita el uploader en Datos Personales). */
  usaFoto: boolean;
  /** Nota corta sobre compatibilidad con filtros automáticos (ATS). */
  ats: string;
  render: (data: CVData) => React.ReactElement<DocumentProps>;
}

export const CV_TEMPLATES: CVTemplateInfo[] = [
  {
    id: "harvard",
    nombre: "Harvard",
    descripcion: "Una columna, blanco y negro, sin adornos. El estándar para postulaciones online.",
    usaFoto: false,
    ats: "Máxima compatibilidad ATS",
    render: (data) => <HarvardPDFDoc data={data} />,
  },
  {
    id: "moderno-azul",
    nombre: "Moderno Azul",
    descripcion: "Dos columnas con barra lateral azul y foto circular. Más visual, para enviar por mail o imprimir.",
    usaFoto: true,
    ats: "Mejor para envío directo que para ATS",
    render: (data) => <ModernBluePDFDoc data={data} />,
  },
];

export const DEFAULT_TEMPLATE: CVTemplate = "harvard";

/** Devuelve la plantilla pedida, o la de por defecto si el id no existe. */
export const getTemplate = (id?: CVTemplate): CVTemplateInfo =>
  CV_TEMPLATES.find((template) => template.id === id) ?? CV_TEMPLATES[0];
