import { CVData } from "../types/cv";
import { DEFAULT_TEMPLATE } from "../components/CVTemplates/registry";

/** Punto de partida de un CV nuevo. El ejemplo cargable vive en `mockCV`. */
export const emptyCVData: CVData = {
  personal: {
    nombre: "",
    titulo: "",
    ubicacion: "",
    email: "",
    telefono: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
  resumen: "",
  experiencia: [],
  educacion: [],
  certificaciones: [],
  skills: {},
  proyectos: [],
  template: DEFAULT_TEMPLATE,
};
