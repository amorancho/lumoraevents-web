# LumoraEvents Web

Base pública de LumoraEvents construida con Astro, Tailwind CSS y despliegue estático en Cloudflare Pages conectado a GitHub.

## Requisitos

- Node.js 20.3+ para desarrollo local
- Usar una versión de Node compatible con el proyecto en Cloudflare Pages

## Scripts

```bash
npm install
npm run dev
npm run build
```

Scripts adicionales:

```bash
npm run check
npm test
npm run format
npm run preview
```

## Estructura

```text
src/
  components/
  i18n/
  layouts/
  pages/
  styles/
  utils/
public/
  images/
.github/workflows/
```

## Idiomas

- Español en `/`
- Inglés en `/en/`

Las traducciones se conservan en `src/i18n/es.json` y `src/i18n/en.json`. Las equivalencias de páginas están en `src/utils/routes.ts`; el idioma por defecto se define en `src/utils/site.ts`.

La [guía de migración de idioma](docs/language-migration.md) incluye la auditoría, el mapeo completo, las comprobaciones locales y los ajustes de Cloudflare Pages. `npm test` genera el sitio y ejecuta las pruebas de la migración sin dependencias de pruebas adicionales.

## Analytics

Configura GA4 con la variable pública:

```bash
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Cloudflare Pages

El proyecto se publica desde la integración de Cloudflare Pages con el repositorio de GitHub.

- Directorio raíz: raíz de este repositorio.
- Comando de build: `npm run build`.
- Directorio de publicación: `dist`.
- Salida de Astro: estática, sin Pages Functions.

Las redirecciones HTTP 301 están en `public/_redirects`. Astro copia este archivo a `dist/_redirects`, donde Cloudflare Pages lo interpreta de forma nativa. No requieren un Worker ni reglas manuales adicionales.

La URL `site` de Astro ya está fijada a `https://lumoraevents.net` para generar canonicals, hreflang y sitemap correctos.

El repositorio conserva `.github/workflows/deploy.yml` para GitHub Pages; ese workflow no configura Cloudflare Pages y no se ha modificado como parte de esta adaptación. Los ajustes reales del proyecto de Cloudflare se gestionan en su panel.
