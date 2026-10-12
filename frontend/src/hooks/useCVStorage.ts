import { useCallback, useEffect, useRef, useState } from "react";
import { CVData } from "../types/cv";

/**
 * Persistencia local del CV. Dos cosas distintas:
 *
 *  - el *borrador*: lo que hay en el editor ahora mismo, autoguardado en cada
 *    cambio para que recargar la página no borre el trabajo;
 *  - los *guardados*: copias con nombre que el usuario archiva a propósito,
 *    para arrancar un CV nuevo a partir de uno viejo.
 *
 * Todo va contra localStorage, que puede tirar (modo privado, sin cuota).
 * Ninguna falla de storage puede romper el editor.
 */

const DRAFT_KEY = "jobsearch.cv.draft.v1";
const SAVED_KEY = "jobsearch.cv.saved.v1";
const MAX_SAVED = 10;
const AUTOSAVE_MS = 600;

export interface SavedCV {
  id: string;
  nombre: string;
  updatedAt: string;
  data: CVData;
}

const isCVData = (value: unknown): value is CVData =>
  !!value && typeof value === "object" && "personal" in value && "experiencia" in value;

export const readDraft = (): CVData | null => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isCVData(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const readSaved = (): SavedCV[] => {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => isCVData(item?.data)) : [];
  } catch {
    return [];
  }
};

const writeSaved = (list: SavedCV[]) => {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(list));
  } catch {
    /* sin storage: los guardados viven sólo en memoria esta sesión */
  }
};

interface UseCVStorageResult {
  /** CVs archivados, del más reciente al más viejo. */
  saved: SavedCV[];
  /** Archiva una copia del CV actual. */
  save: (data: CVData) => void;
  /** Borra un CV archivado. */
  remove: (id: string) => void;
  /** `true` durante unos instantes después de cada autoguardado. */
  justSaved: boolean;
}

export function useCVStorage(data: CVData): UseCVStorageResult {
  const [saved, setSaved] = useState<SavedCV[]>(() => readSaved());
  const [justSaved, setJustSaved] = useState(false);

  // El primer render sólo refleja lo que ya estaba en storage: no lo reescribe.
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }

    const timer = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
        setJustSaved(true);
      } catch {
        /* sin storage: el editor sigue andando, sólo no persiste */
      }
    }, AUTOSAVE_MS);

    return () => clearTimeout(timer);
  }, [data]);

  // Apaga el cartelito de "guardado" un rato después de encenderlo.
  useEffect(() => {
    if (!justSaved) return;
    const timer = setTimeout(() => {
      setJustSaved(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [justSaved]);

  const save = useCallback((current: CVData) => {
    const entry: SavedCV = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      nombre: current.personal.nombre.trim() || "CV sin nombre",
      updatedAt: new Date().toISOString(),
      data: current,
    };

    setSaved((prev) => {
      const next = [entry, ...prev].slice(0, MAX_SAVED);
      writeSaved(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setSaved((prev) => {
      const next = prev.filter((item) => item.id !== id);
      writeSaved(next);
      return next;
    });
  }, []);

  return { saved, save, remove, justSaved };
}
