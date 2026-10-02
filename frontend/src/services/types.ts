export interface MatchResult {
  porcentajeMatch: number;
  razonamiento: string;
  fortalezas: string[];
  brechas: string[];
  recomendaciones: string[];
}

export interface JobApplication {
  id: string;
  titulo: string;
  empresa: string;
  url: string;
  estado: "postulado" | "entrevista" | "rechazado" | "oferta";
  porcentajeMatch: number;
  notas?: string;
  fechaPostulacion: string;
  jobDescription: string;
  cvFileName: string;
  result: MatchResult;
}
