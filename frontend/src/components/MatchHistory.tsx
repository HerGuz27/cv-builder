import { useState, useEffect } from "react";
import {
  getAllApplications,
  deleteApplication,
  updateApplication,
} from "../services/storage";
import type { JobApplication } from "../services/types";

const getEstadoColor = (estado: string): string => {
  switch (estado) {
    case "postulado":
      return "bg-blue-100 text-blue-800";
    case "entrevista":
      return "bg-yellow-100 text-yellow-800";
    case "rechazado":
      return "bg-red-100 text-red-800";
    case "oferta":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getEstadoLabel = (estado: string): string => {
  switch (estado) {
    case "postulado":
      return "Postulado";
    case "entrevista":
      return "En entrevista";
    case "rechazado":
      return "Rechazado";
    case "oferta":
      return "Oferta recibida";
    default:
      return estado;
  }
};

export default function MatchHistory() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    setApplications(getAllApplications());
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta postulación?")) {
      deleteApplication(id);
      loadApplications();
    }
  };

  const handleSaveNotes = (id: string) => {
    updateApplication(id, { notas: editingNotes });
    setEditingId(null);
    loadApplications();
  };

  const handleChangeEstado = (id: string, nuevoEstado: string) => {
    updateApplication(id, {
      estado: nuevoEstado as
        | "postulado"
        | "entrevista"
        | "rechazado"
        | "oferta",
    });
    loadApplications();
  };

  if (applications.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500">
        No hay postulaciones guardadas aún
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Mis Postulaciones</h2>
      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{app.titulo}</h3>
                <p className="text-sm text-gray-600 mb-1">{app.empresa}</p>
                <p className="text-xs text-gray-500">
                  {new Date(app.fechaPostulacion).toLocaleDateString()} • CV:{" "}
                  {app.cvFileName}
                </p>
                {app.url && (
                  <a
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Ver postulación
                  </a>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`text-2xl font-bold ${
                    app.porcentajeMatch >= 80
                      ? "text-green-600"
                      : app.porcentajeMatch >= 60
                        ? "text-yellow-600"
                        : app.porcentajeMatch >= 40
                          ? "text-orange-600"
                          : "text-red-600"
                  }`}
                >
                  {app.porcentajeMatch}%
                </span>
                <button
                  onClick={() => handleDelete(app.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>

            {/* Estado */}
            <div className="mb-3 flex items-center gap-2">
              <span className="text-sm font-medium">Estado:</span>
              <select
                value={app.estado}
                onChange={(e) => handleChangeEstado(app.id, e.target.value)}
                className={`px-3 py-1 rounded text-sm font-medium cursor-pointer ${getEstadoColor(
                  app.estado
                )}`}
              >
                <option value="postulado">Postulado</option>
                <option value="entrevista">En entrevista</option>
                <option value="rechazado">Rechazado</option>
                <option value="oferta">Oferta recibida</option>
              </select>
            </div>

            {/* Quick preview */}
            <div className="mb-3 bg-gray-50 p-3 rounded text-sm">
              <p className="text-gray-600">{app.result.razonamiento}</p>
            </div>

            {/* Notes Section */}
            <div className="border-t pt-3">
              {editingId === app.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="Añade notas sobre esta postulación..."
                    className="w-full px-3 py-2 border rounded text-sm"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveNotes(app.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {app.notas ? (
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Notas:</strong> {app.notas}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 mb-2">Sin notas</p>
                  )}
                  <button
                    onClick={() => {
                      setEditingId(app.id);
                      setEditingNotes(app.notas || "");
                    }}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Editar notas
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
