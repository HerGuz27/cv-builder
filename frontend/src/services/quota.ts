import { supabase } from "./supabase";

/** Debe coincidir con FREE_MONTHLY_LIMIT de la Edge Function job-ats (que es la que aplica el límite). */
export const FREE_MONTHLY_LIMIT = 3;

/** Mes actual en UTC, igual que el servidor. */
function currentPeriod(): string {
  return new Date().toISOString().slice(0, 7);
}

/**
 * Análisis que le quedan al usuario este mes. Es solo informativo: la cuota
 * se descuenta y se hace cumplir en la Edge Function, no acá.
 */
export async function getRemaining(): Promise<number> {
  const { data, error } = await supabase
    .from("ats_usage")
    .select("used")
    .eq("period", currentPeriod())
    .maybeSingle();

  if (error) throw new Error("No se pudo consultar tu cuota");
  return Math.max(0, FREE_MONTHLY_LIMIT - (data?.used ?? 0));
}

/** Créditos comprados disponibles (se usan cuando se agota la cuota gratuita). */
export async function getCredits(): Promise<number> {
  const { data, error } = await supabase.from("ats_credits").select("balance").maybeSingle();

  if (error) throw new Error("No se pudieron consultar tus créditos");
  return data?.balance ?? 0;
}
