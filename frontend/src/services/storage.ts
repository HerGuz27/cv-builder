import { supabase } from "./supabase";
import type { JobApplication, MatchResult } from "./types";

interface ApplicationRow {
  id: string;
  titulo: string;
  empresa: string;
  url: string;
  estado: JobApplication["estado"];
  porcentaje_match: number;
  notas: string | null;
  fecha_postulacion: string;
  job_description: string;
  cv_file_name: string;
  result: MatchResult;
}

const fromRow = (r: ApplicationRow): JobApplication => ({
  id: r.id,
  titulo: r.titulo,
  empresa: r.empresa,
  url: r.url,
  estado: r.estado,
  porcentajeMatch: r.porcentaje_match,
  notas: r.notas ?? undefined,
  fechaPostulacion: r.fecha_postulacion,
  jobDescription: r.job_description,
  cvFileName: r.cv_file_name,
  result: r.result,
});

export async function saveApplication(
  titulo: string,
  empresa: string,
  url: string,
  estado: JobApplication["estado"],
  porcentajeMatch: number,
  jobDescription: string,
  cvFileName: string,
  result: MatchResult,
  notas?: string
): Promise<JobApplication> {
  const { data, error } = await supabase
    .from("applications")
    .insert({
      titulo,
      empresa,
      url,
      estado,
      porcentaje_match: porcentajeMatch,
      notas: notas ?? null,
      job_description: jobDescription,
      cv_file_name: cvFileName,
      result,
    })
    .select()
    .single();

  if (error) throw new Error("No se pudo guardar la postulación");
  return fromRow(data as ApplicationRow);
}

export async function getAllApplications(): Promise<JobApplication[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("fecha_postulacion", { ascending: false });

  if (error) throw new Error("No se pudieron cargar las postulaciones");
  return (data as ApplicationRow[]).map(fromRow);
}

export async function deleteApplication(id: string): Promise<void> {
  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) throw new Error("No se pudo eliminar la postulación");
}

export async function updateApplication(
  id: string,
  updates: Partial<Pick<JobApplication, "estado" | "notas">>
): Promise<void> {
  const patch: Record<string, unknown> = {};
  if (updates.estado !== undefined) patch.estado = updates.estado;
  if (updates.notas !== undefined) patch.notas = updates.notas;

  const { error } = await supabase.from("applications").update(patch).eq("id", id);
  if (error) throw new Error("No se pudo actualizar la postulación");
}
