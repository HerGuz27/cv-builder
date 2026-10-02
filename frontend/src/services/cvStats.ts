import { CVData } from "../types/cv";

/**
 * Contador global de CVs creados.
 *
 * El contador es decorativo: si Supabase no está configurado o falla,
 * el editor tiene que seguir funcionando igual. Por eso todo acá
 * devuelve `null` en vez de tirar, y el cliente se importa en diferido
 * (services/supabase lanza en import si faltan las env vars).
 */

/** Hashes de CVs ya contados en este navegador. Evita sumar al re-descargar el mismo CV. */
const COUNTED_KEY = "jobsearch.cv.counted.v1";

type SupabaseClient = Awaited<typeof import("./supabase")>["supabase"];

let clientPromise: Promise<SupabaseClient | null> | null = null;

const getClient = (): Promise<SupabaseClient | null> => {
  if (!clientPromise) {
    clientPromise = import("./supabase")
      .then((mod) => mod.supabase)
      .catch((err) => {
        console.warn("Contador de CVs deshabilitado (Supabase no disponible):", err);
        return null;
      });
  }
  return clientPromise;
};

/** Hash estable y corto del contenido del CV (djb2). */
const hashCV = (data: CVData): string => {
  const json = JSON.stringify(data);
  let hash = 5381;
  for (let i = 0; i < json.length; i++) {
    hash = ((hash << 5) + hash + json.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
};

const readCounted = (): string[] => {
  try {
    const raw = localStorage.getItem(COUNTED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeCounted = (hashes: string[]) => {
  try {
    // Alcanza con recordar los últimos; la lista no tiene por qué crecer sin límite.
    localStorage.setItem(COUNTED_KEY, JSON.stringify(hashes.slice(-50)));
  } catch {
    /* modo privado o sin cuota: no pasa nada */
  }
};

/** Total de CVs creados con la app. `null` si no se pudo leer. */
export const getTotalCVs = async (): Promise<number | null> => {
  const supabase = await getClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("cv_stats")
    .select("total")
    .eq("id", 1)
    .single();

  if (error) {
    console.warn("No se pudo leer el contador de CVs:", error.message);
    return null;
  }
  return typeof data?.total === "number" ? data.total : Number(data?.total ?? 0);
};

/**
 * Registra que se creó un CV y devuelve el nuevo total.
 * Si este contenido exacto ya se contó en este navegador, no vuelve a sumar
 * y devuelve `null` (el llamador se queda con el total que ya tenía).
 */
export const registerCVCreated = async (data: CVData): Promise<number | null> => {
  const hash = hashCV(data);
  const counted = readCounted();
  if (counted.includes(hash)) return null;

  const supabase = await getClient();
  if (!supabase) return null;

  const { data: total, error } = await supabase.rpc("increment_cv_count");

  if (error) {
    console.warn("No se pudo registrar el CV en el contador:", error.message);
    return null;
  }

  writeCounted([...counted, hash]);
  return typeof total === "number" ? total : Number(total ?? 0);
};
