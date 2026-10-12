import { useState } from "react";
import type { JobApplication, MatchResult } from "../services/types";
import { saveApplication } from "../services/storage";
import { matchBarClass } from "./MatchResult";

interface SaveApplicationFormProps {
  titulo: string;
  url: string;
  porcentajeMatch: number;
  matchResult: MatchResult;
  jobDescription: string;
  cvFileName: string;
  onSaved: () => void;
  onCancel: () => void;
}

export default function SaveApplicationForm({
  titulo: initialTitulo,
  url: initialUrl,
  porcentajeMatch,
  matchResult,
  jobDescription,
  cvFileName,
  onSaved,
  onCancel,
}: SaveApplicationFormProps) {
  const [titulo, setTitulo] = useState(initialTitulo);
  const [url, setUrl] = useState(initialUrl);
  const [empresa, setEmpresa] = useState("");
  const [estado, setEstado] = useState<JobApplication["estado"]>("postulado");
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!titulo.trim()) return setError("El título es requerido");
    if (!url.trim()) return setError("La URL es requerida");
    if (!empresa.trim()) return setError("La empresa es requerida");

    setLoading(true);
    setError("");

    try {
      await saveApplication(
        titulo,
        empresa.trim(),
        url,
        estado,
        porcentajeMatch,
        jobDescription,
        cvFileName,
        matchResult,
        notas.trim() || undefined
      );
      onSaved();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al guardar la postulación"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface border-2 border-divider p-4 sm:p-6">
      <div className="lbl mb-2">Historial</div>
      <h3 className="text-lg mb-4">Guardar esta postulación</h3>

      <div className="space-y-4">
        <div>
          <label className="field-label">Título *</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Senior Frontend Developer"
            className="input"
          />
        </div>

        <div>
          <label className="field-label">Empresa *</label>
          <input
            type="text"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            placeholder="Nombre de la empresa"
            className="input"
          />
        </div>

        <div>
          <label className="field-label">URL *</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Ej: https://linkedin.com/jobs/..."
            className="input"
          />
        </div>

        <div>
          <label className="field-label">Match: {porcentajeMatch}%</label>
          <div className="w-full bg-neutral-300 h-2">
            <div
              className={`h-2 ${matchBarClass(porcentajeMatch)}`}
              style={{ width: `${porcentajeMatch}%` }}
            />
          </div>
        </div>

        <div>
          <label className="field-label">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value as JobApplication["estado"])}
            className="input"
          >
            <option value="postulado">Postulado</option>
            <option value="entrevista">En entrevista</option>
            <option value="rechazado">Rechazado</option>
            <option value="oferta">Oferta recibida</option>
          </select>
        </div>

        <div>
          <label className="field-label">Notas</label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Notas sobre la postulación (opcional)"
            className="input h-24"
          />
        </div>

        {error && (
          <div className="bg-accent-100 text-accent-800 text-sm px-3 py-2 border border-accent-300">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={loading || !titulo.trim() || !url.trim() || !empresa.trim()}
            className="btn btn-primary flex-1"
          >
            {loading ? "Guardando..." : "Guardar Postulación"}
          </button>
          <button onClick={onCancel} disabled={loading} className="btn btn-secondary flex-1">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
