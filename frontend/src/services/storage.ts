import type { JobApplication, MatchResult } from "./types";

const STORAGE_KEY = "ats_applications";

export function saveApplication(
  titulo: string,
  empresa: string,
  url: string,
  estado: "postulado" | "entrevista" | "rechazado" | "oferta",
  porcentajeMatch: number,
  jobDescription: string,
  cvFileName: string,
  result: MatchResult,
  notas?: string
): JobApplication {
  const application: JobApplication = {
    id: Date.now().toString(),
    titulo,
    empresa,
    url,
    estado,
    porcentajeMatch,
    notas,
    fechaPostulacion: new Date().toISOString(),
    jobDescription,
    cvFileName,
    result,
  };

  const applications = getAllApplications();
  applications.unshift(application);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));

  return application;
}

export function getAllApplications(): JobApplication[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function deleteApplication(id: string): void {
  const applications = getAllApplications();
  const filtered = applications.filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function updateApplication(
  id: string,
  updates: Partial<JobApplication>
): void {
  const applications = getAllApplications();
  const application = applications.find((a) => a.id === id);
  if (application) {
    Object.assign(application, updates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  }
}
