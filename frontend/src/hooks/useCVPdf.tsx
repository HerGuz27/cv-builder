import { useCallback, useEffect, useRef, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { CVData } from "../types/cv";
import { getTemplate } from "../components/CVTemplates/registry";

/**
 * Genera los bytes del PDF con la plantilla elegida en `data.template`.
 * Preview y descarga llaman siempre a esta función.
 */
export const buildCVPdfBlob = (data: CVData): Promise<Blob> =>
  pdf(getTemplate(data.template).render(data)).toBlob();

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
 * Usa un debounce, pero si data cambia mientras se está generando,
 * simplemente marca que hay cambios pendientes; el siguiente build
 * arrancará automáticamente cuando el actual termine.
 *
 * Esto evita un loop infinito de resets cuando react-pdf tarda mucho.
 */
export function useCVPdf(data: CVData, debounceMs = 500): UseCVPdfResult {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isBuilding, setIsBuilding] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tracking para distinguir builds obsoletos.
  const runId = useRef(0);
  // Los datos más recientes, para que buildNow() no dependa del debounce.
  const latest = useRef(data);
  latest.current = data;
  // Se setea a true si data cambia mientras se está generando.
  const hasPendingBuild = useRef(false);
  // Se setea a true mientras hay un build en vuelo.
  const isGenerating = useRef(false);

  // Efecto principal: inicia builds con debounce.
  useEffect(() => {
    console.log("[useCVPdf] Effect triggered. isGenerating:", isGenerating.current, "hasPendingBuild:", hasPendingBuild.current);

    if (isGenerating.current) {
      // Ya hay un build en vuelo. Marca que hay cambios pendientes
      // y deja que el build actual sea quien lance el próximo.
      console.log("[useCVPdf] Build en vuelo, marcando pending");
      hasPendingBuild.current = true;
      return;
    }

    const id = ++runId.current;
    console.log("[useCVPdf] Iniciando build #", id, "con debounce de", debounceMs, "ms");
    setIsBuilding(true);
    hasPendingBuild.current = false;

    const timer = setTimeout(async () => {
      console.log("[useCVPdf] Debounce terminó, generando PDF #", id);
      isGenerating.current = true;
      try {
        const result = await buildCVPdfBlob(data);
        console.log("[useCVPdf] PDF generado, runId.current:", runId.current, "id:", id);
        if (id !== runId.current) {
          console.log("[useCVPdf] PDF obsoleto, descartando");
          return;
        }
        setBlob(result);
        setError(null);
        console.log("[useCVPdf] PDF guardado exitosamente");
      } catch (err) {
        if (id !== runId.current) return;
        console.error("Error generando el PDF del CV:", err);
        setError("No se pudo generar el PDF. Revisá los datos del CV.");
      } finally {
        isGenerating.current = false;
        if (id === runId.current) {
          console.log("[useCVPdf] Build #", id, "terminado, isBuilding=false");
          setIsBuilding(false);
        }
        // Si hubo cambios pendientes, lanza otro build.
        if (hasPendingBuild.current) {
          console.log("[useCVPdf] Hay builds pendientes, iniciando nuevo build");
          hasPendingBuild.current = false;
          latest.current = data;
          runId.current++;
          setIsBuilding(true);
          // Inicia inmediatamente el próximo build sin debounce.
          (async () => {
            isGenerating.current = true;
            try {
              const result = await buildCVPdfBlob(latest.current);
              if (runId.current - 1 === id) {
                setBlob(result);
                setError(null);
              }
            } catch (err) {
              console.error("Error en rebuild pendiente:", err);
            } finally {
              isGenerating.current = false;
              setIsBuilding(false);
            }
          })();
        }
      }
    }, debounceMs);

    return () => {
      console.log("[useCVPdf] Efecto cleanup, cancelando timer para build #", id);
      clearTimeout(timer);
    };
  }, [data, debounceMs]);

  const buildNow = useCallback(async () => {
    const result = await buildCVPdfBlob(latest.current);
    runId.current++;
    setBlob(result);
    setError(null);
    setIsBuilding(false);
    return result;
  }, []);

  return { blob, isBuilding, error, buildNow };
}
