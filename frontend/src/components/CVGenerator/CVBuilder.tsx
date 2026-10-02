import React, { useEffect, useRef, useState } from "react";
import { CVData } from "../../types/cv";
import { useCVPdf } from "../../hooks/useCVPdf";
import { useCVStorage } from "../../hooks/useCVStorage";
import { getTotalCVs, registerCVCreated } from "../../services/cvStats";
import { mockCVData } from "../../data/mockCV";
import { emptyCVData } from "../../data/emptyCV";
import { CVEditor } from "./CVEditor";
import { PDFPreview } from "./PDFPreview";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import CloseIcon from "@mui/icons-material/Close";

interface CVBuilderProps {
  data: CVData;
}

const formatFecha = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleDateString("es", { day: "2-digit", month: "short" }) +
    " " +
    date.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
};

export const CVBuilder: React.FC<CVBuilderProps> = ({ data: initialData }) => {
  const [cvData, setCvData] = useState<CVData>(initialData);
  const [showEditor, setShowEditor] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [totalCVs, setTotalCVs] = useState<number | null>(null);

  const renderCount = useRef(0);
  renderCount.current++;
  console.log(
    "[CVBuilder] render #",
    renderCount.current,
    "cvData.personal.nombre:",
    cvData.personal.nombre
  );

  const menuRef = useRef<HTMLDivElement>(null);

  const { blob, isBuilding, error, buildNow } = useCVPdf(cvData);
  const { saved, save, remove, justSaved } = useCVStorage(cvData);

  // Contador global. Si no se puede leer queda oculto: es decorativo.
  useEffect(() => {
    let cancelled = false;
    getTotalCVs().then((total) => {
      if (!cancelled && total !== null) setTotalCVs(total);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Cierra el menú al hacer click afuera.
  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  const fileName = cvData.personal.nombre.trim()
    ? `cv-${cvData.personal.nombre.toLowerCase().trim().replace(/\s+/g, "-")}.pdf`
    : "cv.pdf";

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      // Regenera con los datos actuales para no bajar una versión atrasada
      // por el debounce del preview. Mismo documento, mismos bytes.
      const pdfBlob = await buildNow();

      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      // Descargar es la señal de "CV terminado". El contador no debe
      // hacer fallar la descarga si Supabase no responde.
      const nuevoTotal = await registerCVCreated(cvData);
      if (nuevoTotal !== null) setTotalCVs(nuevoTotal);
    } catch (err) {
      console.error("Error generating PDF:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const runFromMenu = (action: () => void) => () => {
    action();
    setMenuOpen(false);
  };

  const menuItemClass = "menu-item";

  return (
    <div className="min-h-screen bg-ground">
      {/* Header */}
      <div className="bg-ground border-b-2 border-divider sticky top-0 z-50">
        <div className="max-w-[1760px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          {/* Marca + título */}
          <div className="flex items-baseline gap-3 min-w-0 mr-auto">
            <span className="text-lg font-extrabold font-sans tracking-tight">Nexocv</span>
            <span className="hidden md:block text-xs text-muted truncate">
              Creá tu CV · Gratis, sin registro. Se guarda solo en tu navegador.
            </span>
          </div>

          {totalCVs !== null && (
            <span className="hidden lg:inline-flex tag tag-neutral">
              {totalCVs.toLocaleString("es")} CVs creados
            </span>
          )}

          <span
            className={`text-xs text-muted transition-opacity ${justSaved ? "opacity-100" : "opacity-0"}`}
          >
            Guardado
          </span>

          {/* Acciones */}
          <div className="flex gap-2 items-center">
            {/* Mis CVs */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((open) => !open)}
                className="btn btn-secondary"
              >
                Mis CVs
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-surface shadow-md border-2 border-divider py-2 z-50">
                  <button className={menuItemClass} onClick={runFromMenu(() => save(cvData))}>
                    <SaveOutlinedIcon className="text-muted" sx={{ fontSize: 18 }} />
                    Guardar copia del CV actual
                  </button>
                  <button className={menuItemClass} onClick={runFromMenu(() => setCvData(mockCVData))}>
                    <AutoAwesomeOutlinedIcon className="text-muted" sx={{ fontSize: 18 }} />
                    Cargar CV de ejemplo
                  </button>
                  <button className={menuItemClass} onClick={runFromMenu(() => setCvData(emptyCVData))}>
                    <NoteAddOutlinedIcon className="text-muted" sx={{ fontSize: 18 }} />
                    Empezar de cero
                  </button>

                  <div className="border-t-2 border-divider mt-2 pt-3">
                    <p className="lbl px-4 pb-2">Guardados</p>

                    {saved.length === 0 ? (
                      <p className="px-4 py-2 text-sm text-muted">Todavía no guardaste ninguno.</p>
                    ) : (
                      <ul className="max-h-64 overflow-y-auto">
                        {saved.map((item) => (
                          <li key={item.id} className="flex items-center hover:bg-neutral-200">
                            <button
                              onClick={runFromMenu(() => setCvData(item.data))}
                              className="flex-1 text-left px-4 py-2 min-w-0"
                            >
                              <span className="block text-sm truncate">{item.nombre}</span>
                              <span className="block text-xs text-muted">{formatFecha(item.updatedAt)}</span>
                            </button>
                            <button
                              onClick={() => remove(item.id)}
                              className="px-3 py-2 text-muted hover:text-accent-700 transition-colors"
                                title="Borrar"
                                aria-label={`Borrar ${item.nombre}`}
                              >
                                <CloseIcon sx={{ fontSize: 18 }} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="btn btn-primary"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="hidden sm:inline">Generando...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="hidden sm:inline">Descargar PDF</span>
                    <span className="sm:hidden">PDF</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowEditor(!showEditor)}
                className="btn btn-secondary"
              >
                {showEditor ? "Ocultar" : "Mostrar"}
                <span className="hidden sm:inline"> Editor</span>
              </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1760px] mx-auto">
        {showEditor ? (
          <CVEditor data={cvData} onChange={setCvData} pdfBlob={blob} isBuilding={isBuilding} pdfError={error} />
        ) : (
          <div className="py-6 px-4">
            <div className="max-w-3xl mx-auto">
              <PDFPreview
                blob={blob}
                isBuilding={isBuilding}
                error={error}
                className="h-[calc(100vh-140px)] overflow-hidden border-2 border-divider"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
