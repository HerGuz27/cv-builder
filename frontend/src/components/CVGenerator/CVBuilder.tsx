import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { CVData, CVTemplate } from "../../types/cv";
import { HarvardTemplate } from "../CVTemplates/HarvardTemplate";
import { HarvardPDF } from "../CVTemplates/HarvardPDF";
import { CVEditor } from "./CVEditor";

interface CVBuilderProps {
  data: CVData;
}

export const CVBuilder: React.FC<CVBuilderProps> = ({ data: initialData }) => {
  const navigate = useNavigate();
  const [cvData, setCvData] = useState<CVData>(initialData);
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate>("harvard");
  const [showEditor, setShowEditor] = useState(true);

  const templates: { value: CVTemplate; label: string; available: boolean }[] = [
    { value: "harvard", label: "Harvard", available: true },
    { value: "modern", label: "Modern", available: false },
    { value: "ats-friendly", label: "ATS Friendly", available: false },
  ];

  const fileName = `cv-${cvData.personal.nombre.toLowerCase().replace(/\s+/g, "-")}.pdf`;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
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
            <h1 className="text-2xl font-bold text-gray-900">Mi CV</h1>
          </div>

          <div className="flex gap-3 items-center">
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value as CVTemplate)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {templates.map((t) => (
                <option key={t.value} value={t.value} disabled={!t.available}>
                  {t.label} {!t.available && "(Próximamente)"}
                </option>
              ))}
            </select>

            {selectedTemplate === "harvard" ? (
              <PDFDownloadLink
                document={<HarvardPDF data={cvData} />}
                fileName={fileName}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 no-underline text-sm"
              >
                {({ loading }) =>
                  loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generando...
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
              <button disabled className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed text-sm">
                Próximamente
              </button>
            )}

            <button
              onClick={() => setShowEditor(!showEditor)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {showEditor ? (
          <CVEditor data={cvData} onChange={setCvData} />
        ) : (
          <div className="py-8">
            {/* CV Preview */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-0" style={{ backgroundColor: "white" }}>
                {selectedTemplate === "harvard" && <HarvardTemplate data={cvData} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
