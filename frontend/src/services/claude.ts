import { supabase } from "./supabase";
import type { MatchResult } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export async function analyzeJobMatch(
  cvText: string,
  jobDescription: string
): Promise<MatchResult> {
  // Se envía el token del usuario logueado; la anon key solo es el respaldo.
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token ?? SUPABASE_ANON_KEY;

  const response = await fetch(`${SUPABASE_URL}/functions/v1/job-ats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      cvText,
      jobDescription,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Error al conectar con Supabase");
  }

  return response.json();
}
