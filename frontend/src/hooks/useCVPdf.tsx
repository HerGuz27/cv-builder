import { useCallback, useEffect, useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { CVData } from "../types/cv";
import { HarvardPDFDoc } from "../components/CVTemplates/HarvardPDFDoc";

/** Genera los bytes del PDF. Preview y descarga llaman siempre a esta función. */
export const buildCVPdfBlob = (data: CVData): Promise<Blob> =>
  pdf(<HarvardPDFDoc data={data} />).toBlob();

interface UseCVPdfResult {
  /** PDF actual, ya renderizado. Es exactamente lo que se descarga. */
  blob: Blob | null;
  /** Hay cambios del editor todavía no reflejados en `blob`. */
  isBuilding: boolean;
  error: string | null;
  /** Genera el PDF con los datos actuales, sin esperar al debounce. */
  buildNow: () => Promise<Blob>;
}

/**
 * Mantiene un PDF sincronizado con los datos del editor.
 * El debounce evita regenerar el documento en cada tecla.
 */
export function useCVPdf(data: CVData, debounceMs = 400): UseCVPdfResult {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isBuilding, setIsBuilding] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Descarta resultados de builds que quedaron obsoletos mientras corrían.
  const runId = useRef(0);
  // Los datos más recientes, para que buildNow() no dependa del debounce.
  const latest = useRef(data);
  latest.current = data;

  useEffect(() => {
    const id = ++runId.current;
    setIsBuilding(true);

    const timer = setTimeout(async () => {
      try {
        const result = await buildCVPdfBlob(data);
        if (id !== runId.current) return;
        setBlob(result);
        setError(null);
      } catch (err) {
        if (id !== runId.current) return;
        console.error("Error generando el PDF del CV:", err);
        setError("No se pudo generar el PDF. Revisá los datos del CV.");
      } finally {
        if (id === runId.current) setIsBuilding(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [data, debounceMs]);

  const buildNow = useCallback(async () => {
    const result = await buildCVPdfBlob(latest.current);
    // El build manual también es el estado vigente: cancela cualquier debounce en vuelo.
    runId.current++;
    setBlob(result);
    setError(null);
    setIsBuilding(false);
    return result;
  }, []);

  return { blob, isBuilding, error, buildNow };
}
