# Migración del idioma principal a español

## Infraestructura y generación estática

La web corporativa se aloja en GitHub Pages. Cloudflare gestiona únicamente DNS, sin proxy. El español es el idioma principal sin prefijo y el inglés se sirve bajo `/en/`.

Las ocho rutas antiguas se conservan como páginas HTML de redirección con `meta refresh` de 0 segundos, canonical absoluto al destino definitivo y un enlace HTML visible. GitHub Pages sirve estos archivos estáticos con HTTP 200 y el navegador sigue el `meta refresh`.

- `astro.config.mjs` mantiene `output: "static"`, `trailingSlash: "always"` y `@astrojs/sitemap`. El filtro del sitemap excluye únicamente las ocho rutas de redirección.
- `src/utils/legacy-redirects.mjs` contiene el mapa explícito de rutas antiguas y destinos definitivos.
- `src/pages/[...legacy].astro` utiliza `getStaticPaths()` para generar exclusivamente esas ocho páginas como `<ruta>/index.html`. Las rutas desconocidas siguen devolviendo 404.
- El comando `npm run build` genera `dist/` desde la raíz del repositorio.
- El artefacto contiene diez páginas de contenido, ocho páginas de redirección y `404.html`, además de assets, robots, sitemap, manifiesto, CNAME y `llms.txt`.
- `.github/workflows/deploy.yml` usa `withastro/action` para construir y subir el artefacto, y `actions/deploy-pages` para publicarlo.
- `public/CNAME` conserva `lumoraevents.net`. No se modifica la aplicación SaaS ni sus subdominios.
- `src/pages/404.astro` genera `dist/404.html` con contenido español, `noindex` y enlace al inicio. No se copia el inicio como fallback.

No se añaden redirecciones JavaScript, Workers, reglas de Cloudflare ni archivos `_redirects`. Las páginas de redirección no utilizan el layout de contenido ni cargan scripts, Analytics o consentimiento de cookies.

## URLs finales

| Página     | Español        | Inglés         |
| ---------- | -------------- | -------------- |
| Inicio     | `/`            | `/en/`         |
| Nosotros   | `/nosotros/`   | `/en/about/`   |
| Contacto   | `/contacto/`   | `/en/contact/` |
| Privacidad | `/privacidad/` | `/en/privacy/` |
| Cookies    | `/cookies/`    | `/en/cookies/` |

`/` y `/cookies/` conservan sus URLs y muestran español. Sus versiones inglesas están en `/en/` y `/en/cookies/`. Estas rutas reutilizadas sirven contenido directamente.

## Redirecciones de las URLs antiguas

| URL antigua       | Destino definitivo |
| ----------------- | ------------------ |
| `/es/`            | `/`                |
| `/es/nosotros/`   | `/nosotros/`       |
| `/es/contacto/`   | `/contacto/`       |
| `/es/privacidad/` | `/privacidad/`     |
| `/es/cookies/`    | `/cookies/`        |
| `/about/`         | `/en/about/`       |
| `/contact/`       | `/en/contact/`     |
| `/privacy/`       | `/en/privacy/`     |

El `meta refresh`, el canonical y el enlace visible apuntan a la misma URL absoluta bajo `https://lumoraevents.net`. Los destinos sirven contenido directamente, sin cadenas ni bucles de redirección. `robots.txt` permite rastrear las rutas antiguas para que los buscadores puedan leer las redirecciones.

## SEO y comportamiento conservados

- Canonical absoluto y autorreferencial en cada página de contenido, sin canonical cruzado entre idiomas.
- Hreflang `es` y `en` recíprocos y autorreferenciales para cada pareja. El `x-default` existente apunta a la versión española equivalente.
- `html lang`, títulos y descripciones específicos de cada idioma; Open Graph con URL, título, descripción e idioma coherentes.
- Sitemap generado con únicamente las diez URLs finales, sin páginas de redirección ni 404. `robots.txt` permite `/` y anuncia `sitemap-index.xml`.
- Enlaces internos y selectores de escritorio y móvil conservan las equivalencias entre idiomas.
- `llms.txt` mantiene únicamente las diez páginas finales. No hay enlaces internos a las rutas antiguas.
- No se modifican diseño, traducciones, consentimiento de cookies, Analytics ni enlaces al SaaS. Las páginas esenciales se generan en HTML durante el build.

## Archivos del ajuste

| Archivo                             | Cambio                                                        |
| ----------------------------------- | ------------------------------------------------------------- |
| `src/utils/legacy-redirects.mjs`    | Mapa explícito de las ocho redirecciones                      |
| `src/pages/[...legacy].astro`       | Plantilla que genera los ocho HTML de redirección             |
| `astro.config.mjs`                  | Exclusión de las rutas antiguas del sitemap                   |
| `tests/language-migration.test.mjs` | Comprobaciones de redirecciones, destinos, SEO y artefacto    |
| `README.md`                         | Descripción actualizada de las redirecciones en GitHub Pages  |
| `docs/language-migration.md`        | Guía de las rutas definitivas, redirecciones y comprobaciones |

## Comprobaciones locales

```bash
npm run check
npm test
```

`npm test` construye el sitio y ejecuta las pruebas con un servidor temporal de Astro preview, que se cierra al terminar. La suite comprueba:

- HTTP 200, idioma, H1 y SEO de las diez páginas finales, incluidos inicio y cookies en español.
- Canonical, hreflang, Open Graph, JSON-LD, enlaces y selectores de idioma en ambas direcciones.
- Presencia de los ocho archivos HTML de redirección en `dist/` y respuesta GET/HEAD con y sin query string.
- Un único `meta refresh` de 0 segundos por ruta antigua, canonical y enlace visible al destino esperado.
- Destinos con HTTP 200 y sin nuevas redirecciones, cadenas o bucles.
- HTTP 404 para rutas desconocidas, con y sin barra final, con y sin query string y con GET/HEAD.
- Inventario exacto de los 19 HTML, ausencia de redirecciones JavaScript y de reglas de hosting.
- `llms.txt` y sitemap con las diez páginas finales; robots, manifiesto y 404 sin cambios.

En esta revisión, `npm run check` termina sin errores, advertencias ni sugerencias; las 22 pruebas de `npm test` pasan. Prettier valida el formato de los seis archivos creados o modificados.

La comparación con un build anterior al ajuste confirma que el HTML de las diez páginas finales y de `404.html` es idéntico salvo el nombre del archivo CSS. Tailwind añade únicamente las utilidades `.visible` y `.filter`, que no se utilizan en esas páginas; el resto del CSS es idéntico. El sitemap y los demás archivos existentes mantienen su contenido.

## Publicación

Los cambios se preparan y verifican localmente antes de publicar. El push a `main` publica el ajuste mediante el workflow de GitHub Pages.

El workflow se ejecuta al hacer push a `main` o al iniciarlo manualmente. Cuando se decida publicar, GitHub Pages deberá recibir el nuevo artefacto completo, incluidos los ocho HTML de redirección. No se necesita activar el proxy de Cloudflare ni modificar su configuración.

Después de publicar, se podrán volver a comprobar las rutas antiguas en el dominio público y revisar el sitemap en Search Console. Las comprobaciones locales no implican que estas redirecciones estén desplegadas.
