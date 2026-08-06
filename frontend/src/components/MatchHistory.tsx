import { useState, useEffect } from "react";
import { getAllMatches, deleteMatch, updateMatchNotes, SavedMatch } from "../services/storage";

export default function MatchHistory() {
  const [matches, setMatches] = useState<SavedMatch[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState("");

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = () => {
    setMatches(getAllMatches());
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este match?")) {
      deleteMatch(id);
      loadMatches();
    }
  };

  const handleSaveNotes = (id: string) => {
    updateMatchNotes(id, editingNotes);
    setEditingId(null);
    loadMatches();
  };

  if (matches.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500">
        No hay matches guardados aún
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Historial de Análisis</h2>
      <div className="space-y-4">
        {matches.map((match) => (
          <div key={match.id} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{match.jobTitle}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(match.createdAt).toLocaleDateString()} •{" "}
                  {match.cvFileName}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-bold ${
                  match.result.porcentajeMatch >= 80
                    ? "text-green-600"
                    : match.result.porcentajeMatch >= 60
                      ? "text-yellow-600"
                      : "text-orange-600"
                }`}>
                  {match.result.porcentajeMatch}%
                </span>
                <button
                  onClick={() => handleDelete(match.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>

            {/* Quick preview */}
            <div className="mb-3 bg-gray-50 p-3 rounded text-sm">
              <p className="text-gray-600">{match.result.razonamiento}</p>
            </div>

            {/* Notes Section */}
            <div className="border-t pt-3">
              {editingId === match.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="Añade notas sobre este match..."
                    className="w-full px-3 py-2 border rounded text-sm"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveNotes(match.id)}
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
                  {match.notes ? (
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Notas:</strong> {match.notes}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 mb-2">Sin notas</p>
                  )}
                  <button
                    onClick={() => {
                      setEditingId(match.id);
                      setEditingNotes(match.notes || "");
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
