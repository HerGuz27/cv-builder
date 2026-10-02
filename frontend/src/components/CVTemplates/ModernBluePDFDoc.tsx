import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  Link,
  Svg,
  Path,
  Circle,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { CVData } from "../../types/cv";
import { getIniciales } from "../../utils/photo";

/**
 * Plantilla "Moderno Azul": dos columnas con foto circular.
 * La barra lateral se pinta como fondo `fixed` (se repite en cada página)
 * y el contenido va en una fila de dos columnas, así el azul llega siempre
 * hasta el pie aunque el CV ocupe varias hojas.
 */

Font.registerHyphenationCallback((word) => [word]);

const NAVY = "#1B3F72";
const BLUE = "#3A6CA8";
const SIDEBAR_W = 228; // pt, sobre una página LETTER de 612pt
const HEADER_H = 152;
const PHOTO = 116;
const RING = 5;
/** Alto del bloque superior (foto / nombre): desde ahí arranca el contenido. */
const TOP_BLOCK = 174;
/**
 * Margen superior de las páginas siguientes. El encabezado y la foto están
 * posicionados en absoluto sobre la primera página, así que el aire de arriba
 * en las páginas 2+ tiene que venir del padding de la página.
 */
const PAGE_TOP = 34;

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9.5,
    lineHeight: 1.4,
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
    paddingTop: PAGE_TOP,
    paddingBottom: 36,
  },

  // Fondos
  sidebarBg: { position: "absolute", top: 0, left: 0, bottom: 0, width: SIDEBAR_W, backgroundColor: BLUE },
  headerBg: {
    position: "absolute",
    top: 0,
    left: SIDEBAR_W,
    right: 0,
    height: HEADER_H,
    backgroundColor: NAVY,
    justifyContent: "center",
    paddingLeft: 28,
    paddingRight: 34,
  },
  nombre: { fontFamily: "Helvetica-Bold", fontSize: 27, color: "#ffffff", lineHeight: 1.15 },
  tituloProfesional: {
    fontSize: 13,
    color: "#D7E3F2",
    letterSpacing: 1.2,
    marginTop: 6,
  },

  // Foto
  fotoRing: {
    position: "absolute",
    top: 24,
    left: (SIDEBAR_W - PHOTO - RING * 2) / 2,
    width: PHOTO + RING * 2,
    height: PHOTO + RING * 2,
    borderRadius: (PHOTO + RING * 2) / 2,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  foto: { width: PHOTO, height: PHOTO, borderRadius: PHOTO / 2, objectFit: "cover" },
  fotoPlaceholder: {
    width: PHOTO,
    height: PHOTO,
    borderRadius: PHOTO / 2,
    backgroundColor: NAVY,
    alignItems: "center",
    justifyContent: "center",
  },
  iniciales: { fontFamily: "Helvetica-Bold", fontSize: 34, color: "#ffffff" },

  // Columnas
  row: { flexDirection: "row", alignItems: "stretch" },
  sidebar: { width: SIDEBAR_W, paddingHorizontal: 22, marginTop: TOP_BLOCK - PAGE_TOP },
  main: { flex: 1, paddingLeft: 28, paddingRight: 34, marginTop: TOP_BLOCK - PAGE_TOP },

  // Barra lateral
  sideTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11.5,
    color: "#ffffff",
    letterSpacing: 0.9,
    marginBottom: 8,
  },
  sideBlock: { marginBottom: 14 },
  sideRule: { borderBottomWidth: 1, borderBottomColor: "#8FB1D6", marginBottom: 14 },
  sideText: { fontSize: 9, color: "#EAF1F9" },
  sideStrong: { fontFamily: "Helvetica-Bold", fontSize: 9.5, color: "#ffffff" },
  sideMuted: { fontSize: 8.5, color: "#CBDCEF" },

  contactRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  iconBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  contactText: { flex: 1, fontSize: 8.5, color: "#ffffff" },
  link: { color: "#ffffff", textDecoration: "none" },

  bulletRow: { flexDirection: "row", marginBottom: 4 },
  bulletDot: { width: 9, fontSize: 9, color: "#ffffff" },
  bulletText: { flex: 1, fontSize: 9, color: "#EAF1F9" },
  skillCat: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    color: "#CBDCEF",
    letterSpacing: 0.5,
    marginTop: 4,
    marginBottom: 3,
  },
  eduItem: { marginBottom: 9 },

  // Columna principal
  mainTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    color: NAVY,
    letterSpacing: 0.8,
    marginBottom: 7,
  },
  mainBlock: { marginBottom: 14 },
  mainRule: { borderBottomWidth: 1.6, borderBottomColor: NAVY, marginBottom: 14 },
  parrafo: { fontSize: 9.5, color: "#333333", textAlign: "justify" },

  // Línea de tiempo de experiencia
  expEntry: { flexDirection: "row", alignItems: "stretch" },
  expRail: { width: 14, borderLeftWidth: 1.4, borderLeftColor: NAVY },
  expDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: NAVY,
    marginLeft: -4.7,
    marginTop: 3,
  },
  expBody: { flex: 1, paddingLeft: 8, paddingBottom: 12 },
  expBulletDot: { width: 9, fontSize: 9, color: "#333333", marginTop: 2 },
  expTitulo: { fontFamily: "Helvetica-Bold", fontSize: 10.5, color: NAVY },
  expEmpresa: { fontSize: 9, color: "#4a5a6a", marginTop: 2 },
  expFecha: { fontSize: 9, color: "#4a5a6a" },
  expDesc: { fontSize: 9, color: "#333333", marginTop: 4 },
  expBullet: { flexDirection: "row", marginTop: 2 },

  certItem: { marginBottom: 6 },
  certNombre: { fontFamily: "Helvetica-Bold", fontSize: 10, color: NAVY },
  certMeta: { fontSize: 8.5, color: "#5a6a7a" },
});

const formatMonth = (value?: string) => (value ? value.substring(0, 7) : "");

/** Íconos de contacto: trazos simples sobre el círculo blanco. */
const iconProps = { stroke: NAVY, strokeWidth: 2.2, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const PhoneIcon = () => (
  <Svg width={10} height={10} viewBox="0 0 24 24">
    <Path
      d="M6.8 10.6a15 15 0 006.6 6.6l2.1-2.1c.3-.3.7-.4 1.1-.3 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.6c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.3 1.1l-2.1 2z"
      {...iconProps}
    />
  </Svg>
);

const MailIcon = () => (
  <Svg width={10} height={10} viewBox="0 0 24 24">
    <Path d="M3 5.5h18v13H3z" {...iconProps} />
    <Path d="M3 6l9 7 9-7" {...iconProps} />
  </Svg>
);

const GlobeIcon = () => (
  <Svg width={10} height={10} viewBox="0 0 24 24">
    <Circle cx={12} cy={12} r={9} {...iconProps} />
    <Path d="M3 12h18" {...iconProps} />
    <Path d="M12 3c3.2 3.6 3.2 14.4 0 18-3.2-3.6-3.2-14.4 0-18z" {...iconProps} />
  </Svg>
);

const PinIcon = () => (
  <Svg width={10} height={10} viewBox="0 0 24 24">
    <Path d="M12 21s7-6.1 7-11a7 7 0 10-14 0c0 4.9 7 11 7 11z" {...iconProps} />
    <Circle cx={12} cy={10} r={2.6} {...iconProps} />
  </Svg>
);

const ContactRow: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <View style={styles.contactRow}>
    <View style={styles.iconBadge}>{icon}</View>
    <Text style={styles.contactText}>{children}</Text>
  </View>
);

interface Block {
  key: string;
  title: string;
  content: React.ReactNode;
}

/**
 * Secciones separadas por una línea *entre* bloques (nunca al final).
 * Se arman como lista para que una sección vacía no deje la línea colgando.
 */
const renderBlocks = (blocks: Block[], variant: "side" | "main") =>
  blocks.map((block, idx) => (
    <View key={block.key}>
      {idx > 0 ? <View style={variant === "side" ? styles.sideRule : styles.mainRule} /> : null}
      <View style={variant === "side" ? styles.sideBlock : styles.mainBlock}>
        <Text style={variant === "side" ? styles.sideTitle : styles.mainTitle}>{block.title}</Text>
        {block.content}
      </View>
    </View>
  ));

/** Enlace sin el esquema, como se muestra en las plantillas con foto. */
const cleanUrl = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

interface ModernBluePDFDocProps {
  data: CVData;
}

export const ModernBluePDFDoc: React.FC<ModernBluePDFDocProps> = ({ data }) => {
  const { personal, resumen, experiencia, educacion, certificaciones, skills, proyectos } = data;
  const skillEntries = Object.entries(skills || {}).filter(([, list]) => list && list.length > 0);
  const variasCategorias = skillEntries.length > 1;
  const iniciales = getIniciales(personal.nombre) || "CV";

  const webs = [personal.linkedin, personal.github, personal.portfolio].filter(Boolean) as string[];

  const sideBlocks: Block[] = [];

  if (personal.telefono || personal.email || personal.ubicacion || webs.length > 0) {
    sideBlocks.push({
      key: "contacto",
      title: "CONTACTO",
      content: (
        <>
          {personal.telefono ? <ContactRow icon={<PhoneIcon />}>{personal.telefono}</ContactRow> : null}
          {personal.email ? (
            <ContactRow icon={<MailIcon />}>
              <Link src={`mailto:${personal.email}`} style={styles.link}>
                {personal.email}
              </Link>
            </ContactRow>
          ) : null}
          {personal.ubicacion ? <ContactRow icon={<PinIcon />}>{personal.ubicacion}</ContactRow> : null}
          {webs.map((web) => (
            <ContactRow key={web} icon={<GlobeIcon />}>
              <Link src={`https://${cleanUrl(web)}`} style={styles.link}>
                {cleanUrl(web)}
              </Link>
            </ContactRow>
          ))}
        </>
      ),
    });
  }

  if (skillEntries.length > 0) {
    sideBlocks.push({
      key: "skills",
      title: "HABILIDADES",
      content: skillEntries.map(([categoria, list]) => (
        <View key={categoria}>
          {variasCategorias ? <Text style={styles.skillCat}>{categoria.toUpperCase()}</Text> : null}
          {list.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>
      )),
    });
  }

  if (educacion && educacion.length > 0) {
    sideBlocks.push({
      key: "educacion",
      title: "EDUCACIÓN",
      content: educacion.map((edu, idx) => (
        <View key={idx} style={styles.eduItem} wrap={false}>
          <Text style={styles.sideStrong}>{edu.titulo}</Text>
          <Text style={styles.sideText}>{edu.institucion}</Text>
          <Text style={styles.sideMuted}>
            {edu.fechaInicio} - {edu.fechaFin}
          </Text>
          {edu.promedio ? <Text style={styles.sideMuted}>Promedio: {edu.promedio}</Text> : null}
        </View>
      )),
    });
  }

  if (certificaciones && certificaciones.length > 0) {
    sideBlocks.push({
      key: "certificaciones",
      title: "CERTIFICACIONES",
      content: certificaciones.map((cert, idx) => (
        <View key={idx} style={styles.eduItem} wrap={false}>
          <Text style={styles.sideStrong}>{cert.nombre}</Text>
          <Text style={styles.sideMuted}>
            {cert.emisor} • {cert.fecha}
          </Text>
        </View>
      )),
    });
  }

  const mainBlocks: Block[] = [];

  if (resumen) {
    mainBlocks.push({
      key: "resumen",
      title: "ACERCA DE MÍ",
      content: <Text style={styles.parrafo}>{resumen}</Text>,
    });
  }

  if (experiencia && experiencia.length > 0) {
    mainBlocks.push({
      key: "experiencia",
      title: "EXPERIENCIA LABORAL",
      content: experiencia.map((exp, idx) => (
        <View key={idx} style={styles.expEntry} wrap={false}>
          <View style={styles.expRail}>
            <View style={styles.expDot} />
          </View>
          <View style={styles.expBody}>
            <Text style={styles.expTitulo}>{exp.titulo}</Text>
            <Text style={styles.expEmpresa}>
              {exp.empresa}
              {exp.ubicacion ? ` — ${exp.ubicacion}` : ""}
            </Text>
            <Text style={styles.expFecha}>
              {formatMonth(exp.fechaInicio)} - {exp.fechaFin}
            </Text>
            {exp.descripcion.map((desc, i) => (
              <View key={i} style={styles.expBullet}>
                <Text style={styles.expBulletDot}>•</Text>
                <Text style={styles.expDesc}>{desc}</Text>
              </View>
            ))}
          </View>
        </View>
      )),
    });
  }

  if (proyectos && proyectos.length > 0) {
    mainBlocks.push({
      key: "proyectos",
      title: "PROYECTOS",
      content: proyectos.map((proyecto, idx) => (
        <View key={idx} style={styles.certItem} wrap={false}>
          <Text style={styles.certNombre}>
            {proyecto.nombre}
            {proyecto.fecha ? ` (${proyecto.fecha})` : ""}
          </Text>
          <Text style={styles.parrafo}>{proyecto.descripcion}</Text>
          {proyecto.tecnologias && proyecto.tecnologias.length > 0 ? (
            <Text style={styles.certMeta}>{proyecto.tecnologias.join(" • ")}</Text>
          ) : null}
        </View>
      )),
    });
  }

  return (
    <Document
      title={`CV - ${personal.nombre}`}
      author={personal.nombre}
      creator="Job Search Platform"
      producer="Job Search Platform"
    >
      <Page size="LETTER" style={styles.page} wrap>
        {/* Fondo de la barra lateral: se repite en todas las páginas. */}
        <View fixed style={styles.sidebarBg} />

        {/* Encabezado: sólo en la primera página. */}
        <View style={styles.headerBg}>
          <Text style={styles.nombre}>{personal.nombre}</Text>
          {personal.titulo ? (
            <Text style={styles.tituloProfesional}>{personal.titulo.toUpperCase()}</Text>
          ) : null}
        </View>

        <View style={styles.fotoRing}>
          {personal.foto ? (
            <Image style={styles.foto} src={personal.foto} />
          ) : (
            <View style={styles.fotoPlaceholder}>
              <Text style={styles.iniciales}>{iniciales}</Text>
            </View>
          )}
        </View>

        <View style={styles.row}>
          {/* ---------- Columna izquierda ---------- */}
          <View style={styles.sidebar}>{renderBlocks(sideBlocks, "side")}</View>

          {/* ---------- Columna derecha ---------- */}
          <View style={styles.main}>{renderBlocks(mainBlocks, "main")}</View>
        </View>
      </Page>
    </Document>
  );
};
