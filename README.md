# LumoraEvents Web

Base pública de LumoraEvents construida con Astro, Tailwind CSS y despliegue estático en GitHub Pages.

## Requisitos

- Node.js 20.3+ para desarrollo local
- Node.js 22+ en CI para el workflow de GitHub Pages

## Scripts

```bash
npm install
npm run dev
npm run build
```

Scripts adicionales:

```bash
npm run check
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

- Inglés en `/`
- Español en `/es/`

El archivo `src/i18n/it.json` queda incluido como plantilla para un futuro tercer idioma. Para publicarlo, añade `it` en `src/utils/site.ts` y crea su ruta en `src/pages/it/index.astro`.

## Analytics

Configura GA4 con la variable pública:

```bash
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## GitHub Pages

El workflow usa la acción oficial `withastro/action`.

Después del primer push:

1. En GitHub, configura Pages para publicar con `GitHub Actions`.
2. En la configuración de Pages, asigna el dominio personalizado `lumoraevents.net`.

La URL `site` de Astro ya está fijada a `https://lumoraevents.net` para generar canonicals, hreflang y sitemap correctos.
