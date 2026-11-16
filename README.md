# LumoraEvents Web

Base pública de LumoraEvents construida con Astro, Tailwind CSS y despliegue estático en GitHub Pages. Cloudflare gestiona únicamente DNS, sin proxy.

## Requisitos

- Node.js 20.3+ para desarrollo local
- El workflow de GitHub Pages utiliza Node.js 20

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

La [guía de migración de idioma](docs/language-migration.md) incluye las URLs definitivas, las URLs retiradas con HTTP 404 y las comprobaciones SEO. `npm test` genera el sitio y ejecuta las pruebas de la migración sin dependencias de pruebas adicionales.

## Analytics

Configura GA4 con la variable pública:

```bash
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## GitHub Pages

El workflow `.github/workflows/deploy.yml` construye con `withastro/action` y publica el artefacto estático con `actions/deploy-pages`.

- Directorio raíz: raíz de este repositorio.
- Comando de build: `npm run build`.
- Directorio de publicación: `dist`.
- Salida de Astro: estática.
- Dominio personalizado: `lumoraevents.net`, conservado en `public/CNAME`.

No se implementan redirecciones de la migración. Las URLs retiradas, incluidas las antiguas rutas españolas con prefijo, quedan fuera del artefacto y devuelven HTTP 404. `src/pages/404.astro` genera `dist/404.html` para mostrar el error; no se copia el inicio como fallback ni se bloquean esas rutas en `robots.txt`.

La URL `site` de Astro ya está fijada a `https://lumoraevents.net` para generar canonicals, hreflang y sitemap correctos.

El workflow se ejecuta al hacer push a `main` o al iniciarlo manualmente. Para revisar cambios sin desplegar, conservarlos en local: no hacer push a `main` ni ejecutar el workflow. Esta decisión no requiere activar el proxy de Cloudflare ni utilizar Workers.
