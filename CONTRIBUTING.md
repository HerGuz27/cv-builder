# Guía de Contribución

Gracias por interesarte en contribuir a **Job Search Platform**. Este documento explica cómo hacerlo.

## Código de Conducta

Se respetuoso con todos los contribuidores. No se toleran comportamientos discriminatorios.

## Cómo Reportar Bugs

1. Verifica si el bug ya fue reportado en Issues
2. Si no existe, crea un nuevo Issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs. actual
   - Tu ambiente (OS, Node version, etc.)

## Cómo Sugerir Features

1. Verifica si la feature ya fue sugerida
2. Abre un Issue con:
   - Descripción clara de la feature
   - Caso de uso y beneficio
   - Ejemplos de cómo funcionaría

## Proceso de Pull Request

### 1. Fork y Branch
```bash
git clone https://github.com/tu-usuario/job-search-platform.git
cd job-search-platform
git checkout -b feature/tu-feature-name
```

### 2. Desarrolla
```bash
# Instala dependencias
npm install

# Crea tus cambios
# Asegúrate de seguir el código existente
```

### 3. Testing
```bash
# Ejecuta linting
npm run lint

# Verifica tipos
npm run type-check

# Si hay tests, ejecuta:
npm run test
```

### 4. Commit
```bash
git commit -m "feat: descripción clara del cambio"
```

**Formato de commits:**
- `feat:` nueva feature
- `fix:` bug fix
- `docs:` cambios en documentación
- `style:` cambios de formato (sin lógica)
- `refactor:` refactoring de código
- `perf:` mejoras de performance
- `test:` agregar o actualizar tests

### 5. Push y PR
```bash
git push origin feature/tu-feature-name
```

Abre un PR contra `main` con:
- Descripción clara de cambios
- Link a issue relacionado (si existe)
- Screenshots si es UI change

## Estándares de Código

### TypeScript
- Usa tipos explícitos
- Evita `any`
- Exports nombrados preferidos

### React
- Componentes funcionales con hooks
- Props bien tipadas
- Nombres descriptivos

### Database
- Migraciones versionadas
- Comentarios en SQL complejo
- Indexes en queries comunes

### Seguridad
- No commitear secrets
- Usar environment variables
- Validar inputs del usuario

## Estructura de Carpetas

```
src/
├── pages/          # Páginas principales
├── components/     # Componentes reutilizables
├── services/       # Lógica de API/DB
├── hooks/          # Custom React hooks
├── types/          # TypeScript types
├── utils/          # Utilidades
└── styles/         # CSS/Tailwind
```

## Documentación

- Documenta cambios en README si afectan setup
- Agrega JSDoc a funciones públicas
- Comenta lógica compleja
- Actualiza CHANGELOG.md

## Performance

- Evita renders innecesarios
- Usa React.memo para componentes pesados
- Lazy load rutas cuando sea posible
- Minifica assets

## Versioning

Seguimos [Semantic Versioning](https://semver.org/):
- MAJOR: Breaking changes
- MINOR: Features nuevas
- PATCH: Bug fixes

## Preguntas?

- Abre una Discussion
- Comenta en Issues
- Email: hernangut96@gmail.com

¡Gracias por contribuir! 🙌
