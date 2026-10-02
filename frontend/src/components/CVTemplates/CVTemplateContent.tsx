import React from "react";
import { CVData } from "../../types/cv";

interface CVTemplateContentProps {
  data: CVData;
}

export const CVTemplateContent: React.FC<CVTemplateContentProps> = ({ data }) => {
  return (
    <div
      style={{
        fontFamily: "Calibri, Arial, sans-serif",
        fontSize: "11px",
        lineHeight: "1.3",
        color: "#000",
        backgroundColor: "#ffffff",
        padding: "16mm",
        width: "8.5in",
        height: "11in",
        margin: "0",
        boxSizing: "border-box",
        pageBreakAfter: "always",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", borderBottom: "1px solid #000", paddingBottom: "8px", marginBottom: "8px" }}>
        <h1 style={{ fontSize: "18px", fontWeight: "bold", margin: "0", marginBottom: "2px" }}>
          {data.personal.nombre}
        </h1>
        <p style={{ fontSize: "10px", margin: "2px 0", color: "#333" }}>{data.personal.ubicacion}</p>
        <p style={{ fontSize: "9px", margin: "1px 0", color: "#333" }}>
          <a href={`mailto:${data.personal.email}`} style={{ textDecoration: "none", color: "#000" }}>
            {data.personal.email}
          </a>
          {" • "}
          {data.personal.telefono}
          {data.personal.linkedin && (
            <>
              {" • "}
              <a href={`https://${data.personal.linkedin}`} style={{ textDecoration: "none", color: "#000" }}>
                LinkedIn
              </a>
            </>
          )}
          {data.personal.github && (
            <>
              {" • "}
              <a href={`https://${data.personal.github}`} style={{ textDecoration: "none", color: "#000" }}>
                GitHub
              </a>
            </>
          )}
        </p>
      </div>

      {/* Resumen */}
      <div style={{ marginBottom: "6px" }}>
        <h2
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            borderBottom: "1px solid #000",
            paddingBottom: "2px",
            margin: "0 0 3px 0",
          }}
        >
          RESUMEN PROFESIONAL
        </h2>
        <p style={{ fontSize: "10px", margin: "0", lineHeight: "1.35" }}>{data.resumen}</p>
      </div>

      {/* Experiencia */}
      {data.experiencia && data.experiencia.length > 0 && (
        <div style={{ marginBottom: "6px" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              borderBottom: "1px solid #000",
              paddingBottom: "2px",
              margin: "0 0 3px 0",
            }}
          >
            EXPERIENCIA PROFESIONAL
          </h2>
          {data.experiencia.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1px" }}>
                <div>
                  <p style={{ fontWeight: "bold", fontSize: "11px", margin: "0" }}>{exp.empresa}</p>
                  <p style={{ fontStyle: "italic", fontSize: "10px", margin: "1px 0 0 0" }}>{exp.titulo}</p>
                </div>
                <p style={{ fontSize: "10px", margin: "0", whiteSpace: "nowrap", marginLeft: "8px" }}>
                  {exp.fechaInicio.substring(0, 7)} – {exp.fechaFin}
                </p>
              </div>
              {exp.ubicacion && <p style={{ fontSize: "9px", color: "#555", margin: "1px 0" }}>{exp.ubicacion}</p>}
              <ul style={{ fontSize: "10px", margin: "2px 0 0 0", paddingLeft: "16px", lineHeight: "1.3" }}>
                {exp.descripcion.map((desc, i) => (
                  <li key={i} style={{ margin: "1px 0" }}>
                    {desc}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Educación */}
      {data.educacion && data.educacion.length > 0 && (
        <div style={{ marginBottom: "6px" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              borderBottom: "1px solid #000",
              paddingBottom: "2px",
              margin: "0 0 3px 0",
            }}
          >
            EDUCACIÓN
          </h2>
          {data.educacion.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: "3px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1px" }}>
                <div>
                  <p style={{ fontWeight: "bold", fontSize: "11px", margin: "0" }}>{edu.institucion}</p>
                  <p style={{ fontSize: "10px", margin: "1px 0 0 0" }}>{edu.titulo}</p>
                </div>
                <p style={{ fontSize: "10px", margin: "0", whiteSpace: "nowrap", marginLeft: "8px" }}>
                  {edu.fechaInicio} – {edu.fechaFin}
                </p>
              </div>
              {edu.ubicacion && <p style={{ fontSize: "9px", color: "#555", margin: "1px 0" }}>{edu.ubicacion}</p>}
              {edu.promedio && <p style={{ fontSize: "9px", color: "#555", margin: "1px 0" }}>Promedio: {edu.promedio}</p>}
              {edu.descripcion && <p style={{ fontSize: "9px", color: "#555", margin: "1px 0" }}>{edu.descripcion}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Certificaciones */}
      {data.certificaciones && data.certificaciones.length > 0 && (
        <div style={{ marginBottom: "6px" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              borderBottom: "1px solid #000",
              paddingBottom: "2px",
              margin: "0 0 3px 0",
            }}
          >
            CERTIFICACIONES
          </h2>
          {data.certificaciones.map((cert, idx) => (
            <div key={idx} style={{ marginBottom: "2px" }}>
              <p style={{ fontWeight: "bold", fontSize: "10px", margin: "0" }}>{cert.nombre}</p>
              <p style={{ fontSize: "9px", color: "#555", margin: "1px 0 0 0" }}>
                {cert.emisor} • {cert.fecha}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && Object.keys(data.skills).length > 0 && (
        <div style={{ marginBottom: "6px" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              borderBottom: "1px solid #000",
              paddingBottom: "2px",
              margin: "0 0 3px 0",
            }}
          >
            HABILIDADES
          </h2>
          {Object.entries(data.skills).map(([categoria, skills]) => (
            <div key={categoria} style={{ marginBottom: "2px" }}>
              <p style={{ fontWeight: "bold", fontSize: "10px", margin: "0" }}>{categoria}:</p>
              <p style={{ fontSize: "10px", margin: "1px 0 0 0", marginLeft: "12px" }}>{skills.join(", ")}</p>
            </div>
          ))}
        </div>
      )}

      {/* Proyectos */}
      {data.proyectos && data.proyectos.length > 0 && (
        <div style={{ marginBottom: "6px" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              borderBottom: "1px solid #000",
              paddingBottom: "2px",
              margin: "0 0 3px 0",
            }}
          >
            PROYECTOS
          </h2>
          {data.proyectos.map((proyecto, idx) => (
            <div key={idx} style={{ marginBottom: "3px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1px" }}>
                <p style={{ fontWeight: "bold", fontSize: "11px", margin: "0" }}>{proyecto.nombre}</p>
                <p style={{ fontSize: "10px", margin: "0", whiteSpace: "nowrap", marginLeft: "8px" }}>{proyecto.fecha}</p>
              </div>
              <p style={{ fontSize: "10px", margin: "1px 0", lineHeight: "1.3" }}>{proyecto.descripcion}</p>
              <p style={{ fontSize: "9px", color: "#555", margin: "1px 0 0 0" }}>
                <span style={{ fontWeight: "bold" }}>Tecnologías: </span>
                {proyecto.tecnologias.join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
