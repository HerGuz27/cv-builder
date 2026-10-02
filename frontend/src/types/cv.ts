export interface PersonalInfo {
  nombre: string;
  /** Título profesional bajo el nombre. Ej: "Lic. en Administración". */
  titulo?: string;
  /** Foto de perfil como data URL (JPEG). Sólo la usan las plantillas con foto. */
  foto?: string;
  ubicacion: string;
  email: string;
  telefono: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface Experience {
  titulo: string;
  empresa: string;
  ubicacion?: string;
  fechaInicio: string; // YYYY-MM
  fechaFin: string | "Presente";
  descripcion: string[];
}

export interface Education {
  titulo: string;
  institucion: string;
  ubicacion?: string;
  fechaInicio: string; // YYYY
  fechaFin: string; // YYYY
  promedio?: string;
  descripcion?: string;
}

export interface Certification {
  nombre: string;
  emisor: string;
  fecha: string; // YYYY o YYYY-MM
  url?: string;
}

export interface Skills {
  [categoria: string]: string[];
}

export interface Project {
  nombre: string;
  descripcion: string;
  fecha: string; // YYYY
  url?: string;
  tecnologias: string[];
}

export interface CVData {
  personal: PersonalInfo;
  resumen: string;
  experiencia: Experience[];
  educacion: Education[];
  certificaciones?: Certification[];
  skills: Skills;
  proyectos?: Project[];
  /** Plantilla elegida. Viaja con el CV para que los guardados recuerden su diseño. */
  template?: CVTemplate;
}

export type CVTemplate = "harvard" | "moderno-azul";
