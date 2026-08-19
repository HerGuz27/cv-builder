import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { CVData, CVTemplate } from "../../types/cv";
import { HarvardTemplate } from "../CVTemplates/HarvardTemplate";
import { HarvardPDF } from "../CVTemplates/HarvardPDF";

// Force recompile

interface CVBuilderProps {
  data: CVData;
}

export const CVBuilder: React.FC<CVBuilderProps> = ({ data }) => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>("harvard");

  const templates: { value: CVTemplate; label: string; available: boolean }[] = [
    { value: "harvard", label: "Harvard", available: true },
    { value: "modern", label: "Modern", available: false },
    { value: "ats-friendly", label: "ATS Friendly", available: false },
  ];

  const fileName = `cv-${data.personal.nombre.toLowerCase().replace(/\s+/g, "-")}.pdf`;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Mi CV</h1>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Volver a la pantalla principal"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Atrás
            </button>
          </div>

          {/* Template Selector */}
          <div className="flex gap-4 items-end flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona un template:
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as CVTemplate)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {templates.map((t) => (
                  <option key={t.value} value={t.value} disabled={!t.available}>
                    {t.label} {!t.available && "(Próximamente)"}
                  </option>
                ))}
              </select>
            </div>

            {/* Download Button */}
            {selectedTemplate === "harvard" ? (
              <PDFDownloadLink
                document={<HarvardPDF data={data} />}
                fileName={fileName}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 no-underline"
              >
                {({ blob, url, loading, error }) =>
                  loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generando PDF...
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Descargar PDF
                    </>
                  )
                }
              </PDFDownloadLink>
            ) : (
              <button disabled className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Próximamente
              </button>
            )}
          </div>
        </div>

        {/* CV Preview */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-0" style={{ backgroundColor: "white" }}>
            {selectedTemplate === "harvard" && <HarvardTemplate data={data} />}
            {/* Templates futuros se agregarían aquí */}
            {!["harvard"].includes(selectedTemplate) && (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg">Template "{selectedTemplate}" próximamente disponible</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
          <p>
            💡 <strong>Consejo:</strong> El PDF se genera con la librería react-pdf para máxima calidad profesional. Texto nítido, searchable y totalmente editable.
          </p>
        </div>
      </div>
    </div>
  );
};
