import { useState, useEffect } from "react";
import {
  getAllApplications,
  deleteApplication,
  updateApplication,
} from "../services/storage";
import type { JobApplication } from "../services/types";
import { matchTextClass } from "./MatchResult";
import Spinner from "./auth/Spinner";

const ESTADO_LABEL: Record<JobApplication["estado"], string> = {
  postulado: "Postulado",
  entrevista: "En entrevista",
  rechazado: "Rechazado",
  oferta: "Oferta recibida",
};

export default function MatchHistory() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState("");

  const loadApplications = async () => {
    try {
      setApplications(await getAllApplications());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el historial");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  // Ejecuta una mutación y recarga la lista, mostrando el error si falla.
  const mutate = async (action: () => Promise<void>) => {
    try {
      await action();
      await loadApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta postulación?")) {
      mutate(() => deleteApplication(id));
    }
  };

  const handleSaveNotes = (id: string) => {
    setEditingId(null);
    mutate(() => updateApplication(id, { notas: editingNotes }));
  };

  const handleChangeEstado = (id: string, estado: JobApplication["estado"]) =>
    mutate(() => updateApplication(id, { estado }));

  if (loading) {
    return (
      <div className="flex justify-center py-10 text-muted">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  return (
    <div>
      <div className="lbl mb-2">Historial</div>
      <h2 className="text-2xl mb-4">Mis Postulaciones</h2>

      {error && (
        <div className="bg-accent-100 text-accent-800 text-sm px-3 py-2 border border-accent-300 mb-4">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="bg-surface border-2 border-divider p-6 text-center text-sm text-muted">
          No hay postulaciones guardadas aún
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-surface border-2 border-divider p-4">
              <div className="flex justify-between items-start gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg">{app.titulo}</h3>
                  <p className="text-sm mb-1">{app.empresa}</p>
                  <p className="text-xs text-muted">
                    {new Date(app.fechaPostulacion).toLocaleDateString("es")} • CV: {app.cvFileName}
                  </p>
                  {app.url && (
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent-700 font-bold hover:underline"
                    >
                      Ver postulación
                    </a>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-2xl font-extrabold ${matchTextClass(app.porcentajeMatch)}`}>
                    {app.porcentajeMatch}%
                  </span>
                  <button onClick={() => handleDelete(app.id)} className="btn btn-ghost">
                    Eliminar
                  </button>
                </div>
              </div>

              <div className="mb-3 flex items-center gap-2">
                <label className="field-label !mb-0">Estado</label>
                <select
                  value={app.estado}
                  onChange={(e) => handleChangeEstado(app.id, e.target.value as JobApplication["estado"])}
                  className="input !w-auto"
                >
                  {Object.entries(ESTADO_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3 bg-ground border border-divider p-3 text-sm text-muted">
                {app.result.razonamiento}
              </div>

              <div className="border-t border-divider pt-3">
                {editingId === app.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                      placeholder="Añade notas sobre esta postulación..."
                      className="input"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleSaveNotes(app.id)} className="btn btn-primary">
                        Guardar
                      </button>
                      <button onClick={() => setEditingId(null)} className="btn btn-secondary">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {app.notas ? (
                      <p className="text-sm mb-2">
                        <strong>Notas:</strong> {app.notas}
                      </p>
                    ) : (
                      <p className="text-sm text-muted mb-2">Sin notas</p>
                    )}
                    <button
                      onClick={() => {
                        setEditingId(app.id);
                        setEditingNotes(app.notas || "");
                      }}
                      className="btn btn-ghost"
                    >
                      Editar notas
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
