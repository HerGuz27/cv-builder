import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { extractTextFromPDF } from "../services/pdf";
import { AnalysisError, analyzeJobMatch } from "../services/claude";
import type { MatchResult } from "../services/types";
import { getCredits, getRemaining, FREE_MONTHLY_LIMIT } from "../services/quota";
import MatchResultDisplay from "./MatchResult";
import SaveApplicationForm from "./SaveApplicationForm";
import Spinner from "./auth/Spinner";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";

// Mismos topes que aplica la Edge Function job-ats; acá solo se avisa antes de enviar.
const MAX_CV_CHARS = 20000;
const MAX_JOB_CHARS = 10000;

export default function ATSForm() {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  // Sin cuota gratuita ni créditos: se muestra el botón para comprar.
  const [noCredits, setNoCredits] = useState(false);

  const refreshUsage = async () => {
    // Si no se pueden leer los créditos no se bloquea: el servidor decide igual.
    const [left, balance] = await Promise.all([getRemaining(), getCredits().catch(() => null)]);
    setRemaining(left);
    setCredits(balance);
    return { left, balance };
  };

  useEffect(() => {
    refreshUsage().catch(() => {
      setRemaining(null);
      setCredits(null);
    });
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
    setNoCredits(false);
    setResult(null);

    try {
      const { left, balance } = await refreshUsage();
      if (left <= 0 && balance === 0) {
        throw new AnalysisError(
          `Llegaste al límite de ${FREE_MONTHLY_LIMIT} análisis gratis este mes y no tenés créditos.`,
          "NO_CREDITS"
        );
      }

      const cvText = await extractTextFromPDF(cvFile);

      if (cvText.trim().length < 50) {
        throw new Error(
          "No se pudo leer texto del PDF. ¿Es un PDF escaneado (imagen)?"
        );
      }

      if (cvText.length > MAX_CV_CHARS) {
        throw new Error(
          `Tu CV es demasiado largo (máximo ${MAX_CV_CHARS.toLocaleString("es")} caracteres de texto).`
        );
      }

      const matchResult = await analyzeJobMatch(cvText, jobDescription);
      await refreshUsage().catch(() => {});
      setResult(matchResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al analizar el CV");
      setNoCredits(err instanceof AnalysisError && err.code === "NO_CREDITS");
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
            <div className="flex flex-wrap justify-end gap-2">
              <span className="tag tag-neutral whitespace-nowrap">
                {remaining}/{FREE_MONTHLY_LIMIT} gratis este mes
              </span>
              {credits !== null && (
                <Link to="/pricing" className="tag tag-outline whitespace-nowrap">
                  {credits} créditos
                </Link>
              )}
            </div>
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
              maxLength={MAX_JOB_CHARS}
              placeholder="Pegá acá el aviso completo: requisitos, responsabilidades..."
              className="input h-64"
            />
            <div className="text-xs text-muted text-right mt-1">
              {jobDescription.length.toLocaleString("es")}/{MAX_JOB_CHARS.toLocaleString("es")}
            </div>
          </div>

          {error && (
            <div className="bg-accent-100 text-accent-800 text-sm px-3 py-2 border border-accent-300 flex flex-wrap items-center justify-between gap-2">
              <span>{error}</span>
              {noCredits && (
                <Link to="/pricing" className="btn btn-primary">
                  Comprar créditos
                </Link>
              )}
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
