import { useState } from "react";
import { extractTextFromPDF } from "../services/pdf";
import { analyzeJobMatch } from "../services/claude";
import type { MatchResult } from "../services/types";
import { hasQuota, consume, getRemaining, FREE_MONTHLY_LIMIT } from "../services/quota";
import MatchResultDisplay from "./MatchResult";
import SaveApplicationForm from "./SaveApplicationForm";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

export default function ATSForm() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [remaining, setRemaining] = useState(getRemaining());

  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
      setError("");
    } else {
      setError("Por favor seleccioná un archivo PDF válido");
      setCvFile(null);
    }
  };

  const handleAnalyze = async () => {
    if (!cvFile || !jobDescription.trim()) {
      setError("Completá el CV y la descripción del puesto");
      return;
    }

    if (!hasQuota()) {
      setError(
        `Llegaste al límite de ${FREE_MONTHLY_LIMIT} análisis del plan gratuito este mes.`
      );
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const cvText = await extractTextFromPDF(cvFile);

      if (cvText.trim().length < 50) {
        throw new Error(
          "No se pudo leer texto del PDF. ¿Es un PDF escaneado (imagen)?"
        );
      }

      const matchResult = await analyzeJobMatch(cvText, jobDescription);

      consume();
      setRemaining(getRemaining());
      setResult(matchResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al analizar el CV");
    } finally {
      setLoading(false);
    }
  };

  const handleSaved = () => {
    // Reset form after saving
    setJobDescription("");
    setCvFile(null);
    setResult(null);
    alert("¡Postulación guardada con éxito!");
  };

  const handleCancelSave = () => {
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-baseline justify-between mb-6">
          <h1 className="text-3xl font-bold">Analizador de Match</h1>
          <span className="text-sm text-gray-500">
            {remaining}/{FREE_MONTHLY_LIMIT} análisis restantes
          </span>
        </div>

        <div className="space-y-6">
          {/* CV Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Tu CV (PDF)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
              <input
                type="file"
                accept=".pdf"
                onChange={handleCVUpload}
                className="hidden"
                id="cv-input"
              />
              <label
                htmlFor="cv-input"
                className="cursor-pointer text-blue-500 hover:underline"
              >
                {cvFile ? (
                  <span className="text-green-600 font-medium inline-flex items-center gap-1.5">
                    <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} />
                    {cvFile.name}
                  </span>
                ) : (
                  <span>Click para subir tu CV</span>
                )}
              </label>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Descripción del Puesto
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Pegá acá el aviso completo: requisitos, responsabilidades..."
              className="w-full h-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading || !cvFile || !jobDescription.trim()}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition"
          >
            {loading ? "Analizando..." : "Analizar Match"}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <>
          <MatchResultDisplay result={result} />
          <SaveApplicationForm
            titulo=""
            url=""
            porcentajeMatch={result.porcentajeMatch}
            matchResult={result}
            jobDescription={jobDescription}
            cvFileName={cvFile?.name || ""}
            onSaved={handleSaved}
            onCancel={handleCancelSave}
          />
        </>
      )}
    </div>
  );
}
