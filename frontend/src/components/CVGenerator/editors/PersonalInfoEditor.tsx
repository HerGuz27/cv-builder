import React from "react";
import { PersonalInfo } from "../../../types/cv";

interface PersonalInfoEditorProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export const PersonalInfoEditor: React.FC<PersonalInfoEditorProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
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
