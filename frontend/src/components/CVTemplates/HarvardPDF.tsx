import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { CVData } from "../../types/cv";

interface HarvardPDFProps {
  data: CVData;
}

const styles = StyleSheet.create({
  page: {
    padding: [45, 55],
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  contact: {
    fontSize: 9,
    color: "#333",
    marginBottom: 1,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 3,
    marginBottom: 5,
  },
  jobEntry: {
    marginBottom: 5,
    pageBreakInside: "avoid",
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  jobCompany: {
    fontWeight: "bold",
    fontSize: 11,
  },
  jobTitle: {
    fontSize: 10,
    fontStyle: "italic",
    marginBottom: 1,
  },
  jobDates: {
    fontSize: 10,
    textAlign: "right",
  },
  jobLocation: {
    fontSize: 9,
    color: "#555",
    marginBottom: 2,
  },
  bullet: {
    flexDirection: "row",
    marginLeft: 15,
    marginBottom: 2,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    lineHeight: 1.4,
  },
  certEntry: {
    marginBottom: 3,
  },
  certName: {
    fontSize: 10,
    fontWeight: "bold",
  },
  certDetail: {
    fontSize: 9,
    color: "#555",
  },
  skillCategory: {
    marginBottom: 3,
  },
  skillName: {
    fontWeight: "bold",
    fontSize: 10,
    marginBottom: 1,
  },
  skillList: {
    fontSize: 10,
    marginLeft: 12,
    lineHeight: 1.4,
  },
  eduEntry: {
    marginBottom: 4,
    pageBreakInside: "avoid",
  },
  eduHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  eduInstitution: {
    fontWeight: "bold",
    fontSize: 11,
  },
  eduDegree: {
    fontSize: 10,
    marginBottom: 1,
  },
  eduDates: {
    fontSize: 10,
    textAlign: "right",
  },
  eduDetail: {
    fontSize: 9,
    color: "#555",
    marginBottom: 1,
  },
  projectEntry: {
    marginBottom: 4,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  projectName: {
    fontWeight: "bold",
    fontSize: 11,
  },
  projectYear: {
    fontSize: 10,
  },
  projectDesc: {
    fontSize: 10,
    marginBottom: 1,
    lineHeight: 1.4,
  },
  projectTech: {
    fontSize: 9,
    color: "#555",
  },
});

export const HarvardPDF: React.FC<HarvardPDFProps> = ({ data }) => {
  return (
    <Document title={`CV-${data.personal.nombre}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personal.nombre}</Text>
          <Text style={styles.contact}>{data.personal.ubicacion}</Text>
          <Text style={styles.contact}>
            {data.personal.email} • {data.personal.telefono}
            {data.personal.linkedin && " • LinkedIn"}
            {data.personal.github && " • GitHub"}
          </Text>
        </View>

        {/* Objetivo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OBJETIVO PROFESIONAL</Text>
          <Text style={{ fontSize: 10, lineHeight: 1.4 }}>{data.resumen}</Text>
        </View>

        {/* Experiencia */}
        {data.experiencia && data.experiencia.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EXPERIENCIA PROFESIONAL</Text>
            {data.experiencia.map((exp, idx) => (
              <View key={idx} style={styles.jobEntry}>
                <View style={styles.jobHeader}>
                  <View>
                    <Text style={styles.jobCompany}>{exp.empresa}</Text>
                    <Text style={styles.jobTitle}>{exp.titulo}</Text>
                  </View>
                  <Text style={styles.jobDates}>
                    {exp.fechaInicio.substring(0, 7)} – {exp.fechaFin}
                  </Text>
                </View>
                {exp.ubicacion && <Text style={styles.jobLocation}>{exp.ubicacion}</Text>}
                {exp.descripcion.map((desc, i) => (
                  <View key={i} style={styles.bullet}>
                    <Text style={{ marginRight: 5 }}>•</Text>
                    <Text style={styles.bulletText}>{desc}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Educación */}
        {data.educacion && data.educacion.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCACIÓN</Text>
            {data.educacion.map((edu, idx) => (
              <View key={idx} style={styles.eduEntry}>
                <View style={styles.eduHeader}>
                  <View>
                    <Text style={styles.eduInstitution}>{edu.institucion}</Text>
                    <Text style={styles.eduDegree}>{edu.titulo}</Text>
                  </View>
                  <Text style={styles.eduDates}>
                    {edu.fechaInicio} – {edu.fechaFin}
                  </Text>
                </View>
                {edu.ubicacion && <Text style={styles.eduDetail}>{edu.ubicacion}</Text>}
                {edu.promedio && <Text style={styles.eduDetail}>Promedio: {edu.promedio}</Text>}
                {edu.descripcion && <Text style={styles.eduDetail}>{edu.descripcion}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Certificaciones */}
        {data.certificaciones && data.certificaciones.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CERTIFICACIONES</Text>
            {data.certificaciones.map((cert, idx) => (
              <View key={idx} style={styles.certEntry}>
                <Text style={styles.certName}>{cert.nombre}</Text>
                <Text style={styles.certDetail}>
                  {cert.emisor} • {cert.fecha}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills && Object.keys(data.skills).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>HABILIDADES</Text>
            {Object.entries(data.skills).map(([categoria, skills]) => (
              <View key={categoria} style={styles.skillCategory}>
                <Text style={styles.skillName}>{categoria}:</Text>
                <Text style={styles.skillList}>{skills.join(", ")}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Proyectos */}
        {data.proyectos && data.proyectos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROYECTOS</Text>
            {data.proyectos.map((proyecto, idx) => (
              <View key={idx} style={styles.projectEntry}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>{proyecto.nombre}</Text>
                  <Text style={styles.projectYear}>{proyecto.fecha}</Text>
                </View>
                <Text style={styles.projectDesc}>{proyecto.descripcion}</Text>
                <Text style={styles.projectTech}>
                  <Text style={{ fontWeight: "bold" }}>Tecnologías: </Text>
                  {proyecto.tecnologias.join(", ")}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
