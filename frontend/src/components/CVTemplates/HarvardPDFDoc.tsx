import React from "react";
import { Document, Page, Text, View, Link, StyleSheet, Font } from "@react-pdf/renderer";
import { CVData } from "../../types/cv";

/**
 * Fuente única de verdad del CV.
 * Todo — preview y descarga — se renderiza desde este documento.
 * No existe ninguna versión HTML paralela del template.
 */

// react-pdf corta palabras con guiones por defecto; en español queda mal.
Font.registerHyphenationCallback((word) => [word]);

// Medidas en puntos (1in = 72pt). Página LETTER = 612 x 792pt.
const MARGIN = 43.2; // 0.6in — dentro del rango profesional 0.5–0.7in

const styles = StyleSheet.create({
  page: {
    paddingTop: MARGIN,
    paddingBottom: MARGIN,
    paddingHorizontal: MARGIN,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    lineHeight: 1.35,
    color: "#000000",
    backgroundColor: "#ffffff",
  },

  // Encabezado
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    borderBottomStyle: "solid",
    paddingBottom: 6,
    marginBottom: 4,
  },
  nombre: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    letterSpacing: 0.5,
    textAlign: "center",
    marginBottom: 3,
  },
  ubicacion: { fontSize: 9, textAlign: "center", color: "#333333" },
  contacto: { fontSize: 9, textAlign: "center", color: "#333333", marginTop: 2 },
  link: { color: "#000000", textDecoration: "none" },

  // Secciones
  section: { marginTop: 9 },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    borderBottomStyle: "solid",
    paddingBottom: 2,
    marginBottom: 4,
  },

  // Entradas (experiencia / educación / proyectos)
  entry: { marginBottom: 6 },
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  entryMain: { flex: 1, paddingRight: 10 },
  entryTitle: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  entrySubtitle: { fontFamily: "Helvetica-Oblique", fontSize: 9.5, marginTop: 1 },
  entryPlain: { fontSize: 9.5, marginTop: 1 },
  entryDate: { fontSize: 9.5 },
  meta: { fontSize: 8.5, color: "#555555", marginTop: 1 },

  // Viñetas
  bulletRow: { flexDirection: "row", marginTop: 2 },
  bulletDot: { width: 10, fontSize: 9.5 },
  bulletText: { flex: 1, fontSize: 9.5 },

  // Skills
  skillRow: { flexDirection: "row", marginBottom: 2 },
  skillCat: { fontFamily: "Helvetica-Bold", fontSize: 9.5 },
  skillList: { flex: 1, fontSize: 9.5 },
});

/** "2023-05" -> "2023-05"; recorta cualquier día sobrante. */
const formatMonth = (value?: string) => (value ? value.substring(0, 7) : "");

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Bullet: React.FC<{ children: string }> = ({ children }) => (
  <View style={styles.bulletRow}>
    <Text style={styles.bulletDot}>•</Text>
    <Text style={styles.bulletText}>{children}</Text>
  </View>
);

interface HarvardPDFDocProps {
  data: CVData;
}

export const HarvardPDFDoc: React.FC<HarvardPDFDocProps> = ({ data }) => {
  const { personal, resumen, experiencia, educacion, certificaciones, skills, proyectos } = data;
  const skillEntries = Object.entries(skills || {}).filter(([, list]) => list && list.length > 0);

  return (
    <Document
      title={`CV - ${personal.nombre}`}
      author={personal.nombre}
      creator="Job Search Platform"
      producer="Job Search Platform"
    >
      <Page size="LETTER" style={styles.page} wrap>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.nombre}>{personal.nombre}</Text>
          {personal.ubicacion ? <Text style={styles.ubicacion}>{personal.ubicacion}</Text> : null}
          <Text style={styles.contacto}>
            {personal.email ? (
              <Link src={`mailto:${personal.email}`} style={styles.link}>
                {personal.email}
              </Link>
            ) : null}
            {personal.email && personal.telefono ? " • " : ""}
            {personal.telefono}
            {personal.linkedin ? (
              <>
                {" • "}
                <Link src={`https://${personal.linkedin.replace(/^https?:\/\//, "")}`} style={styles.link}>
                  LinkedIn
                </Link>
              </>
            ) : null}
            {personal.github ? (
              <>
                {" • "}
                <Link src={`https://${personal.github.replace(/^https?:\/\//, "")}`} style={styles.link}>
                  GitHub
                </Link>
              </>
            ) : null}
            {personal.portfolio ? (
              <>
                {" • "}
                <Link src={`https://${personal.portfolio.replace(/^https?:\/\//, "")}`} style={styles.link}>
                  Portfolio
                </Link>
              </>
            ) : null}
          </Text>
        </View>

        {/* Objetivo profesional */}
        {resumen ? (
          <Section title="OBJETIVO PROFESIONAL">
            <Text>{resumen}</Text>
          </Section>
        ) : null}

        {/* Experiencia */}
        {experiencia && experiencia.length > 0 ? (
          <Section title="EXPERIENCIA PROFESIONAL">
            {experiencia.map((exp, idx) => (
              <View key={idx} style={styles.entry} wrap={false}>
                <View style={styles.entryRow}>
                  <View style={styles.entryMain}>
                    <Text style={styles.entryTitle}>{exp.empresa}</Text>
                    <Text style={styles.entrySubtitle}>{exp.titulo}</Text>
                  </View>
                  <Text style={styles.entryDate}>
                    {formatMonth(exp.fechaInicio)} – {exp.fechaFin}
                  </Text>
                </View>
                {exp.ubicacion ? <Text style={styles.meta}>{exp.ubicacion}</Text> : null}
                {exp.descripcion.map((desc, i) => (
                  <Bullet key={i}>{desc}</Bullet>
                ))}
              </View>
            ))}
          </Section>
        ) : null}

        {/* Educación */}
        {educacion && educacion.length > 0 ? (
          <Section title="EDUCACIÓN">
            {educacion.map((edu, idx) => (
              <View key={idx} style={styles.entry} wrap={false}>
                <View style={styles.entryRow}>
                  <View style={styles.entryMain}>
                    <Text style={styles.entryTitle}>{edu.institucion}</Text>
                    <Text style={styles.entryPlain}>{edu.titulo}</Text>
                  </View>
                  <Text style={styles.entryDate}>
                    {edu.fechaInicio} – {edu.fechaFin}
                  </Text>
                </View>
                {edu.ubicacion ? <Text style={styles.meta}>{edu.ubicacion}</Text> : null}
                {edu.promedio ? <Text style={styles.meta}>Promedio: {edu.promedio}</Text> : null}
                {edu.descripcion ? <Text style={styles.meta}>{edu.descripcion}</Text> : null}
              </View>
            ))}
          </Section>
        ) : null}

        {/* Certificaciones */}
        {certificaciones && certificaciones.length > 0 ? (
          <Section title="CERTIFICACIONES">
            {certificaciones.map((cert, idx) => (
              <View key={idx} style={{ marginBottom: 4 }} wrap={false}>
                <Text style={styles.entryTitle}>{cert.nombre}</Text>
                <Text style={styles.meta}>
                  {cert.emisor} • {cert.fecha}
                </Text>
              </View>
            ))}
          </Section>
        ) : null}

        {/* Habilidades */}
        {skillEntries.length > 0 ? (
          <Section title="HABILIDADES">
            {skillEntries.map(([categoria, list]) => (
              <View key={categoria} style={styles.skillRow} wrap={false}>
                <Text style={styles.skillCat}>{categoria}: </Text>
                <Text style={styles.skillList}>{list.join(", ")}</Text>
              </View>
            ))}
          </Section>
        ) : null}

        {/* Proyectos */}
        {proyectos && proyectos.length > 0 ? (
          <Section title="PROYECTOS">
            {proyectos.map((proyecto, idx) => (
              <View key={idx} style={styles.entry} wrap={false}>
                <View style={styles.entryRow}>
                  <View style={styles.entryMain}>
                    <Text style={styles.entryTitle}>{proyecto.nombre}</Text>
                  </View>
                  <Text style={styles.entryDate}>{proyecto.fecha}</Text>
                </View>
                <Text style={styles.entryPlain}>{proyecto.descripcion}</Text>
                {proyecto.tecnologias && proyecto.tecnologias.length > 0 ? (
                  <Text style={styles.meta}>Tecnologías: {proyecto.tecnologias.join(", ")}</Text>
                ) : null}
              </View>
            ))}
          </Section>
        ) : null}
      </Page>
    </Document>
  );
};
