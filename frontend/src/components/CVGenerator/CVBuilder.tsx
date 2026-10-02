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

  const menuItemClass =
    "w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-4">
          {/* Title section - responsive size */}
          <div className="mb-3 sm:mb-0 flex items-start justify-between gap-2">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Creá tu CV</h1>
              <p className="hidden sm:block text-sm text-gray-500">
                Gratis, sin registro. Se guarda solo en tu navegador.
              </p>
            </div>
            {/* Mobile only: toggle editor button */}
            <button
              onClick={() => setShowEditor(!showEditor)}
              className={`sm:hidden px-3 py-1.5 rounded-lg font-semibold transition-colors text-xs flex-shrink-0 ${
                showEditor
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {showEditor ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {/* Action buttons - responsive layout */}
          <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-between">
            {/* Left side - stats */}
            <div className="flex gap-2 sm:gap-3 items-center">
              {totalCVs !== null && (
                <span className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-800 rounded-full text-xs sm:text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  {totalCVs.toLocaleString("es")} CVs creados
                </span>
              )}

              <span
                className={`text-xs sm:text-sm text-gray-400 transition-opacity ${
                  justSaved ? "opacity-100" : "opacity-0"
                }`}
              >
                Guardado
              </span>
            </div>

            {/* Right side - main actions */}
            <div className="flex gap-2 sm:gap-3 items-center flex-wrap justify-end">
              {/* Mis CVs */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((open) => !open)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex items-center gap-1 sm:gap-2"
                >
                  Mis CVs
                  <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <button className={menuItemClass} onClick={runFromMenu(() => save(cvData))}>
                      <SaveOutlinedIcon className="text-gray-400" sx={{ fontSize: 18 }} />
                      Guardar copia del CV actual
                    </button>
                    <button className={menuItemClass} onClick={runFromMenu(() => setCvData(mockCVData))}>
                      <AutoAwesomeOutlinedIcon className="text-gray-400" sx={{ fontSize: 18 }} />
                      Cargar CV de ejemplo
                    </button>
                    <button className={menuItemClass} onClick={runFromMenu(() => setCvData(emptyCVData))}>
                      <NoteAddOutlinedIcon className="text-gray-400" sx={{ fontSize: 18 }} />
                      Empezar de cero
                    </button>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Guardados
                      </p>

                      {saved.length === 0 ? (
                        <p className="px-4 py-2 text-sm text-gray-400">
                          Todavía no guardaste ninguno.
                        </p>
                      ) : (
                        <ul className="max-h-64 overflow-y-auto">
                          {saved.map((item) => (
                            <li key={item.id} className="flex items-center hover:bg-gray-100">
                              <button
                                onClick={runFromMenu(() => setCvData(item.data))}
                                className="flex-1 text-left px-4 py-2 min-w-0"
                              >
                                <span className="block text-sm text-gray-800 truncate">{item.nombre}</span>
                                <span className="block text-xs text-gray-400">{formatFecha(item.updatedAt)}</span>
                              </button>
                              <button
                                onClick={() => remove(item.id)}
                                className="px-3 py-2 text-gray-400 hover:text-red-600 transition-colors"
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
                className="px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="hidden sm:inline">Generando...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="hidden sm:inline">Descargar PDF</span>
                    <span className="sm:hidden">PDF</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowEditor(!showEditor)}
                className={`hidden sm:block px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                  showEditor
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {showEditor ? "Ocultar" : "Mostrar"} Editor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {showEditor ? (
          <CVEditor data={cvData} onChange={setCvData} pdfBlob={blob} isBuilding={isBuilding} pdfError={error} />
        ) : (
          <div className="py-6 px-4">
            <div className="max-w-3xl mx-auto">
              <PDFPreview
                blob={blob}
                isBuilding={isBuilding}
                error={error}
                className="h-[calc(100vh-140px)] rounded-lg shadow-lg overflow-hidden border-2 border-gray-200"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
