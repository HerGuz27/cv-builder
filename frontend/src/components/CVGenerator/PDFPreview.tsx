import React, { useEffect, useRef, useState } from "react";
import { pdfjsLib } from "../../services/pdf";

interface PDFPreviewProps {
  /** El mismo blob que se descarga. */
  blob: Blob | null;
  /** Hay cambios del editor aún no reflejados en `blob`. */
  isBuilding?: boolean;
  error?: string | null;
  className?: string;
}

/**
 * Muestra el PDF real, rasterizado con pdf.js.
 * No es una aproximación en HTML del PDF: son los mismos bytes que se descargan,
 * así que márgenes, tipografía, espaciado y saltos de página son idénticos.
 */
export const PDFPreview: React.FC<PDFPreviewProps> = ({ blob, isBuilding, error, className }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [numPages, setNumPages] = useState(0);
  const [hasRendered, setHasRendered] = useState(false);

  // Ancho disponible: el PDF se escala para ocupar la columna sin recortarse.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width ?? 0;
      // Umbral para no re-rasterizar por diferencias de sub-píxel.
      setWidth((prev) => (Math.abs(prev - next) > 1 ? next : prev));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!blob || width <= 0) return;

    let cancelled = false;
    let doc: Awaited<ReturnType<typeof pdfjsLib.getDocument>["promise"]> | null = null;

    const render = async () => {
      try {
        const bytes = new Uint8Array(await blob.arrayBuffer());
        doc = await pdfjsLib.getDocument({ data: bytes }).promise;
        if (cancelled) return;

        // Renderiza fuera del DOM y recién al final reemplaza lo visible,
        // para que el preview nunca parpadee en blanco mientras se escribe.
        const fragment = document.createDocumentFragment();
        const available = Math.max(width - 32, 120); // margen para la sombra
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
          const page = await doc.getPage(pageNum);
          const base = page.getViewport({ scale: 1 });
          const cssScale = available / base.width;
          const viewport = page.getViewport({ scale: cssScale * dpr });

          const canvas = document.createElement("canvas");
          canvas.width = Math.floor(viewport.width);
          canvas.height = Math.floor(viewport.height);
          canvas.style.width = `${Math.floor(base.width * cssScale)}px`;
          canvas.style.height = `${Math.floor(base.height * cssScale)}px`;
          canvas.style.display = "block";
          canvas.style.backgroundColor = "#ffffff";
          canvas.className = "shadow-md";

          const context = canvas.getContext("2d");
          if (!context) continue;

          await page.render({ canvasContext: context, viewport }).promise;
          page.cleanup();
          if (cancelled) return;

          const wrapper = document.createElement("div");
          wrapper.style.display = "flex";
          wrapper.style.justifyContent = "center";
          wrapper.style.marginBottom = "16px";
          wrapper.appendChild(canvas);
          fragment.appendChild(wrapper);
        }

        if (cancelled) return;
        pagesRef.current?.replaceChildren(fragment);
        setNumPages(doc.numPages);
        setHasRendered(true);
      } catch (err) {
        if (!cancelled) console.error("Error mostrando el PDF:", err);
      }
    };

    render();

    return () => {
      cancelled = true;
      doc?.destroy();
    };
  }, [blob, width]);

  return (
    <div className={`flex flex-col bg-surface ${className ?? ""}`}>
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b-2 border-divider">
        <span className="lbl">Vista previa (PDF real)</span>
        <span className="flex items-center gap-3 text-xs text-muted">
          {numPages > 0 && <span>{numPages === 1 ? "1 página" : `${numPages} páginas`}</span>}
          {isBuilding && (
            <span className="flex items-center gap-1.5 text-accent-700">
              <span className="h-1.5 w-1.5 bg-accent animate-pulse" />
              Actualizando
            </span>
          )}
        </span>
      </div>

      {error && (
        <div className="bg-accent-100 text-accent-800 text-sm px-4 py-2 border-b-2 border-accent">{error}</div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-scroll p-4">
        <div ref={pagesRef} />
        {!hasRendered && (
          <div className="flex items-center justify-center py-20 text-sm text-muted">Generando PDF…</div>
        )}
      </div>
    </div>
  );
};
