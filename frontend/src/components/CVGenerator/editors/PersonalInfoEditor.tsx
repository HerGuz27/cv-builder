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
      <div className="flex items-start gap-4 pb-4 border-b-2 border-divider">
        <div className="h-24 w-24 shrink-0 rounded-full overflow-hidden bg-surface border border-divider flex items-center justify-center">
          {data.foto ? (
            <img src={data.foto} alt="Foto de perfil" className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl font-extrabold text-muted">
              {getIniciales(data.nombre) || <PersonOutlinedIcon sx={{ fontSize: 44 }} />}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="field-label !mb-0">Foto de perfil</p>
          <p className="text-xs text-muted mt-0.5">
            {usaFoto
              ? "Se recorta en cuadrado y se muestra en un círculo. JPG o PNG."
              : "La plantilla elegida no muestra foto. Cargala igual si pensás cambiar a una que sí."}
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={procesando}
              className="btn btn-primary"
            >
              {procesando ? "Procesando…" : data.foto ? "Cambiar foto" : "Subir foto"}
            </button>
            {data.foto && (
              <button
                type="button"
                onClick={quitarFoto}
                className="btn btn-secondary"
              >
                Quitar
              </button>
            )}
          </div>

          {fotoError && <p className="text-xs text-accent-700 mt-2">{fotoError}</p>}

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
        <label className="field-label">Nombre</label>
        <input
          type="text"
          value={data.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
          className="input"
        />
      </div>

      <div>
        <label className="field-label">
          Título profesional (opcional)
        </label>
        <input
          type="text"
          value={data.titulo || ""}
          onChange={(e) => handleChange("titulo", e.target.value)}
          placeholder="Lic. en Administración"
          className="input"
        />
        <p className="text-xs text-muted mt-1">Aparece debajo de tu nombre, arriba de todo.</p>
      </div>

      <div>
        <label className="field-label">Ubicación</label>
        <input
          type="text"
          value={data.ubicacion}
          onChange={(e) => handleChange("ubicacion", e.target.value)}
          className="input"
        />
      </div>

      <div>
        <label className="field-label">Email</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="input"
        />
      </div>

      <div>
        <label className="field-label">Teléfono</label>
        <input
          type="tel"
          value={data.telefono}
          onChange={(e) => handleChange("telefono", e.target.value)}
          className="input"
        />
      </div>

      <div>
        <label className="field-label">LinkedIn (opcional)</label>
        <input
          type="text"
          value={data.linkedin || ""}
          onChange={(e) => handleChange("linkedin", e.target.value)}
          placeholder="linkedin.com/in/usuario"
          className="input"
        />
      </div>

      <div>
        <label className="field-label">GitHub (opcional)</label>
        <input
          type="text"
          value={data.github || ""}
          onChange={(e) => handleChange("github", e.target.value)}
          placeholder="github.com/usuario"
          className="input"
        />
      </div>

      <div>
        <label className="field-label">Portfolio (opcional)</label>
        <input
          type="text"
          value={data.portfolio || ""}
          onChange={(e) => handleChange("portfolio", e.target.value)}
          placeholder="usuario.dev"
          className="input"
        />
      </div>
    </div>
  );
};
