import React, { useRef, useState } from "react";
import { PersonalInfo } from "../../../types/cv";
import { fileToSquareDataUrl, getIniciales, PhotoError } from "../../../utils/photo";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

interface PersonalInfoEditorProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  /** La plantilla activa muestra foto: si no, el uploader se explica como opcional. */
  usaFoto?: boolean;
}

export const PersonalInfoEditor: React.FC<PersonalInfoEditorProps> = ({ data, onChange, usaFoto = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fotoError, setFotoError] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleFoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Se limpia siempre: si no, elegir el mismo archivo dos veces no dispara change.
    event.target.value = "";
    if (!file) return;

    setFotoError(null);
    setProcesando(true);
    try {
      onChange({ ...data, foto: await fileToSquareDataUrl(file) });
    } catch (err) {
      setFotoError(err instanceof PhotoError ? err.message : "No se pudo procesar la imagen.");
    } finally {
      setProcesando(false);
    }
  };

  const quitarFoto = () => {
    setFotoError(null);
    onChange({ ...data, foto: undefined });
  };

  return (
    <div className="space-y-4">
      {/* Foto de perfil */}
      <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
        <div className="h-24 w-24 shrink-0 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
          {data.foto ? (
            <img src={data.foto} alt="Foto de perfil" className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-gray-400">
              {getIniciales(data.nombre) || <PersonOutlinedIcon sx={{ fontSize: 44 }} />}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-700">Foto de perfil</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {usaFoto
              ? "Se recorta en cuadrado y se muestra en un círculo. JPG o PNG."
              : "La plantilla elegida no muestra foto. Cargala igual si pensás cambiar a una que sí."}
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={procesando}
              className="px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {procesando ? "Procesando…" : data.foto ? "Cambiar foto" : "Subir foto"}
            </button>
            {data.foto && (
              <button
                type="button"
                onClick={quitarFoto}
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Quitar
              </button>
            )}
          </div>

          {fotoError && <p className="text-xs text-red-600 mt-2">{fotoError}</p>}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFoto}
            className="hidden"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          type="text"
          value={data.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título profesional (opcional)
        </label>
        <input
          type="text"
          value={data.titulo || ""}
          onChange={(e) => handleChange("titulo", e.target.value)}
          placeholder="Lic. en Administración"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Aparece debajo de tu nombre, arriba de todo.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
        <input
          type="text"
          value={data.ubicacion}
          onChange={(e) => handleChange("ubicacion", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
        <input
          type="tel"
          value={data.telefono}
          onChange={(e) => handleChange("telefono", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn (opcional)</label>
        <input
          type="text"
          value={data.linkedin || ""}
          onChange={(e) => handleChange("linkedin", e.target.value)}
          placeholder="linkedin.com/in/usuario"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">GitHub (opcional)</label>
        <input
          type="text"
          value={data.github || ""}
          onChange={(e) => handleChange("github", e.target.value)}
          placeholder="github.com/usuario"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio (opcional)</label>
        <input
          type="text"
          value={data.portfolio || ""}
          onChange={(e) => handleChange("portfolio", e.target.value)}
          placeholder="usuario.dev"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};
