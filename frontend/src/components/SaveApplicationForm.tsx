import { useState } from "react";
import type { MatchResult } from "../services/types";
import { saveApplication } from "../services/storage";

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
  const [estado, setEstado] = useState<
    "postulado" | "entrevista" | "rechazado" | "oferta"
  >("postulado");
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!titulo.trim()) {
      setError("El título es requerido");
      return;
    }
    if (!url.trim()) {
      setError("La URL es requerida");
      return;
    }
    if (!empresa.trim()) {
      setError("La empresa es requerida");
      return;
    }

    setLoading(true);
    setError("");

    try {
      saveApplication(
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
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">Guardar esta postulación</h3>

      <div className="space-y-4">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Senior Frontend Developer"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Empresa */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Empresa <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
            placeholder="Nombre de la empresa"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* URL */}
        <div>
          <label className="block text-sm font-medium mb-2">
            URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Ej: https://linkedin.com/jobs/..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Match % (read-only) */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Match: {porcentajeMatch}%
          </label>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                porcentajeMatch >= 80
                  ? "bg-green-500"
                  : porcentajeMatch >= 60
                    ? "bg-yellow-500"
                    : porcentajeMatch >= 40
                      ? "bg-orange-500"
                      : "bg-red-500"
              }`}
              style={{ width: `${porcentajeMatch}%` }}
            ></div>
          </div>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium mb-2">Estado</label>
          <select
            value={estado}
            onChange={(e) =>
              setEstado(
                e.target.value as
                  | "postulado"
                  | "entrevista"
                  | "rechazado"
                  | "oferta"
              )
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="postulado">Postulado</option>
            <option value="entrevista">En entrevista</option>
            <option value="rechazado">Rechazado</option>
            <option value="oferta">Oferta recibida</option>
          </select>
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium mb-2">Notas</label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Notas sobre la postulación (opcional)"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={loading || !titulo.trim() || !url.trim() || !empresa.trim()}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition"
          >
            {loading ? "Guardando..." : "Guardar Postulación"}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 disabled:cursor-not-allowed font-medium transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
