# Job Search Platform

Una plataforma inteligente de búsqueda de empleo que utiliza scraping, IA y recomendaciones personalizadas para conectar candidatos con oportunidades laborales.

## 🎯 Características

- **Scraping Automático**: Recopila ofertas de empleo de múltiples fuentes (LinkedIn, GitHub Jobs, etc.)
- **Matching Inteligente**: Utiliza Claude API para analizar compatibilidad entre perfil y empleos
- **Recomendaciones Personalizadas**: Sistema de puntuación basado en habilidades y experiencia
- **Recordatorios por Email**: Notificaciones diarias de nuevas oportunidades
- **Sistema de Suscripción**: Integración con Mercado Pago para modelo freemium
- **Base de Datos en Tiempo Real**: Supabase para persistencia y escalabilidad

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase
- API key de Claude (Anthropic)
- Token de Mercado Pago (opcional)
- API key de Resend para emails (opcional)

## 🚀 Instalación

### 1. Clonar repositorio
```bash
git clone <repo-url>
cd job-search-platform
```

### 2. Configurar variables de entorno
```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Para scripts
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
ANTHROPIC_API_KEY=sk-xxx
RESEND_API_KEY=re_xxx
MERCADO_PAGO_ACCESS_TOKEN=APP_xxx
```

### 3. Instalar dependencias
```bash
# Frontend
cd frontend
npm install

# Scripts
cd ../scripts
npm install
```

### 4. Configurar Supabase
```bash
# Instalar CLI
npm install -g supabase

# Login
supabase login

# Link proyecto
supabase link --project-ref your-project-ref

# Ejecutar migraciones
supabase migration up

# Deploy funciones
supabase functions deploy
```

## 📁 Estructura del Proyecto

```
job-search-platform/
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── pages/              # Páginas de la app
│   │   ├── components/         # Componentes reutilizables
│   │   └── services/
│   │       └── supabase.ts     # Cliente Supabase
│   ├── package.json
│   └── vercel.json
│
├── scripts/                     # Node.js scripts
│   ├── scrape.js               # Scraper de empleos
│   └── package.json
│
├── supabase/                    # Backend Supabase
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   ├── functions/
│   │   ├── matching/           # Análisis con Claude
│   │   ├── webhooks/
│   │   │   └── mercado-pago.ts
│   │   └── emails/
│   │       └── send-reminder.ts
│   └── config.toml
│
├── .github/workflows/
│   └── scrape.yml              # GitHub Actions - cron job
│
└── README.md
```

## 🔧 Flujo de Datos

```
1. GitHub Actions (diario a las 9 AM UTC)
   ↓
2. Ejecuta script scrape.js
   ↓
3. Guarda empleos en Supabase (tabla jobs)
   ↓
4. Dispara función matching (Claude API)
   ↓
5. Analiza compatibilidad per usuario
   ↓
6. Guarda matches en tabla matches
   ↓
7. Envía reminders por email (Resend)
```

## 💡 Componentes Principales

### Frontend (Vite + React)
- Dashboard con empleos recomendados
- Perfil de usuario con habilidades
- Historial de aplicaciones
- Sistema de favoritos

### Scraper (Node.js)
- Extrae datos de LinkedIn, GitHub Jobs, etc.
- Limpia y normaliza información
- Evita duplicados
- Carga en Supabase

### Funciones Supabase

#### Matching (matching/index.ts)
- Analiza perfil del usuario
- Recibe batch de empleos
- Usa Claude para evaluación inteligente
- Retorna scores de compatibilidad

#### Webhooks Mercado Pago (webhooks/mercado-pago.ts)
- Recibe notificaciones de pago
- Actualiza estado de suscripción
- Activa premium features

#### Email Reminders (emails/send-reminder.ts)
- Consulta nuevos matches
- Formatea email atractivo
- Envía via Resend
- Registra entrega

## 📊 Base de Datos

### Tablas Principales

**profiles** - Datos del usuario
- id, email, display_name
- skills[], experience, preferences

**jobs** - Ofertas de empleo
- id, title, company, description
- salary_min/max, location
- requirements[], source, url

**matches** - Recomendaciones IA
- user_id, job_ids[]
- analysis (respuesta de Claude)
- scores (JSON con puntuaciones)

**saved_jobs** - Empleos guardados por usuario

**subscriptions** - Plan de suscripción

## 🤖 Uso de Claude API

La plataforma usa Claude para:
1. **Análisis de compatibilidad**: Evalúa match entre perfil y empleo
2. **Análisis de requisitos**: Desglosa skills necesarias
3. **Resumen de descripción**: Simplifica textos complejos

Ejemplo de prompt:
```typescript
const prompt = `
  Perfil: ${skills.join(", ")}
  Experiencia: ${experience} años
  
  Empleos a evaluar:
  ${jobs.map(j => `${j.title} en ${j.company}`).join("\n")}
  
  Rate cada empleo 0-100 con reasoning.
`;
```

## 🔐 Seguridad

- RLS (Row Level Security) en Supabase
- Variables de entorno para secrets
- Validación de payloads en webhooks
- Rate limiting en funciones
- CORS configurado en frontend

## 📈 Escalabilidad

- Supabase maneja millones de registros
- Functions serverless escalan automáticamente
- GitHub Actions corre en paralelo
- CDN para frontend estático (Vercel)

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run lint
npm run type-check

# Scripts
cd scripts
npm run scrape:test

# Supabase (local)
supabase functions deploy --no-verify
```

## 🚢 Deployment

### Frontend
```bash
cd frontend
npm run build
# Deploy a Vercel (conectado a repo)
```

### Supabase Functions
```bash
supabase functions deploy matching
supabase functions deploy mercado-pago
supabase functions deploy send-reminder
```

### Scripts
Automático via GitHub Actions en schedule

## 📝 Contribuir

1. Fork el repo
2. Crea rama feature (`git checkout -b feature/amazing`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a rama (`git push origin feature/amazing`)
5. Abre Pull Request

## 📄 Licencia

MIT

## 📧 Contacto

**Hernan**  
Email: hernangut96@gmail.com  
[LinkedIn](https://linkedin.com/in/hernan) | [GitHub](https://github.com/hernan)

## 🛠️ Troubleshooting

### El scraper no guarda datos
- Verificar SUPABASE_URL y SUPABASE_KEY en .env
- Comprobar permisos RLS en tabla `jobs`
- Ver logs de GitHub Actions

### Emails no se envían
- Verificar RESEND_API_KEY es válida
- Revisar función send-reminder en Supabase
- Comprobar usuario está en tabla subscriptions

### Matching lento
- Aumentar timeout en functions
- Reducir batch de jobs por request
- Implementar caché de análisis

## 🎓 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Claude API](https://docs.anthropic.com)
- [Vite Guide](https://vitejs.dev/)
- [Cheerio](https://cheerio.js.org/)
- [GitHub Actions](https://docs.github.com/actions)
