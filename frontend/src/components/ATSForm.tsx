import { useEffect, useState } from "react";
import { extractTextFromPDF } from "../services/pdf";
import { analyzeJobMatch } from "../services/claude";
import type { MatchResult } from "../services/types";
import { getRemaining, consume, FREE_MONTHLY_LIMIT } from "../services/quota";
import MatchResultDisplay from "./MatchResult";
import SaveApplicationForm from "./SaveApplicationForm";
import Spinner from "./auth/Spinner";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";

export default function ATSForm() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    getRemaining()
      .then(setRemaining)
      .catch(() => setRemaining(null));
  }, []);

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

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const left = await getRemaining();
      setRemaining(left);
      if (left <= 0) {
        throw new Error(
          `Llegaste al límite de ${FREE_MONTHLY_LIMIT} análisis del plan gratuito este mes.`
        );
      }

      const cvText = await extractTextFromPDF(cvFile);

      if (cvText.trim().length < 50) {
        throw new Error(
          "No se pudo leer texto del PDF. ¿Es un PDF escaneado (imagen)?"
        );
      }

      const matchResult = await analyzeJobMatch(cvText, jobDescription);

      await consume();
      setRemaining(await getRemaining());
      setResult(matchResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al analizar el CV");
    } finally {
      setLoading(false);
    }
  };

  const handleSaved = () => {
    setJobDescription("");
    setCvFile(null);
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-surface border-2 border-divider p-4 sm:p-6 mb-6">
        <div className="flex items-baseline justify-between gap-3 mb-6">
          <div>
            <div className="lbl mb-2">Analizador</div>
            <h1 className="text-2xl sm:text-3xl">Analizador de Match</h1>
          </div>
          {remaining !== null && (
            <span className="tag tag-neutral whitespace-nowrap">
              {remaining}/{FREE_MONTHLY_LIMIT} análisis restantes
            </span>
          )}
        </div>

        <div className="space-y-6">
          {/* CV Upload */}
          <div>
            <label className="field-label">Tu CV (PDF)</label>
            <div className="border-2 border-dashed border-divider p-6 text-center hover:bg-neutral-200 transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={handleCVUpload}
                className="hidden"
                id="cv-input"
              />
              <label htmlFor="cv-input" className="cursor-pointer inline-flex items-center gap-1.5 text-sm">
                {cvFile ? (
                  <span className="font-bold inline-flex items-center gap-1.5">
                    <CheckCircleOutlinedIcon className="text-accent-700" sx={{ fontSize: 18 }} />
                    {cvFile.name}
                  </span>
                ) : (
                  <span className="text-accent-700 font-bold inline-flex items-center gap-1.5">
                    <UploadFileOutlinedIcon sx={{ fontSize: 18 }} />
                    Subí tu CV
                  </span>
                )}
              </label>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="field-label">Descripción del Puesto</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Pegá acá el aviso completo: requisitos, responsabilidades..."
              className="input h-64"
            />
          </div>

          {error && (
            <div className="bg-accent-100 text-accent-800 text-sm px-3 py-2 border border-accent-300">
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || !cvFile || !jobDescription.trim()}
            className="btn btn-primary w-full"
          >
            {loading ? (
              <>
                <Spinner /> Analizando...
              </>
            ) : (
              "Analizar Match"
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          <MatchResultDisplay result={result} />
          <SaveApplicationForm
            titulo=""
            url=""
            porcentajeMatch={result.porcentajeMatch}
            matchResult={result}
            jobDescription={jobDescription}
            cvFileName={cvFile?.name || ""}
            onSaved={handleSaved}
            onCancel={() => setResult(null)}
          />
        </div>
      )}
    </div>
  );
}
