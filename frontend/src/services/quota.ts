import { supabase } from "./supabase";

export const FREE_MONTHLY_LIMIT = 3;

function currentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/** Análisis que le quedan al usuario este mes. */
export async function getRemaining(): Promise<number> {
  const { data, error } = await supabase
    .from("ats_usage")
    .select("used")
    .eq("period", currentPeriod())
    .maybeSingle();

  if (error) throw new Error("No se pudo consultar tu cuota");
  return Math.max(0, FREE_MONTHLY_LIMIT - (data?.used ?? 0));
}

/** Descuenta un análisis de forma atómica. Devuelve false si ya no quedaba cuota. */
export async function consume(): Promise<boolean> {
  const { data, error } = await supabase.rpc("consume_ats_quota", {
    p_period: currentPeriod(),
    p_limit: FREE_MONTHLY_LIMIT,
  });

  if (error) throw new Error("No se pudo registrar el análisis");
  return (data as number) >= 0;
}
