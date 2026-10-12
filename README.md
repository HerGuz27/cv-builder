# Nexocv

Herramienta web para armar un CV y medir cuánto encaja con una oferta de trabajo.

- **Generador de CV (público, sin registro):** editor con vista previa en vivo, 2 plantillas (Harvard, optimizada para ATS, y Moderno Azul con foto) y descarga en PDF. El borrador se autoguarda en el navegador.
- **Analizador ATS (requiere cuenta):** subís tu CV en PDF, pegás el aviso y una IA devuelve el porcentaje de match, fortalezas, brechas y recomendaciones. Plan gratuito: 3 análisis por mes.
- **Historial de postulaciones (requiere cuenta):** guardás cada análisis con empresa, link, estado (postulado / entrevista / rechazado / oferta) y notas.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, MUI (iconos) |
| PDF | `@react-pdf/renderer` (generación), `pdfjs-dist` (lectura del CV subido) |
| Backend | Supabase: Auth (email + Google, PKCE), Postgres con RLS, Edge Functions |
| IA | Claude (Anthropic), llamado **solo desde una Edge Function** |
| Deploy | Vercel (frontend) |

## Estructura

```
frontend/
  src/
    pages/        # CVBuilder (/), ATS (/ats), Login, Register
    components/   # editores del CV, plantillas, ATSForm, MatchHistory, auth
    services/     # supabase, claude (llama a la Edge Function), quota, storage, pdf
    hooks/        # useCVPdf (render con debounce), useCVStorage (localStorage)
    context/      # AuthContext
supabase/
  migrations/     # (pendiente de versionar, ver "Backend")
CONTRIBUTING.md
```

## Rutas

| Ruta | Acceso |
|---|---|
| `/`, `/cv-builder` | Público |
| `/login`, `/register` | Público |
| `/ats` | Requiere sesión |

## Puesta en marcha

Requisitos: Node 18+ y un proyecto de Supabase.

```bash
cd frontend
cp .env.example .env.local   # completá URL y anon key de tu proyecto
npm install
npm run dev
```

Variables (`frontend/.env.local`):

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

Sin estas variables el generador de CV funciona igual; solo fallan login, análisis e historial.

Scripts: `npm run dev`, `npm run build`, `npm run preview`.


## Estado

MVP en desarrollo. Sin tests automatizados todavía.

## Licencia

Pendiente de definir.
