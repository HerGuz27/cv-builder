import { CVData } from "../types/cv";

export const mockCVData: CVData = {
  personal: {
    nombre: "Juan Martínez García",
    ubicacion: "Montevideo, Uruguay",
    email: "juan.martinez@email.com",
    telefono: "+598 99 123 456",
    linkedin: "linkedin.com/in/juanmartinez",
    github: "github.com/juanmartinez",
    portfolio: "juanmartinez.dev"
  },
  resumen: "Ingeniero de Software con 5+ años de experiencia en desarrollo web y mobile. Especializado en React, Node.js y arquitectura de sistemas escalables. Fuerte orientación al trabajo en equipo, comunicación clara y delivery de soluciones de calidad.",
  experiencia: [
    {
      titulo: "Senior Full-Stack Developer",
      empresa: "TechCorp Uruguay",
      ubicacion: "Montevideo",
      fechaInicio: "2022-01",
      fechaFin: "Presente",
      descripcion: [
        "Lideré un equipo de 4 desarrolladores en la arquitectura de una plataforma SaaS con React y Node.js",
        "Reducí tiempo de carga de la aplicación en 45% optimizando bundles e implementando lazy loading",
        "Implementé CI/CD con GitHub Actions, reduciendo deployment time de 30 min a 5 min"
      ]
    },
    {
      titulo: "Full-Stack Developer",
      empresa: "StartupXYZ",
      ubicacion: "Remoto",
      fechaInicio: "2020-03",
      fechaFin: "2021-12",
      descripcion: [
        "Desarrollé features frontend con React y Redux para plataforma de e-commerce",
        "Implementé APIs REST con Node.js/Express y PostgreSQL",
        "Colaboré en documentación técnica y code reviews con el equipo"
      ]
    },
    {
      titulo: "Jr. Frontend Developer",
      empresa: "WebStudio",
      ubicacion: "Montevideo",
      fechaInicio: "2019-07",
      fechaFin: "2020-02",
      descripcion: [
        "Mantenimiento y desarrollo de componentes Vue.js para sitios web corporativos",
        "Conversión de diseños Figma a código HTML/CSS responsive"
      ]
    }
  ],
  educacion: [
    {
      titulo: "Licenciatura en Ingeniería en Informática",
      institucion: "Universidad de la República",
      ubicacion: "Montevideo",
      fechaInicio: "2015",
      fechaFin: "2019",
      promedio: "8.2/10",
      descripcion: "Proyecto final en machine learning con Python"
    }
  ],
  certificaciones: [
    {
      nombre: "AWS Solutions Architect Associate",
      emisor: "Amazon Web Services",
      fecha: "2021"
    },
    {
      nombre: "React Advanced Patterns",
      emisor: "Frontend Masters",
      fecha: "2023"
    }
  ],
  skills: {
    "Frontend": ["React", "JavaScript", "TypeScript", "CSS/SCSS", "HTML5"],
    "Backend": ["Node.js", "Express", "PostgreSQL", "MongoDB", "REST APIs"],
    "DevOps": ["Docker", "AWS", "Git", "CI/CD", "Linux"],
    "Idiomas": ["Español (Nativo)", "Inglés (Fluido)"]
  },
  proyectos: [
    {
      nombre: "Plataforma de Gestión de Proyectos",
      descripcion: "Aplicación SaaS tipo Jira con React frontend, Node.js backend y PostgreSQL",
      fecha: "2023",
      url: "github.com/juanmartinez/project-manager",
      tecnologias: ["React", "Node.js", "PostgreSQL", "Docker"]
    },
    {
      nombre: "Job Search Platform",
      descripcion: "Herramienta para optimizar búsqueda de empleo en Uruguay usando IA",
      fecha: "2024",
      url: "github.com/juanmartinez/job-search",
      tecnologias: ["React", "TypeScript", "Claude API", "Tailwind"]
    }
  ]
};
